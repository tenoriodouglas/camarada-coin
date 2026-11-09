const { ethers, network, run } = require("hardhat");

// Fund addresses come from the environment so the repo never carries live keys or wallets.
const { LIQUIDITY_FUND, TREASURY_FUND, SOLIDARITY_FUND } = process.env;

async function main() {
  const funds = { LIQUIDITY_FUND, TREASURY_FUND, SOLIDARITY_FUND };
  for (const [key, value] of Object.entries(funds)) {
    if (!value || !ethers.isAddress(value)) {
      throw new Error(`Missing or invalid ${key}. Set it before deploying.`);
    }
  }

  const [deployer] = await ethers.getSigners();
  console.log(`Network: ${network.name}`);
  console.log(`Deployer: ${deployer.address}`);

  const token = await ethers.deployContract("CamaradaCoin", [
    LIQUIDITY_FUND,
    TREASURY_FUND,
    SOLIDARITY_FUND,
  ]);
  await token.waitForDeployment();

  const address = await token.getAddress();
  console.log(`CamaradaCoin: ${address}`);
  console.log(`Total supply: ${ethers.formatEther(await token.totalSupply())} CMRD`);

  // Verification is part of the launch: unverified source means unverifiable promises.
  if (process.env.BASESCAN_API_KEY) {
    console.log("Waiting for block confirmations before verification...");
    await token.deploymentTransaction().wait(5);
    await run("verify:verify", {
      address,
      constructorArguments: [LIQUIDITY_FUND, TREASURY_FUND, SOLIDARITY_FUND],
    });
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
