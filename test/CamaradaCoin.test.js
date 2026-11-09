const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

const TOTAL = ethers.parseEther("1917000000");
const pct = (bps) => (TOTAL * BigInt(bps)) / 10000n;

describe("CamaradaCoin", function () {
  async function deployFixture() {
    const [deployer, liquidity, treasury, solidarity, alice, bob] = await ethers.getSigners();
    const factory = await ethers.getContractFactory("CamaradaCoin");
    const token = await factory.deploy(liquidity.address, treasury.address, solidarity.address);
    return { token, deployer, liquidity, treasury, solidarity, alice, bob };
  }

  describe("metadata", function () {
    it("exposes name, symbol and decimals", async function () {
      const { token } = await loadFixture(deployFixture);
      expect(await token.name()).to.equal("Camarada Coin");
      expect(await token.symbol()).to.equal("CMRD");
      expect(await token.decimals()).to.equal(18n);
    });

    it("pins the manifesto on-chain", async function () {
      const { token } = await loadFixture(deployFixture);
      expect(await token.MANIFESTO()).to.contain("MANIFESTO.md");
    });
  });

  describe("genesis supply", function () {
    it("mints exactly the declared max supply", async function () {
      const { token } = await loadFixture(deployFixture);
      expect(await token.totalSupply()).to.equal(TOTAL);
      expect(await token.MAX_SUPPLY()).to.equal(TOTAL);
    });

    it("splits the supply 80/15/5 with no dust left over", async function () {
      const { token, liquidity, treasury, solidarity } = await loadFixture(deployFixture);
      const balances = await Promise.all([
        token.balanceOf(liquidity.address),
        token.balanceOf(treasury.address),
        token.balanceOf(solidarity.address),
      ]);
      expect(balances[0]).to.equal(pct(8000));
      expect(balances[1]).to.equal(pct(1500));
      expect(balances[2]).to.equal(pct(500));
      expect(balances[0] + balances[1] + balances[2]).to.equal(TOTAL);
    });

    it("leaves the deployer with nothing", async function () {
      const { token, deployer } = await loadFixture(deployFixture);
      expect(await token.balanceOf(deployer.address)).to.equal(0n);
    });

    it("emits the genesis allocation event", async function () {
      const [, liquidity, treasury, solidarity] = await ethers.getSigners();
      const factory = await ethers.getContractFactory("CamaradaCoin");
      const token = await factory.deploy(liquidity.address, treasury.address, solidarity.address);
      await expect(token.deploymentTransaction())
        .to.emit(token, "GenesisAllocation")
        .withArgs(
          liquidity.address,
          pct(8000),
          treasury.address,
          pct(1500),
          solidarity.address,
          pct(500),
        );
    });

    it("stores the fund addresses as immutables", async function () {
      const { token, liquidity, treasury, solidarity } = await loadFixture(deployFixture);
      expect(await token.liquidityFund()).to.equal(liquidity.address);
      expect(await token.treasuryFund()).to.equal(treasury.address);
      expect(await token.solidarityFund()).to.equal(solidarity.address);
    });
  });

  describe("constructor guards", function () {
    it("rejects the zero address", async function () {
      const [, , treasury, solidarity] = await ethers.getSigners();
      const factory = await ethers.getContractFactory("CamaradaCoin");
      await expect(factory.deploy(ethers.ZeroAddress, treasury.address, solidarity.address))
        .to.be.revertedWithCustomError(factory, "ZeroAddress");
    });

    it("rejects repeated funds", async function () {
      const [, liquidity, treasury] = await ethers.getSigners();
      const factory = await ethers.getContractFactory("CamaradaCoin");
      await expect(factory.deploy(liquidity.address, treasury.address, liquidity.address))
        .to.be.revertedWithCustomError(factory, "DuplicateFund");
    });
  });

  describe("no privileged surface", function () {
    it("has no mint, owner, pause or blacklist entrypoint", async function () {
      const { token } = await loadFixture(deployFixture);
      const names = token.interface.fragments
        .filter((f) => f.type === "function")
        .map((f) => f.name.toLowerCase());
      for (const forbidden of [
        "mint", "owner", "transferownership", "pause", "unpause",
        "blacklist", "setfee", "settax", "upgradeto", "renounceownership",
      ]) {
        expect(names).to.not.include(forbidden);
      }
    });

    it("cannot grow the supply after deployment", async function () {
      const { token, alice, treasury } = await loadFixture(deployFixture);
      const before = await token.totalSupply();
      await token.connect(treasury).transfer(alice.address, 1n);
      expect(await token.totalSupply()).to.equal(before);
    });
  });

  describe("transfers", function () {
    it("moves tokens and charges no fee", async function () {
      const { token, treasury, alice } = await loadFixture(deployFixture);
      const amount = ethers.parseEther("1000");
      await token.connect(treasury).transfer(alice.address, amount);
      expect(await token.balanceOf(alice.address)).to.equal(amount);
    });

    it("respects allowances", async function () {
      const { token, treasury, alice, bob } = await loadFixture(deployFixture);
      const amount = ethers.parseEther("50");
      await token.connect(treasury).approve(alice.address, amount);
      await token.connect(alice).transferFrom(treasury.address, bob.address, amount);
      expect(await token.balanceOf(bob.address)).to.equal(amount);
      expect(await token.allowance(treasury.address, alice.address)).to.equal(0n);
    });

    it("reverts when the balance is insufficient", async function () {
      const { token, alice, bob } = await loadFixture(deployFixture);
      await expect(token.connect(alice).transfer(bob.address, 1n))
        .to.be.revertedWithCustomError(token, "ERC20InsufficientBalance");
    });
  });

  describe("burning", function () {
    it("lets a holder burn its own balance and shrinks the supply", async function () {
      const { token, treasury } = await loadFixture(deployFixture);
      const amount = ethers.parseEther("1");
      const supply = await token.totalSupply();
      await token.connect(treasury).burn(amount);
      expect(await token.totalSupply()).to.equal(supply - amount);
    });

    it("cannot burn another holder's balance without an allowance", async function () {
      const { token, alice, treasury } = await loadFixture(deployFixture);
      await expect(token.connect(alice).burnFrom(treasury.address, 1n))
        .to.be.revertedWithCustomError(token, "ERC20InsufficientAllowance");
    });
  });

  describe("permit (EIP-2612)", function () {
    it("approves through an off-chain signature", async function () {
      const { token, treasury, alice } = await loadFixture(deployFixture);
      const value = ethers.parseEther("10");
      const deadline = BigInt(Math.floor(Date.now() / 1000) + 3600);
      const nonce = await token.nonces(treasury.address);
      const domain = {
        name: "Camarada Coin",
        version: "1",
        chainId: (await ethers.provider.getNetwork()).chainId,
        verifyingContract: await token.getAddress(),
      };
      const types = {
        Permit: [
          { name: "owner", type: "address" },
          { name: "spender", type: "address" },
          { name: "value", type: "uint256" },
          { name: "nonce", type: "uint256" },
          { name: "deadline", type: "uint256" },
        ],
      };
      const signature = await treasury.signTypedData(domain, types, {
        owner: treasury.address,
        spender: alice.address,
        value,
        nonce,
        deadline,
      });
      const { v, r, s } = ethers.Signature.from(signature);
      await token.permit(treasury.address, alice.address, value, deadline, v, r, s);
      expect(await token.allowance(treasury.address, alice.address)).to.equal(value);
    });
  });
});
