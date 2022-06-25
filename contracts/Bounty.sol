// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

//import "./PriceConverter.sol";

contract Bounty {
    videoInfo[] public videos;
    address[] stakers;
    uint256 minStakeAmount = 0;

    string public request;
    uint public deadline;
    // Video Address/String -> Struct of Video Information - for Vote Addresses
    // Staked Address -> Amount Staked
    mapping(address => uint256) public amountStaked;
    // money sent to creator address
    address winnerAddr = 0x09FD51F989179a4B04d318F8ae76CFD22c447515;

    struct videoInfo {
        address[] voterAddresses;
        address submissionAddr;
        string assetLink;
    }

    constructor(string memory _request, uint _deadlineTime) {
        request = _request;
        deadline = block.timestamp + _deadlineTime;
    }

    function stake() public payable {
        // msg.value == staked amount, need to convert this to minstake
        require(
            msg.value >= minStakeAmount,
            "You must stake atleast the original stake in order to join this bounty!"
        );
        stakers.push(msg.sender);
        amountStaked[msg.sender] = msg.value;
    }

    function withdraw() public payable {
        payable(winnerAddr).transfer(address(this).balance);
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    function upload(address _submissionAddr, string memory _assetLink)
        public
        pure
    {
        videoInfo memory newSubmission;
        newSubmission.submissionAddr = _submissionAddr;
        newSubmission.assetLink = _assetLink;
    }

    function setStakeAmt(uint _minStakeAmount) public returns (uint) {
        minStakeAmount = _minStakeAmount;
        return minStakeAmount;
    }

    // Returns videos associated with bounty
    function getVideos() public view returns (videoInfo[] memory) {
        return videos;
    }

    // Returns videos associated with bounty
    function getStakers() public view returns (address[] memory) {
        return stakers;
    }

    // Retrieve video link
    function retrieve(uint256 index) public view returns (string memory) {
        return videos[index].assetLink;
    }

    function retrieveAll() public view returns (string[] memory) {
        string[] memory videoLinks;
        for (uint256 i = 0; i < videos.length; i++) {
            videoLinks[i] = (videos[i].assetLink);
        }
        return videoLinks;
    }

    fallback() external payable {
        stake();
    }

    receive() external payable {
        stake();
    }
}
