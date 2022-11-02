import { useEffect, useState } from 'react'
import { Card, ListGroup, Button, Spinner } from 'react-bootstrap'
import { retrieveAsset } from '../livepeer.js'
import { sleep } from '../utils.js'

function Video({ video, key, videoIdx, videoVote, hasStaked, onVoteForVideo, votesPlaced }) {
    const [videoVoteIdx, setVideoVoteIdx] = useState(videoVote)
    const [url, setUrl] = useState('')

    const onClick = () => {
        onVoteForVideo(videoIdx)
        setVideoVoteIdx(videoIdx+1)
    }

    const getPlayBackUrl = async () => {
        let doneUploading = false;
        while (!doneUploading) {
            const res = await retrieveAsset(video.assetId)
            if (res.status.phase === 'ready') {
                setUrl(res.downloadUrl)
                doneUploading = true;
            }
            await sleep(1000)
        }
        
    }

    const renderVoteButton = (videoIdx, videoVote) => {
        if (!hasStaked) {
            return <></>
        } else if (videoVote > 0){
            if (videoIdx+1 === videoVoteIdx) {
                return <Button variant='success' style={{ marginRight: '10px', display: 'flex'}}>Voted For<span className='material-symbols-outlined' style={{ marginLeft: '5px'}}>check_box</span></Button>
            } else {
                return <Button variant='warning' style={{ marginRight: '10px', display: 'flex'}} onClick={() => onVoteForVideo(videoIdx)}>Change Vote</Button>
            }
        } else {
            return <Button style={{ marginRight: '10px', display: 'flex'}} onClick={onClick}>Vote For Video</Button>
        }
    }

    const renderVideo = () => {
        if (url === ''){
            return (
                <Spinner animation='border' role='status'>
                    <span className='visually-hidden'>Loading...</span>
                </Spinner>
            )
        } else {
            return (
                <video controls style={{width: '100%'}}>
                    <source type="video/mp4" src={url}></source>
                </video>
            )
        }
    }

    useEffect(() => {
        getPlayBackUrl()
    }, [])

    return (
        <Card style={{ marginTop: '20px',  }} key={key} >
            <Card.Header style={{ fontWeight: 'bold', fontSize: '24px', display: 'flex', justifyContent: 'space-between'}}>
                <div style={{ marginLeft: '10px'}}>{video.title}</div>
                {renderVoteButton(videoIdx, videoVote)}
            </Card.Header>
            <Card.Body>
                {renderVideo()}
            </Card.Body>
            <ListGroup className='list-group-flush' style={{ textAlign: 'left'}}>
                <ListGroup.Item style={{ backgroundColor: '#F7F7F7'}}><strong>Created By: </strong>{video.creator}</ListGroup.Item>
                <ListGroup.Item style={{ backgroundColor: '#F7F7F7'}}><strong>Votes: </strong>{parseInt(video.votes.toString()) / (10**18)}</ListGroup.Item>
                <ListGroup.Item style={{ backgroundColor: '#F7F7F7'}}><strong>Share of Votes Placed: </strong>{votesPlaced > 0 ? Math.round((parseInt(video.votes.toString()) / (10**18) / votesPlaced)*100,0) : 0}%</ListGroup.Item>
            </ListGroup>
        </Card>
    )
}

export default Video;