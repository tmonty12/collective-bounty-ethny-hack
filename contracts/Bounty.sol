// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

//import "./PriceConverter.sol";

contract Bounty {
    //using PriceConverter for uint256;
    // stake, vote, upload
    // Create an array
    videoInfo[] public videos;
    address[] stakers;
    uint256 minStakeAmount = 0;
    string public request;
    uint public deadline;

    // Video Address/String -> Struct of Video Information - for Vote Addresses
    // Staked Address -> Amount Staked
    mapping(address => uint256) public addressToAmount;
    mapping(address => bool) public voterAddresses;
    // money sent to creator address
    address winnerAddr = 0x09FD51F989179a4B04d318F8ae76CFD22c447515;
    address originalStakingAddr;
    uint256 winningIdx;
    bool winnerAssigned = false;

    // Highest vote count - this is a running stat
    uint256 highestCount = 0;

    uint256[] public votes;
    // ID for each video is index in videos array
    struct videoInfo {
        address[] voterAddresses;
        address submissionAddr;
        string assetLink;
    }

    constructor(
        string memory _request,
        uint _deadlineTime,
        address _stakingAddr
    ) {
        request = _request;
        deadline = block.timestamp + _deadlineTime;
        originalStakingAddr = _stakingAddr;
        stake();
    }

    function stake() public payable {
        if (stakers.length == 0) {
            stakers.push(originalStakingAddr);
            addressToAmount[originalStakingAddr] = msg.value;
            voterAddresses[originalStakingAddr] = true;
            minStakeAmount = msg.value;
        } else {
            // msg.value == staked amount, need to convert this to minstake
            require(
                msg.value >= minStakeAmount,
                "You must stake at least the original stake in order to join this bounty!"
            );
            stakers.push(msg.sender);
            addressToAmount[msg.sender] = msg.value;
            voterAddresses[msg.sender] = true;
            minStakeAmount = msg.value;
        }
    }

    function withdraw() public payable {
        require(
            block.timestamp >= deadline,
            "This bounty is still ongoing. Please try after the deadline has passed."
        );

        winnerAddr = videos[winningIdx].submissionAddr;
        payable(winnerAddr).transfer(address(this).balance);
    }

    function getWinner() public view returns (uint256) {
        return winningIdx;
    }

    function getMinStake() public view returns (uint256) {
        return minStakeAmount;
    }

    // Used to find total amount staked
    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    function upload(string memory _assetLink) public {
        require(
            !voterAddresses[msg.sender],
            "You do not have the ability to upload videos on this!"
        );
        videoInfo memory newSubmission;
        newSubmission.submissionAddr = msg.sender;
        newSubmission.assetLink = _assetLink;
        videos.push(newSubmission);
        votes.push(0);
    }

    function setStakeAmt(uint _minStakeAmount) public returns (uint) {
        minStakeAmount = _minStakeAmount;
        return minStakeAmount;
    }

    function getVideo(uint256 index) public view returns (videoInfo memory) {
        return videos[index];
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

    function vote(uint idx) public {
        require(
            voterAddresses[msg.sender],
            "You do not have the ability to vote on this!"
        );
        voterAddresses[msg.sender] = false;
        videos[idx].voterAddresses.push(msg.sender);
        votes[idx] = votes[idx] + 1;

        if (votes[idx] > highestCount) {
            winningIdx = idx;
            highestCount = votes[idx];
            winnerAssigned = true;
        }
    }

    // Only run after deadline has closed, and submissions should be stopped. Awards money after.
    function tallyVotes() public {
        require(
            winnerAssigned,
            "There were no votes cast. The stake will be returned to the stakers."
        );
        require(
            highestCount > 0,
            "There were no votes cast. The stake will be returned to the stakers."
        );
        withdraw();
    }
}
