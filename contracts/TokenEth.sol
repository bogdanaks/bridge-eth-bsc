//SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.11;

import "./base/TokenBase.sol";

contract TokenEth is TokenBase {
  constructor() TokenBase("Crypton ETH", "CRYPE") {}
}
