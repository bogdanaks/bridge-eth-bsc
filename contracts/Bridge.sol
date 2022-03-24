//SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "hardhat/console.sol";
import "./IToken.sol";

contract Bridge {
  using ECDSA for bytes32;

  address public owner;
  address public validator;

  mapping (uint64 => bool) public chainList;
  mapping(string => address) public tokenList;
  mapping(bytes32 => bool) public processedSwaps;

  constructor(address _validatorAddress) {
    owner = msg.sender;
    validator = _validatorAddress;
  }

  modifier onlyOwner() {
    require(msg.sender == owner, "Only owner");
    _;
  }

  function swap(
    address _recipient,
    uint256 _amount,
    uint256 _chainTo,
    uint256 _chainFrom,
    uint256 _nonce,
    string memory _tokenSymbol
  ) external {
    require(_chainFrom != _chainTo, "Identical networks");
    bytes32 hashArgs = keccak256(
      abi.encodePacked(
        _recipient,
        _amount,
        _chainFrom,
        _chainTo,
        _nonce,
        _tokenSymbol
      )
    );

    require(!processedSwaps[hashArgs], "Already processing");

    address tokenAddress = tokenList[_tokenSymbol];
    require(tokenAddress != address(0), "Token does not exist");

    IToken(tokenAddress).burn(msg.sender, _amount);
    processedSwaps[hashArgs] = true;
    emit SwapInitialized(
      msg.sender,
      _recipient,
      block.timestamp,
      _amount,
      _chainFrom,
      _chainTo,
      _nonce,
      tokenAddress
    );
  }

  function redeem(
    address _recipient,
    uint256 _amount,
    uint256 _chainTo,
    uint256 _chainFrom,
    uint256 _nonce,
    string memory _tokenSymbol,
    bytes calldata _signature
  ) external {
    require(_chainTo != _chainFrom, "Identical networks");
    bytes32 hashArgs = keccak256(abi.encodePacked(_recipient, _amount, _chainTo, _chainFrom, _nonce, _tokenSymbol)).toEthSignedMessageHash();

    require(!processedSwaps[hashArgs], "Already processing");
    address validatorAddress = hashArgs.recover(_signature);
    require(validatorAddress == validator, "Validator address is not correct");

    processedSwaps[hashArgs] = true;

    address tokenAddress = tokenList[_tokenSymbol];
    require(tokenAddress != address(0), "Token does not exist");

    IToken(tokenAddress).mint(_recipient, _amount);

    emit SwapRedeemed(
      msg.sender,
      _recipient,
      block.timestamp,
      _amount,
      _chainFrom,
      _chainTo,
      _nonce,
      tokenAddress
    );
  }

  function updateChainById(uint64 _chainId, bool _status) public onlyOwner {
    chainList[_chainId] = _status;
  }

  function includeToken(string memory _tokenSymbol, address _tokenAddress) public onlyOwner {
    tokenList[_tokenSymbol] = _tokenAddress;
  }

  function excludeToken(string memory _tokenSymbol) public onlyOwner {
    delete tokenList[_tokenSymbol];
  }

  event SwapInitialized(
    address indexed initiator,
    address recipient,
    uint256 initTimestamp,
    uint256 amount,
    uint256 chainFrom,
    uint256 chainTo,
    uint256 nonce,
    address token
  );
  event SwapRedeemed(
    address indexed initiator,
    address recipient,
    uint256 initTimestamp,
    uint256 amount,
    uint256 chainFrom,
    uint256 chainTo,
    uint256 nonce,
    address token
  );
}