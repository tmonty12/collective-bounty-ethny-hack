// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract Bounty {
    videoInfo[] public videos;
    address[] public stakers;
    uint256 minStakeAmount = 0.00095 ether;
    string public request;
    uint public deadline;
    bool public executed;

    mapping(address => uint256) public stakedAmount;
    
    // Map vote to index in videos array, except + 1
    // since default value is 0. Keeps track of each addresses vote choice.
    mapping(address => uint256) public videoVote;

    // Same format as videoVotes. Keeps track of what addresses have
    // submitted a video
    mapping(address => uint256) public videoSubmissions;
    
    address public bountyCreator;
    uint256 winningVideoIdx;
    uint256 highestVoteCount;

    struct videoInfo {
        address creator;
        string assetId;
        string title;
        uint256 votes;
    }

    constructor (string memory _request, uint _deadlineTime, address _bountyCreator) {
        request = _request;
        deadline = block.timestamp + _deadlineTime;
        bountyCreator = _bountyCreator;
    }

    function stake() public payable {
        require(
            msg.value >= minStakeAmount,
            "You must stake at 0.00095 ether in order to join this bounty!"
        );
        require(
            block.timestamp < deadline,
            "You can not stake after the deadline!"
        );
        
        // Using tx.origin for the case when bounty is first created from factory
        // If increasing staked amount and vote has already been delegated, increase vote of corresponding video
        if (stakedAmount[tx.origin] > 0 && videoVote[tx.origin] > 0){
            videos[videoVote[tx.origin] - 1].votes += msg.value;
        }
        if (stakedAmount[tx.origin] == 0) {
            stakers.push(tx.origin);
        }
        stakedAmount[tx.origin] += msg.value;

    }

    function execute() public {
        require(
            !executed,
            "The bounty has already been executed."
        );
        require(
            block.timestamp >= deadline,
            "This bounty is still ongoing. Please try after the deadline has passed."
        );

        executed = true;
        if (highestVoteCount == 0){
            for (uint i=0; i < stakers.length; i++){
                address staker = stakers[i];
                (bool sent, ) = payable(staker).call{value: stakedAmount[staker]}("");
                require(sent, "Failed to send Ether");
            }
        } else {
            address winner = videos[winningVideoIdx].creator;
            (bool sent, ) = payable(winner).call{value: address(this).balance}("");
            require(sent, "Failed to send Ether");
        }
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    function uploadVideo(string memory _assetId, string memory _title) public {
        require(
            videoSubmissions[msg.sender] == 0,
            "You can not upload more than one video!"
        );
        videoInfo memory newSubmission;
        newSubmission.creator = msg.sender;
        newSubmission.assetId = _assetId;
        newSubmission.title = _title;
        videos.push(newSubmission);
        videoSubmissions[msg.sender] = videos.length;
    }
    
    function getNumVideos() public view returns(uint) {
        return videos.length;
    }

    function getNumStakers() public view returns(uint) {
        return stakers.length;
    }

    fallback() external payable {
        stake();
    }

    receive() external payable {
        stake();
    }

    function vote(uint idx) public {
        require(stakedAmount[msg.sender] > 0, "You need to stake in order to be able to vote!");
        require(!executed, "The bounty has already been executed");

        if (videoVote[msg.sender] != 0) {
            videos[videoVote[msg.sender] - 1].votes -= stakedAmount[msg.sender];
        }
        videoVote[msg.sender] = idx + 1;
        videos[idx].votes += stakedAmount[msg.sender];

    
        if (videos[idx].votes > highestVoteCount) {
            winningVideoIdx = idx;
            highestVoteCount = videos[idx].votes;
        }
    }
}
