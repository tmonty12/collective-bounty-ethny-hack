// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "./Bounty.sol";

contract BountyFactory {
    address[] public bounties;

    function createBounty(string calldata request, uint deadline) public payable {
        Bounty newBounty = new Bounty(request, deadline, msg.sender);
        bounties.push(address(newBounty));
    
        newBounty.stake{value: msg.value}();
    }

    function getNumBounties() public view returns(uint) {
        return bounties.length;
    }
}
