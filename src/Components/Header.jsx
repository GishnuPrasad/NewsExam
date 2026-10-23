import { Form } from 'react-bootstrap'



function Header({ searchTerm, onSearchChange }) {
  return (
    <header className="mb-4">
      <div className="row align-items-md-center">
        <div className="col-12 col-md-6">
          <h1 className="">News Article Management System</h1>
          <p className="mb-0 text-secondary">Search Articles</p>
        </div>
        <div className="col-12 col-md-6" role="search">
          
            <Form.Control
              type="search"
              placeholder="Search Articles"
              aria-label="Search articles"
              value={searchTerm}
              onChange={(event) => onSearchChange(event.target.value)}
            />
          
        </div>
      </div>
    </header>
  )
}

export default Header
