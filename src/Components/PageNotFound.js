import { Container } from 'react-bootstrap'

function PageNotFound() {
    return (
        <Container style={{ marginTop: '20px', marginBottom: '20px'}}>
            <div style={{ textAlign: 'center', marginTop: '20px', marginBottom: '20px'}}>
                    <h1>404 Page Not Found</h1>
                    <span className="material-symbols-outlined" style={{ fontSize: '50px', color:'grey'}}>block</span>
                </div>
        </Container>
    )
}

export default PageNotFound