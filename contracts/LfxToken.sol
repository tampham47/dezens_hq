// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract LFX is ERC20 {
    constructor(uint amount) ERC20("LFX", "LotteryFanToken") {
        _mint(msg.sender, amount);
    }

    function burn(uint amount) external returns (bool) {
        _burn(msg.sender, amount);
        return true;
    }
}
