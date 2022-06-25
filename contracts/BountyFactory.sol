// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "./Bounty.sol";

contract BountyFactory {
    // index to Bounty smart contract object
    address[] public bounties;
    uint public numBounties = 0;

    function createBounty(string calldata request, uint deadline) public payable {
        Bounty newBounty = new Bounty(request, deadline);
        bounties.push(address(newBounty));
        numBounties += 1;
        (bool sent,) = address(newBounty).call{value: msg.value}("");
        require(sent, "Failed to send Ether");
    }

    // function bountyStore(uint256 _BountyIndex, string _BountyLink) public {
    //     Bounty newBounty = BountyArray[_BountyIndex];
    //     newBounty.store(_BountyNumber);
    // }

    // function bountyGet(uint _index) public view returns (string) {
    //     Bounty retrievedBounty = BountyArray[_index];
    //     return retrievedBounty.retrieve();
    // }
}
