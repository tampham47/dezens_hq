// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './Lotte.sol';

contract MockLotte is Lotte {
  constructor(
    address _token,
    address _vaultAddress
  ) Lotte(_token, _vaultAddress) {}

  function getRandom() public pure override returns (uint) {
    return 11;
  }
}
