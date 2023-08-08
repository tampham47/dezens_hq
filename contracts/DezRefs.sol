//SPDX-License-Identifier: UNLICENSED

// Solidity files have to start with this pragma.
// It will be used by the Solidity compiler to validate its version.
pragma solidity ^0.8.9;

// We import this library to be able to use console.log
import 'hardhat/console.sol';

contract DezRefs {
  // An address type variable is used to store ethereum accounts.
  address public owner;

  // div by 10000 to get the actual rate
  // rate for the referrer, 1.2% of the ticket
  uint public refRateLayer1 = 120;
  // rate for the referrer, 0.55% of the ticket
  uint public refRateLayer2 = 55;
  // rate for the referrer, 0.25% of the ticket
  uint public refRateLayer3 = 25;

  // store who is the referrer of the user
  mapping(address => address) public ref;

  mapping(address => bool) public isRef;

  constructor(uint _refRateLayer1, uint _refRateLayer2, uint _refRateLayer3) {
    owner = msg.sender;
    refRateLayer1 = _refRateLayer1;
    refRateLayer2 = _refRateLayer2;
    refRateLayer3 = _refRateLayer3;
  }

  modifier isOwner() {
    require(msg.sender == owner, 'not owner');
    _;
  }

  function setRefRateLayer1(uint _refRateLayer1) external isOwner {
    refRateLayer1 = _refRateLayer1;
  }

  function setRefRateLayer2(uint _refRateLayer2) external isOwner {
    refRateLayer2 = _refRateLayer2;
  }

  function setRefRateLayer3(uint _refRateLayer3) external isOwner {
    refRateLayer3 = _refRateLayer3;
  }

  function setRef(address _user, address _ref) external {
    // just dont want to throw any error, procceds anyway
    // require(!isRef[_user], 'root ref already set');
    // require(_user != _ref, 'ref cannot be self');
    // require(ref[_user] == address(0), 'ref already set');
    // require(ref[_ref] != _user, 'ref cannot be referrer');

    if (
      !isRef[_user] &&
      _user != _ref &&
      ref[_user] == address(0) &&
      ref[_ref] != _user
    ) {
      isRef[_ref] = true;
      ref[_user] = _ref;
    }
  }

  function getRefLayers(
    address _user
  ) external view returns (address[3] memory) {
    address[3] memory refs;
    refs[0] = ref[_user];
    refs[1] = ref[refs[0]];
    refs[2] = ref[refs[1]];
    return refs;
  }

  function getRefFees() external view returns (uint[3] memory) {
    uint[3] memory refFees;
    refFees[0] = refRateLayer1;
    refFees[1] = refRateLayer2;
    refFees[2] = refRateLayer3;
    return refFees;
  }
}
