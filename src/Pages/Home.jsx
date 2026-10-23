import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Card, Col, Row } from 'react-bootstrap'
import Header from '../Components/Header'
import { fetchEpisodes, searchEpisode } from '../store/episodesSlice'
import { FaRegTrashAlt } from 'react-icons/fa'
import { MdEdit } from "react-icons/md";




function getEpisodeKey(episode) {
    return String(episode.id ?? `${episode.number}-${episode.title}`)
}

function getEpisodeDetails(number) {
    const [season, episode] = String(number ?? '')
        .split('-')
        .map((part) => part.trim())

    if (!season || !episode) {
        return 'Episode details unavailable'
    }
    return `Season ${season}, Episode ${episode}`
}
function Home() {
    const dispatch = useDispatch()
    const { allEpisodes, searchTerm, error, loading, hasLoaded } = useSelector(
        (state) => state.episodes,
    )
    useEffect(() => {
        dispatch(fetchEpisodes())
    }, [dispatch])





    return (
        <main style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 16px' }}>
            <Header
                searchTerm={searchTerm}
                onSearchChange={(value) => dispatch(searchEpisode(value))}
            />

            {loading && <p role="status">Loading episodes...</p>}

            {!loading && error && (
                <div role="alert">
                    <p>{error}</p>
                    <button
                        onClick={() => dispatch(fetchEpisodes())}
                        style={{
                            padding: '7px 12px',
                            border: '1px solid #aaa',
                            borderRadius: 4,
                            background: '#fff',
                            cursor: 'pointer',
                        }}
                    >
                        Try again
                    </button>
                </div>
            )}

            {hasLoaded && !loading && !error && searchTerm && allEpisodes.length === 0 && (
                <p role="status">No result “{searchTerm}”.</p>
            )}

            {!loading && !error && allEpisodes.length > 0 && (
                <Row className="g-4" as="section" aria-label="Futurama episodes">
                    {allEpisodes.map((episode) => (
                        <Col key={getEpisodeKey(episode)} xs={12} sm={6} md={4} lg={3}>
                            <Card className="h-100" style={{ width: '100%' }}>
                                <Card.Header className=" text-center">
                                    {getEpisodeDetails(episode.number)}
                                </Card.Header>
                                <Card.Body className="d-flex flex-column">
                                    <Card.Title className="text-warning">
                                        {episode.title.slice(0, 20)}
                                        {episode.title.length > 20 ? '...' : ''}
                                    </Card.Title>
                                    <Card.Text className="flex-grow-1">
                                        {(episode.desc || 'No description available.').slice(0, 40)}
                                        {(episode.desc || 'No description available.').length > 40 ? '...' : ''}
                                    </Card.Text>
                                    <div className="d-flex justify-content-between">
                                        <Button type="button">
                                            <FaRegTrashAlt/>
                                        </Button>
                                        <Button type="button">
                                            <MdEdit/>
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </main>
    )
}

export default Home
