import { Nav, Navbar, Container, NavDropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap"; 
import { Link } from "react-router-dom";

const NavigationBar = () => {
  // Get the mentor value from localStorage
  const mentor = localStorage.getItem("mentor");

  const navigate = useNavigate();

  // Function to clear localStorage and navigate to the home page
  const handleMentorChange = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <Navbar
      // bg="primary"
      variant="dark"
      expand="lg"
      style={{ marginBottom: "40px"}}
    >
      <Container className="px-3">
        <Navbar.Brand as={Link} to="/" >Home</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          {mentor ? (
            <Nav>
              <LinkContainer
                to="/student-select"
                className="text-center navBorder"
                style={{
                  paddingRight: 20,
                }}
              >
                <Nav.Link>Assign New Student</Nav.Link>
              </LinkContainer>
              <LinkContainer
                to="/student-view"
                className="text-center navBorder"
                style={{
                  paddingLeft: 20,
                  paddingRight: 20,
                }}
              >
                <Nav.Link>Evaluated Student</Nav.Link>
              </LinkContainer>
              <NavDropdown
                title={JSON.parse(localStorage.getItem("mentor")).name}
                id="basic-nav-dropdown"
                className="text-center navBorder"
                style={{ paddingLeft: 20 }}
              >
                <NavDropdown.Item onClick={() => handleMentorChange()}>
                  End Session
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          ) : (
            <Nav>
              <LinkContainer to="/">
                <Nav.Link>Select Mentor</Nav.Link>
              </LinkContainer>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;