# Origami Network Token Sale
In this document, we describe the token sale specification and implementation,
and give an overview over the smart contracts structure.

## Informal Specification
The token sale is open to everybody.

Preminted tokens are allocated to 3 different addresses.
* 30 000 000 ORI (60%) are sent to the token sale contract
* 15 000 000 ORI (30%) are sent to the company wallet
* 5 000 000 ORI (10%) are sent to the bounty wallet








### Per module description
The system has 2 modules : the token sale (OrigamiTokenSale.sol) and the token (OrigamiToken.sol)






#### The token (OrigamiToken.sol)
Implemented in `OrigamiToken.sol`. 
It inherits from `StandardToken.sol` by Open Zeppelin (ERC20 standard token)
It inherits from `Ownable.sol` by Open Zeppelin
It uses `SafeMath.sol` by Open Zeppelin

The token is fully compatible with ERC20 standard, with the next two additions:
1. The tokens become transferable 7 days after the token sale start.

2. A draining function (for ERC20 tokens), in case of.



### Use of zeppelin code
We use open-zeppling code for `SafeMath`, `Ownable` and `StandardToken` logic (and as base code : `StandardCrowdsale.sol`).

# Ganache-cli  commandline
ganache-cli --account="0xad34324f7371dbe4504d3a10239dc1b539839a40ab5ce5938027b1c9dc3430bd,10000000000000000000000000000000000000000000000000000000000000000000000000000" --account="0x1ba414a85acdd19339dacd7febb40893458433bee01201b7ae8ca3d6f4e90994,10000000000000000000000000000000000000000000000000000000000000000000000000000" --account="0x48b97a730734725f3e7cc91cdee82a59c93c1f976c811a4a8b790602e7fd619f,10000000000000000000000000000000000000000000000000000000000000000000000000000" --account="0xb383a09e0c750bcbfe094b9e17ee31c6a9bb4f2fcdc821d97a34cf3e5b7f5429,10000000000000000000000000000000000000000000000000000000000000000000000000000" --account="0x5f1859eee362d44b90d4f3cdd14a8775f682e08d34ff7cdca7e903d7ee956b6a,10000000000000000000000000000000000000000000000000000000000000000000000000000" --account="0x311b38806f4fe591edee839fc7240cd4cf136a81dc69444fcf3c4ce8aba20e0c,10000000000000000000000000000000000000000000000000000000000000000000000000000" --account="0x3b1b8f928630142d62878e521161780a873961d70002c4d7dabd8e4eea35982f,10000000000000000000000000000000000000000000000000000000000000000000000000000" --account="0xaea22713416604d48ef525a7c65aea87a638227fb6e42f22e9f412fa99151ec4,10000000000000000000000000000000000000000000000000000000000000000000000000000" --account="0x69ce511e39c01aabc46bf6280ed0454f83f174a70448b2496e294f359af9d484,10000000000000000000000000000000000000000000000000000000000000000000000000000" --account="0x97292cc6c00ec2cb8be515be4d6af2ed15e5466587408f57cb2ff46a57c8b5a2,10000000000000000000000000000000000000000000000000000000000000000000000000000" 