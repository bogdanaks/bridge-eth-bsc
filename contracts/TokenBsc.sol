//SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.11;

import "./base/TokenBase.sol";

contract TokenBsc is TokenBase {
  constructor() TokenBase("Crypton BSC", "CRYPB") {}
}
