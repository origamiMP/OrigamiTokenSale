var OrigamiTokenCrowdsale = artifacts.require("./OrigamiTokenCrowdsale.sol");


// Copy & Paste this
Date.prototype.getUnixTime = function() { return this.getTime()/1000|0 };
if(!Date.now) Date.now = function() { return new Date(); }
Date.time = function() { return Date.now().getUnixTime(); }


var tokenSaleContract;

module.exports = function(deployer) {
    /*var publicSaleStartTime = new Date("Fri, 12 Jan 2018 07:00:00 GMT").getUnixTime();
    var publicSaleEndTime = new Date("Thu, 15 Feb 2018 07:00:00 GMT").getUnixTime();*/

    var publicSaleStartTime = new Date("Wed, 13 Dec 2017 12:00:00 GMT").getUnixTime();
    var publicSaleEndTime = new Date("Wed, 13 Dec 2017 17:00:00 GMT").getUnixTime();

	console.log( "#################################################################################");
	console.log( "publicSaleStartTime : "+publicSaleStartTime);
	console.log( "publicSaleStartTime : "+new Date(publicSaleStartTime*1000));
	console.log( "publicSaleEndTime : "+publicSaleEndTime);
	console.log( "publicSaleEndTime : "+new Date(publicSaleEndTime*1000));
	console.log( "#################################################################################");
    return OrigamiTokenCrowdsale.new(publicSaleStartTime, publicSaleEndTime).then(function(result){
        tokenSaleContract = result;
    });
};
