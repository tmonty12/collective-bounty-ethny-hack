// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "./Bounty.sol";

contract BountyFactory {
    // index to Bounty smart contract object
    address[] public bounties;
    uint public numBounties = 0;

    function createBounty(string calldata request, uint deadline) public payable {
        Bounty newBounty = new Bounty(request, deadline, msg.sender);
        bounties.push(address(newBounty));
        numBounties += 1;

        (bool sent, ) = address(newBounty).call{value: msg.value}("");
        require(sent, "Failed to send Ether");
    }
}
