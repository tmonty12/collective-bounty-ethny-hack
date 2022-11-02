import { Link } from 'react-router-dom'
import { Card, Button } from 'react-bootstrap'

function BountyCard({i, request, deadline, deadlineString, balance, onExecuteBounty }) {
    const renderExecuteButton = () => {
        if (deadline > Date.now()) {
            return <></>
        } else{
            return <Button style={{ marginTop: '10px' }} onClick={() => onExecuteBounty(i) }>Execute</Button>
        }
    }

    return (
        
            <Card style={{ marginTop: '20px' }} className='bounty-card'>
                <Card.Body>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <Link to={`/bounty/${i}`} key={i}>
                        <div>
                            <Card.Title>
                                {request}
                            </Card.Title>
                            <div><strong>Deadline: </strong>{deadlineString}</div>
                            <div><strong>Current Stake: </strong>{balance} ETH</div>
                        </div>
                        </Link>
                        {renderExecuteButton()}
                    </div>
                </Card.Body>
            </Card>
    )
}

export default BountyCard;