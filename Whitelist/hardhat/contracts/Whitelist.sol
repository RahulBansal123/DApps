//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract Whitelist{
    // Max number of whitelisted address 
    uint256 public immutable MAX_ADDRESSES;

    // Total number of whitelisted address
    uint256 public totalWhitelisted = 0;

    // Mapping of whitelisted address
    mapping(address => bool) public whitelistedAddresses;

    constructor(uint256 maxAddresses) public{
        MAX_ADDRESSES = maxAddresses;
    }

    // Function to add the address to whitelistedAddresses
    function addToWhitelisted() public{
        require(totalWhitelisted < MAX_ADDRESSES, "Reached the maximum capacity of whitelisted addresses");
        require(!whitelistedAddresses[msg.sender],"You are already whitelisted");
        whitelistedAddresses[msg.sender] = true;
        totalWhitelisted++;
    }
}