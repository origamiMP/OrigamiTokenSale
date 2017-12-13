pragma solidity ^0.4.17;

import "./base/crowdsale/CappedCrowdsale.sol";
import "./base/token/StandardToken.sol";
import './OrigamiToken.sol';


/**
 * @title OrigamiTokenCrowdsale
 * @dev 
 * We add new features to a base crowdsale using multiple inheritance.
 * We are using the following extensions:
 * CappedCrowdsale - sets a max boundary for raised funds
 * WhitelistedCrowdsale - add a whitelist
 *  *
 * The code is based on the contracts of Open Zeppelin and we add our contracts : OrigamiTokenCrowdsale and the Origami Token
 *
 * @author ori.network
 */
contract OrigamiTokenCrowdsale is Ownable, StandardCrowdsale, CappedCrowdsale {

	// hard cap of the token sale in ether
    uint private constant HARD_CAP_IN_WEI = 5000 ether;
	
	// Total of Origami Token supply
    uint public constant TOTAL_ORIGAMI_TOKEN_SUPPLY = 50000000;
    
    // Token sale rate from ETH to ORI
    uint private constant RATE_ETH_ORI = 6000;
    
    // Token initialy distributed for the company (30%)
    address public constant TEAM_VESTING_WALLET = 0x4e96617d23a9d6d41fe706f159c0bdc7ee97db0d;
    uint public constant TEAM_VESTING_AMOUNT = 15000000e18;

    // Token initialy distributed for the early investor (10%)
    address public constant BOUNTY_WALLET = 0xb80438e752527fa4b3d890a4192f8000025c79f9;
    uint public constant BOUNTY_AMOUNT = 5000000e18;

    // PERIOD WHEN TOKEN IS NOT TRANSFERABLE AFTER THE SALE
    uint public constant PERIOD_AFTERSALE_NOT_TRANSFERABLE_IN_SEC = 3 days;


	function OrigamiTokenCrowdsale(uint256 _startTime, uint256 _endTime)
      CappedCrowdsale(HARD_CAP_IN_WEI)
      StandardCrowdsale(_startTime, _endTime, RATE_ETH_ORI, TEAM_VESTING_WALLET)
    {
        token.transfer(TEAM_VESTING_WALLET, TEAM_VESTING_AMOUNT);
        token.transfer(BOUNTY_WALLET, BOUNTY_AMOUNT);
    }


	/**
     * @dev Create the Origami token (override createTokenContract of StandardCrowdsale)
     * @return the StandardToken created
     */
    function createTokenContract () 
      internal 
      returns(StandardToken) 
    {
        return new OrigamiToken(TOTAL_ORIGAMI_TOKEN_SUPPLY, endTime.add(PERIOD_AFTERSALE_NOT_TRANSFERABLE_IN_SEC), TEAM_VESTING_WALLET, BOUNTY_WALLET);
    }

    /**
     * @dev Transfer the unsold tokens to the team multisign wallet 
     * @dev Only for owner
     * @return the StandardToken created
     */
    function drainRemainingToken () 
      public
      onlyOwner
    {
        require(hasEnded());
        token.transfer(TEAM_VESTING_WALLET, token.balanceOf(this));
    }


}