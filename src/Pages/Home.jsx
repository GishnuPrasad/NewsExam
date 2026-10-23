import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Card, Col, Form, Modal, Row } from 'react-bootstrap'
import Header from '../Components/Header'
import {
    deleteEpisode,
    fetchEpisodes,
    getEpisodeKey,
    searchEpisode,
    updateEpisode,
} from '../store/episodesSlice'
import { FaRegTrashAlt } from 'react-icons/fa'
import { MdEdit } from 'react-icons/md'

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
    const [episodeToEdit, setEpisodeToEdit] = useState(null)
    const [editedTitle, setEditedTitle] = useState('')
    const [editedDescription, setEditedDescription] = useState('')
    const { allEpisodes, searchTerm, error, loading, hasLoaded } = useSelector(
        (state) => state.episodes,
    )
    useEffect(() => {
        dispatch(fetchEpisodes())
    }, [dispatch])

    function openEditDialog(episode) {
        setEpisodeToEdit(episode)
        setEditedTitle(episode.title || '')
        setEditedDescription(episode.desc || '')
    }

    function closeEditDialog() {
        setEpisodeToEdit(null)
    }

    function saveEpisode(event) {
        event.preventDefault()
        if (!episodeToEdit) {
            return
        }

        dispatch(
            updateEpisode({
                id: getEpisodeKey(episodeToEdit),
                changes: { title: editedTitle.trim(), desc: editedDescription },
            }),
        )
        closeEditDialog()
    }

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
                                        {(episode.title || '').slice(0, 20)}
                                        {(episode.title || '').length > 20 ? '...' : ''}
                                    </Card.Title>
                                    <Card.Text className="flex-grow-1">
                                        {(episode.desc || 'No description available.').slice(0, 40)}
                                        {(episode.desc || 'No description available.').length > 40 ? '...' : ''}
                                    </Card.Text>
                                    <div className="d-flex justify-content-between">
                                        <Button
                                            type="button"
                                            variant="danger"
                                            aria-label={`Delete ${episode.title}`}
                                            onClick={() => {
                                                if (window.confirm(`Delete "${episode.title}"?`)) {
                                                    dispatch(deleteEpisode(getEpisodeKey(episode)))
                                                }
                                            }}
                                        >
                                            <FaRegTrashAlt />
                                        </Button>
                                        <Button
                                            type="button"
                                            aria-label={`Edit ${episode.title}`}
                                            onClick={() => openEditDialog(episode)}
                                        >
                                            <MdEdit />
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}

            <Modal show={episodeToEdit !== null} onHide={closeEditDialog}>
                <Form onSubmit={saveEpisode}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit episode</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group className="mb-3" controlId="episode-title">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                required
                                value={editedTitle}
                                onChange={(event) => setEditedTitle(event.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="episode-description">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                value={editedDescription}
                                onChange={(event) => setEditedDescription(event.target.value)}
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={closeEditDialog}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary">
                            Save changes
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </main>
    )
}

export default Home
