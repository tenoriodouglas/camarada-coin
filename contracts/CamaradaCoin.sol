// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity 0.8.28;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

/**
 * @title Camarada Coin (CMRD)
 * @notice Fixed-supply ERC-20 token for the Camarada Coin collective.
 *
 * Trust model, enforced by code and not by promises:
 *  - Total supply is minted once, inside the constructor. There is no mint path afterwards.
 *  - There is no owner, admin, pauser, upgrade proxy, blacklist or transfer fee.
 *  - Allocation percentages are compile-time constants, so the distribution is
 *    auditable in the verified source and immutable after deployment.
 *  - Holders may burn their own balance; nobody can burn someone else's.
 *
 * Supply = 1,917,000,000 CMRD, a nod to 1917.
 */
contract CamaradaCoin is ERC20, ERC20Burnable, ERC20Permit {
    /// @notice Whole tokens minted at deployment (18 decimals applied below).
    uint256 public constant MAX_SUPPLY = 1_917_000_000 ether;

    /// @notice Allocation in basis points (10_000 = 100%).
    uint16 public constant LIQUIDITY_BPS = 8_000; // 80% - public liquidity pool
    uint16 public constant TREASURY_BPS = 1_500; // 15% - community multisig treasury
    uint16 public constant SOLIDARITY_BPS = 500; //  5% - contributor/solidarity fund
    uint16 private constant _BPS_DENOMINATOR = 10_000;

    /// @notice Permanent pointer to the manifesto this deployment commits to.
    string public constant MANIFESTO = "https://github.com/tenoriodouglas/camarada-coin/blob/main/MANIFESTO.md";

    /// @notice Addresses that received the one-time allocation.
    address public immutable liquidityFund;
    address public immutable treasuryFund;
    address public immutable solidarityFund;

    /// @notice Emitted once, at deployment, to make the genesis split indexable.
    event GenesisAllocation(
        address indexed liquidityFund,
        uint256 liquidityAmount,
        address indexed treasuryFund,
        uint256 treasuryAmount,
        address indexed solidarityFund,
        uint256 solidarityAmount
    );

    error ZeroAddress();
    error DuplicateFund();

    /**
     * @param liquidityFund_ Receives the liquidity allocation; its LP tokens are meant to be burned.
     * @param treasuryFund_ Community multisig.
     * @param solidarityFund_ Contributor rewards and donations.
     */
    constructor(address liquidityFund_, address treasuryFund_, address solidarityFund_)
        ERC20("Camarada Coin", "CMRD")
        ERC20Permit("Camarada Coin")
    {
        if (liquidityFund_ == address(0) || treasuryFund_ == address(0) || solidarityFund_ == address(0)) {
            revert ZeroAddress();
        }
        // Distinct funds keep the on-chain split meaningful and auditable.
        if (
            liquidityFund_ == treasuryFund_ || liquidityFund_ == solidarityFund_ || treasuryFund_ == solidarityFund_
        ) {
            revert DuplicateFund();
        }

        liquidityFund = liquidityFund_;
        treasuryFund = treasuryFund_;
        solidarityFund = solidarityFund_;

        uint256 liquidityAmount = (MAX_SUPPLY * LIQUIDITY_BPS) / _BPS_DENOMINATOR;
        uint256 treasuryAmount = (MAX_SUPPLY * TREASURY_BPS) / _BPS_DENOMINATOR;
        // Remainder avoids rounding dust and guarantees total == MAX_SUPPLY.
        uint256 solidarityAmount = MAX_SUPPLY - liquidityAmount - treasuryAmount;

        _mint(liquidityFund_, liquidityAmount);
        _mint(treasuryFund_, treasuryAmount);
        _mint(solidarityFund_, solidarityAmount);

        emit GenesisAllocation(
            liquidityFund_, liquidityAmount, treasuryFund_, treasuryAmount, solidarityFund_, solidarityAmount
        );
    }
}
