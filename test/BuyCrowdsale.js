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


contract('Buy token sale', function(accounts) {
	// account setting ----------------------------------------------------------------------
	var admin = accounts[0];
	var teamWallet = accounts[1];
	var bountyWallet = accounts[2];

	var randomGuy1 = accounts[3];
	var randomGuy2 = accounts[4];
	var randomGuy3 = accounts[5];
	var randomGuy4 = accounts[6];
	var randomGuy5 = accounts[7];
	var randomGuy6 = accounts[8];

	// tool const ----------------------------------------------------------------------------
	const day = 60 * 60 * 24 * 1000;
	const dayInSecond = 60 * 60 * 24;
	const second = 1000;
	const gasPriceMax = 50000000000;

	// crowdsale setting ---------------------------------------------------------------------
	const name = "Origami Token";
	const symbol = "ORI";
	const decimals = 18;
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

	beforeEach(async () => {
		const currentTimeStamp = web3.eth.getBlock(web3.eth.blockNumber).timestamp;
		const startTimeSolidity = currentTimeStamp + 2*dayInSecond;
		const endTimeSolidity 	= startTimeSolidity + 3*dayInSecond;

		// create de crowdsale
		origamiTokenSale = await OrigamiTokenSale.new(startTimeSolidity, endTimeSolidity);
		// retrieve the Token itself
		origamiToken = await OrigamiToken.at(await origamiTokenSale.token.call());

		//var baseCapPerAddressWei = web3.toWei(10, "ether");

		//await requestTokenSale.setBaseEthCapPerAddress(baseCapPerAddressWei,{from:admin});
		//await requestTokenSale.changeRegistrationStatus(randomGuy1, true, {from:admin});

	});

	it("buy token ", async function() {
		addsDayOnEVM(2);
		var walletBalanceEthBefore = await web3.eth.getBalance(teamWallet);

		var weiSpend = web3.toWei(2, "ether");
		// buy token within cap should work	
		var r = await origamiTokenSale.sendTransaction({from:randomGuy1,value:weiSpend, gasPrice:gasPriceMax});

		assert.equal(r.logs[0].event, 'TokenPurchase', "event is wrong");
		assert.equal(r.logs[0].args.purchaser, randomGuy1, "purchaser is wrong");
		assert(r.logs[0].args.value.equals(weiSpend), "value is wrong");
		assert(r.logs[0].args.amount.equals(weiSpend*rateETHORI), "amount is wrong");

		// check token arrived on buyer
		console.log((new BigNumber(10).pow(18)).mul(12000));
		console.log(await origamiToken.balanceOf(randomGuy1));

		assert((new BigNumber(10).pow(18)).mul(12000).equals(await origamiToken.balanceOf(randomGuy1)), "randomGuy1 balance");

		console.log((new BigNumber(10).pow(18)).mul(30000000-12000));
		console.log(await origamiToken.balanceOf(origamiTokenSale.address));

		assert((new BigNumber(10).pow(18)).mul(30000000-12000).equals(await origamiToken.balanceOf(origamiTokenSale.address)), "origamiTokenSale.address balance");
		// check money arrived :
		assert((new BigNumber(walletBalanceEthBefore)).add(weiSpend).equals(await web3.eth.getBalance(teamWallet)), "teamWallet eth balance");

		// buy token within cap should work	
		r = await origamiTokenSale.sendTransaction({from:randomGuy1,value:weiSpend, gasPrice:gasPriceMax});

		assert.equal(r.logs[0].event, 'TokenPurchase', "event is wrong");
		assert.equal(r.logs[0].args.purchaser, randomGuy1, "purchaser is wrong");
		assert(r.logs[0].args.value.equals(weiSpend), "value is wrong");
		assert(r.logs[0].args.amount.equals(weiSpend*rateETHORI), "amount is wrong");



		console.log((new BigNumber(10).pow(18)).mul(24000));
		console.log(await origamiToken.balanceOf(randomGuy1));

		// check token arrived on buyer
		assert((new BigNumber(10).pow(18)).mul(24000).equals(await origamiToken.balanceOf(randomGuy1)), "randomGuy1 balance");

		console.log((new BigNumber(10).pow(18)).mul(30000000-24000));
		console.log(await origamiToken.balanceOf(origamiTokenSale.address));


		assert((new BigNumber(10).pow(18)).mul(30000000-24000).equals(await origamiToken.balanceOf(origamiTokenSale.address)), "origamiTokenSale.address balance");
		// check money arrived :
		assert((new BigNumber(walletBalanceEthBefore)).add(weiSpend).add(weiSpend).equals(await web3.eth.getBalance(teamWallet)), "teamWallet eth balance");
	});


	/*it("buy token impossible", async function() {
		addsDayOnEVM(2);
		var weiSpend = web3.toWei(2, "ether");

		// buy not being on whitelist	opcode
		await expectThrow(origamiTokenSale.sendTransaction({from:randomGuy2,value:weiSpend, gasPrice:gasPriceMax}));

		// Buy 0 token	opcode
		await expectThrow(origamiTokenSale.sendTransaction({from:randomGuy1,value:0, gasPrice:gasPriceMax}));

		// gas price more than 50Gwei	opcode
		await expectThrow(origamiTokenSale.sendTransaction({from:randomGuy1,value:weiSpend, gasPrice:gasPriceMax+1}));
	});*/



	/*it("buy before sale start => opcode", async function() {
		var weiSpend = web3.toWei(2, "ether");

		// buy before sale start 2days before => opcode
		await expectThrow(origamiTokenSale.sendTransaction({from:randomGuy1,value:weiSpend, gasPrice:gasPriceMax}));
		addsDayOnEVM(1);
		
		// buy before sale start 1day before => opcode
		await expectThrow(origamiTokenSale.sendTransaction({from:randomGuy1,value:weiSpend, gasPrice:gasPriceMax}));
	});*/

	/*it("buy after sale end => opcode", async function() {
		addsDayOnEVM(5);
		var weiSpend = web3.toWei(2, "ether");

		// buy after sale end => opcode
		await expectThrow(origamiTokenSale.sendTransaction({from:randomGuy1,value:weiSpend, gasPrice:gasPriceMax}));
	});*/


	var addsDayOnEVM = async function(days) {
		var daysInsecond = 60 * 60 * 24 * days 
		var currentBlockTime = web3.eth.getBlock(web3.eth.blockNumber).timestamp;
		await web3.currentProvider.send({jsonrpc: "2.0", method: "evm_increaseTime", params: [daysInsecond], id: 0});
		await web3.currentProvider.send({jsonrpc: "2.0", method: "evm_mine", params: [], id: 0});
	}


});


