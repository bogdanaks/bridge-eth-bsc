//SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.11;

import "../IToken.sol";

contract BridgeBase {
  address public owner;
  IToken public token;
  // uint256 public nonce;
  // mapping(uint256 => bool) public nonces; // TODO add it 

  enum Step { PENDING, SWAPPED, REDEEMED }
  // event Transfer(
  //   address from,
  //   address to,
  //   uint256 amount,
  //   uint256 date,
  //   uint256 nonce,
  //   Step indexed step
  // );

  mapping (uint64 => bool) public chainList;
  mapping (address => bool) public tokensList;
  mapping(bytes32 => Step) public processedSwaps;

  constructor(address _token) {
    owner = msg.sender;
    token = IToken(_token);
  }

  modifier onlyOwner() {
      require(msg.sender == owner, "Only owner");
      _;
    }

  function swap(
    address _recipient,
    uint256 _amount,
    uint256 _chainTo,
    uint256 _nonce,
    address _tokenAddress
  ) external {
    uint256 chainFrom = getChainId();
    require(chainFrom != _chainTo, "Identical networks");
    bytes32 hashArgs = keccak256(
      abi.encodePacked(
        _recipient,
        _amount,
        chainFrom,
        _chainTo,
        _nonce,
        _tokenAddress
      )
    );

    require(processedSwaps[hashArgs] != Step.SWAPPED, "Already processing");

    token.burn(msg.sender, _amount);
    // TODO add event
  }

  function redeem(
    address _recipient,
    uint256 _amount,
    uint256 _chainFrom,
    uint256 _nonce,
    address _tokenAddress,
    bytes calldata _signature
  ) external {
    uint256 chainTo = getChainId();
    require(chainTo != _chainFrom, "Identical networks");
    bytes32 hashArgs = keccak256(
      abi.encodePacked(
          _recipient,
          _amount,
          _chainFrom,
          chainTo,
          _nonce,
          _tokenAddress
      )
    ).toEthSignedMessageHash();

    require(processedSwaps[hashArgs] == Step.PENDING, "Already processing");
    address validAddress = hashArgs.recover(_signature);
  }

  function checkSign(address _address, uint256 _value, uint8 _v, bytes32 _r, bytes32 _s) public returns(bool) {
    bytes32 message = keccak256(abi.encodePacked(_address, _value));
    address _address = ecrecover(hashMessage(message), _v, _r, _s);
    if (_address == msg.sedner) {
      return true;
    } else {
     return false;
    }
  }

  function hashMessage(bytes32 message) private pure returns (bytes32) {
    bytes memory prefix = "\x19Ethereum Signed Message:\n32";
    return keccak256(abi.encodePacked(prefix, message));
  }

  function updateChainById(uint64 _chainId, bool _status) public onlyOwner {
    chainList[_chainId] = _status;
    // TODO add event
  }

  function includeToken(address _tokenAddress) public onlyOwner {
    tokensList[_tokenAddress] = true;
    // TODO add event
  }

  function excludeToken(address _tokenAddress) public onlyOwner {
    tokensList[_tokenAddress] = false;
    // TODO add event
  }

  function getChainId() public view returns (uint256 chainId) {
      assembly {
          id := chainid()
      }
  }

  event SwapInitialized(
      address indexed initiator,
      address recipient,
      uint256 initTimestamp,
      uint256 amount,
      uint256 chainFrom,
      uint256 chainTo,
      uint256 nonce,
      string symbol
  );
}