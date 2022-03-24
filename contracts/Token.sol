//SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract Token is ERC20, AccessControl {
  bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
  bytes32 public constant BRIDGE_ROLE = keccak256("BRIDGE_ROLE");

  constructor(string memory _name, string memory _symbol) ERC20(_name, _symbol) {
    _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _setRoleAdmin(BRIDGE_ROLE, DEFAULT_ADMIN_ROLE);
  }

  modifier onlyOwnerAndBridge() {
    require(hasRole(BRIDGE_ROLE, msg.sender) || hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Only owner or bridge");
    _;
  }

  function mint(address _to, uint256 _amount) external onlyOwnerAndBridge() {
    _mint(_to, _amount);
  }

  function burn(address _owner, uint256 _amount) external onlyOwnerAndBridge() {
    _burn(_owner, _amount);
  }
}
