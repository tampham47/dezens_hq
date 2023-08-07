//SPDX-License-Identifier: UNLICENSED

// Solidity files have to start with this pragma.
// It will be used by the Solidity compiler to validate its version.
pragma solidity ^0.8.9;

// We import this library to be able to use console.log
import 'hardhat/console.sol';

import './DezRefs.sol';

contract DezRefsTest {
  DezRefs public refs;

  constructor(address _refs) {
    refs = DezRefs(_refs);
  }

  function setRef(address _ref) external returns (uint8) {
    bool t = refs.setRef(msg.sender, _ref);
    return t ? 1 : 0;
  }
}
