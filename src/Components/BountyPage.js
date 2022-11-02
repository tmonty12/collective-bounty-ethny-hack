import { Container, Stack, Button, Card } from 'react-bootstrap'
import ConnectWallet from './ConnectWallet';
import Video from './Video';
import { useEffect, useState } from 'react'
import Bounty from '../artifacts/contracts/Bounty.sol/Bounty.json'
import BountyFactory from '../artifacts/contracts/BountyFactory.sol/BountyFactory.json'
import { ethers, utils } from 'ethers';
import { useParams, Link } from 'react-router-dom';
import { retrieveTasks } from '../livepeer';

const bountyFactoryAddress = process.env.REACT_APP_BOUNTY_FACTORY_ADDRESS

function BountyPage ({connectBtnText, chainId}) {
    const [isStaked, setIsStaked] = useState(null)
    const [uploaded, setUploaded] = useState(false)
    const [request, setRequest] = useState(null)
    const [deadline, setDeadline] = useState('')
    const [balance, setBalance] = useState(0)
    const [stakers, setStakers] = useState(0)
    const [votes, setVotes] = useState(0)
    const [votesAvailable, setVotesAvailable] = useState(0)
    const [creator, setCreator] = useState('')
    const [numVideos, setNumVideos] = useState(null)
    const [videos, setVideos] = useState(null)
    const [userVideo, setUserVideo] = useState(null)
    const [bountyDNE, setBountyDNE] = useState(false)
    const {index} = useParams()

    const getBounty = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const bountyFactory = new ethers.Contract(bountyFactoryAddress, BountyFactory.abi, signer)

        if (index < 0 || index >= (await bountyFactory.getNumBounties()).toNumber()){
            setBountyDNE(true)
        } else {
            const bountyAddress = await bountyFactory.bounties(index)
            const bounty = new ethers.Contract(bountyAddress, Bounty.abi, signer)
            let deadline = (await bounty.deadline()).toNumber()
            const options = { day: '2-digit', year: 'numeric', month: '2-digit', hour:'2-digit', minute: '2-digit'}
            deadline = (new Date(deadline*1000)).toLocaleDateString('en-US', options)
            const request = (await bounty.request()).toString()
            const balance = parseInt((await bounty.getBalance()).toString()) / (10**18)
            const creator = (await bounty.bountyCreator()).toString()
            const numVideos = (await bounty.getNumVideos())
            const numStakers = (await bounty.getNumStakers()).toString()

            setRequest(request)
            setDeadline(deadline)
            setBalance(balance)
            setCreator(creator)
            setNumVideos(numVideos)
            setStakers(numStakers)

            let votesPlaced = 0;
            let totalVotesAvailable = 0;
            for (let i=0; i < numStakers; i++){
                let staker = (await bounty.stakers(i))
                totalVotesAvailable += parseInt((await bounty.stakedAmount(staker)).toString()) / (10**18)
                const videoVote = parseInt((await bounty.videoVote(staker)).toString())
                if (videoVote > 0) {
                    votesPlaced += parseInt((await bounty.stakedAmount(staker)).toString()) / (10**18)
                }
            }

            setVotes(votesPlaced)
            setVotesAvailable(totalVotesAvailable)

            // check if already staked
            window.ethereum.request({ method: "eth_accounts" })
                .then(async (accounts) => {
                    if (accounts.length !== 0) {
                        const currentAddress = utils.getAddress(accounts[0]);
                        const videoVote = parseInt((await bounty.videoVote(currentAddress)).toString())

                        bounty.stakedAmount(currentAddress).then(async (stakeAmount) => {
                            stakeAmount = parseInt(stakeAmount.toString() / (10**18))
                            let hasStaked = stakeAmount > 0
                            setIsStaked(hasStaked)
                            let videos = []
                            for (let i=0; i < numVideos; i++) {
                                const video = await bounty.videos(i)
                                if (video.creator === currentAddress) {
                                    setUploaded(true)
                                    setUserVideo((
                                        <Video video={video} key={video.videoUrl} videoIdx={i} videoVote={videoVote} hasStaked={hasStaked} onVoteForVideo={onVoteForVideo} votesPlaced={votesPlaced}/>
                                    ))
                                }
                                videos.push(
                                    <Video video={video} key={video.videoUrl} videoIdx={i} videoVote={videoVote} hasStaked={hasStaked} onVoteForVideo={onVoteForVideo} votesPlaced={votesPlaced}/>
                                )
                            }
                            setVideos(videos)
                        })
                    }
                })

        }
        
    }

    const onVoteForVideo = async (videoIdx) => {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const bountyFactory = new ethers.Contract(bountyFactoryAddress, BountyFactory.abi, signer)
        const bountyAddress = await bountyFactory.bounties(index)
        const bounty = new ethers.Contract(bountyAddress, Bounty.abi, signer)
        const vote = await bounty.vote(videoIdx)
        await vote.wait()
        window.location.reload()
    }

    function body() {
        if (bountyDNE) {
            return (
                <div style={{ textAlign: 'center', marginTop: '20px', marginBottom: '20px'}}>
                    <h1>Bounty does not exist</h1>
                    <span className="material-symbols-outlined" style={{ fontSize: '50px', color:'grey'}}>block</span>
                </div>
            )
        } else if (isStaked == null || numVideos == null || videos == null) {
            return <></>
        } else if (isStaked && numVideos > 0) {
            return (
                <div style={{ textAlign: 'center', marginTop: '20px', marginBottom: '20px'}}>
                    <h1>Videos</h1>
                    <>{videos}</>
                </div>
            )
        } else if (isStaked) {
            return (
                <div style={{ textAlign: 'center', marginTop: '20px', marginBottom: '20px'}}>
                    <h1>Currently no videos</h1>
                    <Link to={`/bounty/${index}/upload`}><span className="material-symbols-outlined" style={{ fontSize: '50px'}}>add_box</span></Link>
                </div>
            )
        } else if (uploaded && numVideos > 0) {
            return (
                <div style={{ textAlign: 'center', marginTop: '20px', marginBottom: '20px'}}>
                    <h1>Your Video</h1>
                    {userVideo}
                    <h1 style={{ marginTop: '20px' }}>Stake to see more videos</h1>
                    <span className="material-symbols-outlined" style={{ fontSize: '50px', color:'grey'}}>lock</span>
                </div>
            )
        } else {
            return (
                <div style={{ textAlign: 'center', marginTop: '20px', marginBottom: '20px'}}>
                    <h1>Stake to see videos</h1>
                    <span className="material-symbols-outlined" style={{ fontSize: '50px', color:'grey'}}>lock</span>
                </div>
            )
        }
    }

    const renderButtons = () => {
        if (isStaked == null || numVideos == null || videos == null){
            return <></>
        }
        else if (uploaded) {
            return (
                <Stack direction="horizontal" gap={3} >
                    <Link to={`/bounty/${index}/stake`}><Button>Stake</Button></Link>
                </Stack>
            )
        } else {
            return (
                <Stack direction="horizontal" gap={3}>
                    <Link to={`/bounty/${index}/stake`}><Button>Stake</Button></Link>
                    <Link to={`/bounty/${index}/upload`}><Button variant="secondary">Upload Video</Button></Link>
                </Stack>
            )
        }
    }

    const renderBountyCard = () => {
        if (request == null){
            return <></>
        } else {
            return (
                <Card style={{ marginTop: '20px' }}>
                    <Card.Body>
                        <Card.Title>
                            {request}
                        </Card.Title>
                        <div><strong>Deadline: </strong>{deadline}</div>
                        <div><strong>Current Stake: </strong>{balance} ETH</div>
                        <div><strong>Number of Stakers: </strong>{stakers}</div>
                        <div><strong>Votes Placed: </strong>{votes}</div>
                        <div><strong>Total Available Votes: </strong>{votesAvailable}</div>
                        <div><strong>Voter Participation: </strong>{Math.round((votes / votesAvailable) * 100, 0)}%</div>
                        <div><strong>Created By: </strong>{creator}</div>
                    </Card.Body>
                </Card>
            )
        }
        
    }

    const renderBackButton = () => {
        if (isStaked == null || numVideos == null || videos == null) {
            return <></>
        } else {
            return <Link to="/"><Button ><span className="material-symbols-outlined">arrow_back</span></Button></Link>
        }
    }

    useEffect(() => {
        getBounty();
    }, [])


    return (
        <Container style={{ marginTop: '20px', marginBottom: '20px'}}>
            <ConnectWallet connectBtnText={connectBtnText} chainId={chainId}>
                {renderButtons()}
                {renderBountyCard()}
                {body()}
                {renderBackButton()}
            </ConnectWallet>
        </Container>
    )
}

export default BountyPage;