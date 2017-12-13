console.log("lol");

//return;
var OrigamiTokenSale = artifacts.require("./OrigamiTokenCrowdsale.sol");
var OrigamiToken = artifacts.require("./OrigamiToken.sol");
var BigNumber = require('bignumber.js');
var expectThrow = async function(promise) {
  try {
    await promise;
  } catch (error) {
    const invalidOpcode = error.message.search('invalid opcode') >= 0;
    const invalidJump = error.message.search('invalid JUMP') >= 0;
    const outOfGas = error.message.search('out of gas') >= 0;
    assert(
      invalidOpcode || invalidJump || outOfGas,
      "Expected throw, got '" + error + "' instead",
    );
    return;
  }
  assert.fail('Expected throw not received');
};


contract('Creation Token Sale', function(accounts) {

	console.log("lol2");
	// account setting ----------------------------------------------------------------------
	var admin = accounts[0];
	var teamWallet = accounts[1];
	var bountyWallet = accounts[2];

	var randomGuy1 = accounts[3];
	// tool const ----------------------------------------------------------------------------
	const day = 60 * 60 * 24 * 1000;
	const dayInsecond = 60 * 60 * 24;
	const second = 1000;

	// crowdsale setting ---------------------------------------------------------------------
	const name = "Origami Token";
	const symbol = "ORI";
	const decimals = 18;
	const amountCrowdSale = 30000000;
	const amountTokenSupply = 50000000;
	const rateETHORI = 6000;
		// translate with decimal for solitidy
	const amountTokenSupplySolidity = (new BigNumber(10).pow(decimals)).mul(amountTokenSupply);
	const capCrowdsaleInETH = 5000;
		// setting in wei for solidity
	const capCrowdsaleInWei = web3.toWei(capCrowdsaleInETH, "ether");

	// Token initialy distributed for the team (30%)
	const TEAM_VESTING_WALLET = teamWallet;
	const TEAM_VESTING_AMOUNT = 15000000;

	// Token initialy distributed for the bounty (10%)
	const BOUNTY_WALLET = bountyWallet;
	const BOUNTY_AMOUNT = 5000000;


	// variable to host contracts ------------------------------------------------------------
	var origamiTokenSale;
	var origamiToken;

	it("Create regular crowdsale", async function() {
		currentTimeStamp = web3.eth.getBlock(web3.eth.blockNumber).timestamp;
		startTimeSolidity = currentTimeStamp + 2*dayInsecond;
		endTimeSolidity = startTimeSolidity + 3*dayInsecond;

		// create de crowdsale
		origamiTokenSale = await OrigamiTokenSale.new(startTimeSolidity, endTimeSolidity);
		// retrieve the Token itself
		console.log("looog");
		origamiToken = await OrigamiToken.at(await origamiTokenSale.token.call());
		console.log("log 2");
		// Crowdsale 
		assert((await origamiTokenSale.cap.call()).equals(capCrowdsaleInWei), "cap is wrong");
		assert.equal(await origamiTokenSale.rate.call(), rateETHORI, "rate is wrong");
		//assert.equal(await origamiTokenSale.baseEthCapPerAddress.call(), 0, "baseEthCapPerAddress is wrong");
		assert.equal(await origamiTokenSale.startTime.call(), startTimeSolidity, "startTime is wrong");
		assert.equal(await origamiTokenSale.endTime.call(), endTimeSolidity, "endTime is wrong");
		assert.equal(await origamiTokenSale.wallet.call(), teamWallet, "wallet is wrong");
		assert.equal(await origamiTokenSale.weiRaised.call(), 0, "weiRaised is wrong");
		assert.equal(await origamiTokenSale.owner.call(), admin, "owner is wrong");

		// Token
		assert.equal(await origamiToken.name.call(), name, "name is wrong");
		assert.equal(await origamiToken.symbol.call(), symbol, "symbol is wrong");
		assert.equal(await origamiToken.decimals.call(), decimals, "decimals is wrong");
		assert.equal(await origamiToken.owner.call(), teamWallet, "owner is wrong");

		assert((await origamiToken.totalSupply.call()).equals(amountTokenSupplySolidity), "totalSupply is wrong");
		console.log(origamiToken.balanceOf(origamiTokenSale.address));
		console.log("xd");
		
		
		

		assert((new BigNumber(10).pow(18)).mul(amountCrowdSale).equals(await origamiToken.balanceOf(origamiTokenSale.address)), "origamiTokenSale.address balance");
		console.log(origamiToken.balanceOf(origamiTokenSale.address));
		console.log("ahah");
		console.log((new BigNumber(10).pow(18)).mul(BOUNTY_AMOUNT));

		var test = await origamiToken.balanceOf(bountyWallet);


		console.log(test.toString());
		assert((new BigNumber(10).pow(18)).mul(BOUNTY_AMOUNT).equals(await origamiToken.balanceOf(bountyWallet)), "bountyWallet balance");

	

		assert((new BigNumber(10).pow(18)).mul(TEAM_VESTING_AMOUNT).equals(await origamiToken.balanceOf(teamWallet)), "companyWallet balance");

	});


	/*it("Create crowdsale with wrong parameters", async function() {

		// startTime before now	opcode
		const startTimeBeforeNow = new Date("2016-10-13").getTime();
		const startTimeBeforeNowSolidity = Math.floor(startTimeBeforeNow/1000);
		const endTimeSolidity = new Date("2016-10-13").getTime();
		const endTimeSoliditySolidity = Math.floor(endTimeSolidity/1000);
		await expectThrow(OrigamiTokenSale.new(startTimeBeforeNowSolidity, endTimeSoliditySolidity));

		// endTime before startTime	opcode
		const startTime = new Date("2017-10-11").getTime();
		const startTimeSolidity = Math.floor(startTime/1000);

		const endBeforeStart = new Date("2017-09-11").getTime();
		const endBeforeStartSolidity = Math.floor(endBeforeStart/1000);
		await expectThrow(OrigamiTokenSale.new(startTimeSolidity, endBeforeStartSolidity));
	});*/

});


