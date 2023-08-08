//SPDX-License-Identifier: UNLICENSED

// Solidity files have to start with this pragma.
// It will be used by the Solidity compiler to validate its version.
pragma solidity ^0.8.9;

// We import this library to be able to use console.log
import 'hardhat/console.sol';

import './DezRefs.sol';

contract DezMM {
  // An address type variable is used to store ethereum accounts.
  address public owner;
  IERC20 public immutable dez;
  DezRefs public refs;
  address public immutable vaultAddress;
  uint public initialTs;

  uint public winner; // 0 = undecided, 1 = musk, 2 = mark, 3 = dismissed
  uint public finalizeTs;
  uint public totalMusk;
  uint public totalMark;

  // the system fee rate, 2.0% of the ticket
  // div by 10000 to get the actual rate
  uint public systemFeeRate = 200;
  // the system fee rate, 2.0% of the ticket
  // div by 10000 to get the actual rate
  uint public systemBurnRate = 200;

  mapping(address => uint256) public teamMusk;
  mapping(address => uint256) public teamMark;

  event WinnerSet(uint winner);
  event Withdraw(address indexed spender, uint amount);
  event Bet(address indexed spender, uint team, uint amount);

  constructor(
    address _dez,
    address _refs,
    address _vaultAddress,
    uint _finalizeTs
  ) {
    owner = msg.sender;
    initialTs = block.timestamp;
    finalizeTs = _finalizeTs;

    dez = IERC20(_dez);
    refs = DezRefs(_refs);
    vaultAddress = _vaultAddress;
  }

  function _mintMusk(address _to, uint _amount) private {
    totalMusk += _amount;
    teamMusk[_to] += _amount;
  }

  function _burnMusk(address _from, uint _amount) private {
    totalMusk -= _amount;
    teamMusk[_from] -= _amount;
  }

  function _mintMark(address _to, uint _amount) private {
    totalMark += _amount;
    teamMark[_to] += _amount;
  }

  function _burnMark(address _from, uint _amount) private {
    totalMark -= _amount;
    teamMark[_from] -= _amount;
  }

  function _isAddress(address _a) private pure returns (bool) {
    return _a != address(0);
  }

  modifier isOwner() {
    require(msg.sender == owner, 'caller is not the owner');
    _;
  }

  function setFinalizeTs(uint _finalizeTs) external isOwner {
    require(block.timestamp < _finalizeTs, 'invalid finalize ts');
    finalizeTs = _finalizeTs;
  }

  function setSystemFeeRate(uint _systemFeeRate) external isOwner {
    require(_systemFeeRate <= 10000, 'invalid system fee rate');
    systemFeeRate = _systemFeeRate;
  }

  function setSystemBurnRate(uint _systemBurnRate) external isOwner {
    require(_systemBurnRate <= 10000, 'invalid system burn rate');
    systemBurnRate = _systemBurnRate;
  }

  function setWinner(uint _winner) external isOwner {
    require(winner == 0, 'winner already decided');
    require(_winner == 1 || _winner == 2 || _winner == 3, 'invalid winner');

    uint poolBalance = dez.balanceOf(address(this));
    uint fees = (poolBalance * systemFeeRate) / 10000;
    uint burnAmount = (poolBalance * systemBurnRate) / 10000;

    winner = _winner;

    // burn
    dez.burn(burnAmount);
    // send fees to vault
    dez.transfer(vaultAddress, fees);
    emit WinnerSet(_winner);
  }

  function betOnMusk(uint _amount, address refAddress) external {
    require(block.timestamp < finalizeTs, 'betting has ended');

    address sender = msg.sender;
    uint amount = _amount;

    // assign the ref address to the sender
    refs.setRef(msg.sender, refAddress);

    // calculate ref fees for users
    address[3] memory addLayers = refs.getRefLayers(sender);
    uint[3] memory refFees = refs.getRefFees();

    if (_isAddress(addLayers[0])) {
      uint refFee1 = (_amount * refFees[0]) / 10000;
      amount -= refFee1;
      dez.transferFrom(sender, addLayers[0], refFee1);
    }
    if (_isAddress(addLayers[1])) {
      uint refFee2 = (_amount * refFees[1]) / 10000;
      amount -= refFee2;
      dez.transferFrom(sender, addLayers[1], refFee2);
    }
    if (_isAddress(addLayers[2])) {
      uint refFee3 = (_amount * refFees[2]) / 10000;
      amount -= refFee3;
      dez.transferFrom(sender, addLayers[2], refFee3);
    }

    // mint the org amount to the user
    _mintMusk(sender, _amount);
    // but only transfer the amount after the ref fees
    dez.transferFrom(sender, address(this), amount);
    emit Bet(sender, 1, _amount);
  }

  function betOnMark(uint _amount, address refAddress) external {
    require(block.timestamp < finalizeTs, 'betting has ended');

    address sender = msg.sender;
    uint amount = _amount;

    // assign the ref address to the sender
    refs.setRef(msg.sender, refAddress);

    // calculate ref fees for users
    address[3] memory addLayers = refs.getRefLayers(sender);
    uint[3] memory refFees = refs.getRefFees();

    if (_isAddress(addLayers[0])) {
      uint refFee1 = (_amount * refFees[0]) / 10000;
      amount -= refFee1;
      dez.transferFrom(sender, addLayers[0], refFee1);
    }
    if (_isAddress(addLayers[1])) {
      uint refFee2 = (_amount * refFees[1]) / 10000;
      amount -= refFee2;
      dez.transferFrom(sender, addLayers[1], refFee2);
    }
    if (_isAddress(addLayers[2])) {
      uint refFee3 = (_amount * refFees[2]) / 10000;
      amount -= refFee3;
      dez.transferFrom(sender, addLayers[2], refFee3);
    }

    _mintMark(sender, _amount);
    dez.transferFrom(sender, address(this), amount);
    emit Bet(sender, 2, _amount);
  }

  function getPrize(address sender) external view returns (uint) {
    if (winner == 0) return 0;

    uint userShares;
    uint totalShares;

    if (winner == 1) {
      userShares = teamMusk[sender];
      totalShares = totalMusk;
    } else if (winner == 2) {
      userShares = teamMark[sender];
      totalShares = totalMark;
    } else if (winner == 3) {
      userShares = teamMusk[sender] + teamMark[sender];
      totalShares = totalMusk + totalMark;
    }

    uint poolBalance = dez.balanceOf(address(this));
    uint prizes = (userShares * poolBalance) / totalShares;

    return prizes;
  }

  function withdraw() external {
    address sender = msg.sender;
    require(winner != 0, 'winner not decided');
    require(
      (teamMusk[sender] > 0 && winner == 1) ||
        (teamMark[sender] > 0 && winner == 2) ||
        (winner == 3),
      'not a winner'
    );

    uint userShares;
    uint totalShares;

    if (winner == 1) {
      userShares = teamMusk[sender];
      totalShares = totalMusk;
      _burnMusk(sender, teamMusk[sender]);
    } else if (winner == 2) {
      userShares = teamMark[sender];
      totalShares = totalMark;
      _burnMark(sender, teamMark[sender]);
    } else if (winner == 3) {
      userShares = teamMusk[sender] + teamMark[sender];
      totalShares = totalMusk + totalMark;
      _burnMusk(sender, teamMusk[sender]);
      _burnMark(sender, teamMark[sender]);
    }

    require(totalShares > 0, 'no shares');
    uint poolBalance = dez.balanceOf(address(this));
    uint tokenReceive = (userShares * poolBalance) / totalShares;

    // send amount to user
    dez.transfer(sender, tokenReceive);
    emit Withdraw(sender, tokenReceive);
  }

  function getInformation(
    address sender
  ) external view returns (uint, uint, uint, uint, uint, uint, uint, uint) {
    uint userShares;
    uint totalShares;
    uint betMusk = teamMusk[sender];
    uint betMark = teamMark[sender];

    if (winner == 1) {
      userShares = betMusk;
      totalShares = totalMusk;
    } else if (winner == 2) {
      userShares = betMark;
      totalShares = totalMark;
    } else if (winner == 3) {
      userShares = betMusk + betMark;
      totalShares = totalMusk + totalMark;
    }

    uint poolBalance = dez.balanceOf(address(this));
    uint prizes = totalShares != 0
      ? (userShares * poolBalance) / totalShares
      : 0;

    return (
      finalizeTs,
      poolBalance,
      totalMusk,
      totalMark,
      betMusk,
      betMark,
      winner,
      prizes
    );
  }
}

interface IERC20 {
  function totalSupply() external view returns (uint);

  function balanceOf(address account) external view returns (uint);

  function transfer(address recipient, uint amount) external returns (bool);

  function allowance(
    address owner,
    address spender
  ) external view returns (uint);

  function approve(address spender, uint amount) external returns (bool);

  function transferFrom(
    address sender,
    address recipient,
    uint amount
  ) external returns (bool);

  function burn(uint amount) external;

  event Transfer(address indexed from, address indexed to, uint amount);
  event Approval(address indexed owner, address indexed spender, uint amount);
}
