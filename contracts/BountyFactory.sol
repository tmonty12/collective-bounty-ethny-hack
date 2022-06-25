// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "./Bounty.sol";

contract BountyFactory {
    // index to Bounty smart contract object
    Bounty[] public bountyArray;

    function createBounty() public {
        bountyArray.push(new Bounty());
    }

    function bountyStore(uint256 _BountyIndex, string _BountyLink) public {
        Bounty newBounty = BountyArray[_BountyIndex];
        newBounty.store(_BountyNumber);
    }

    function bountyGet(uint _index) public view returns (string) {
        Bounty retrievedBounty = BountyArray[_index];
        return retrievedBounty.retrieve();
    }
}
