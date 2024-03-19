import { useState, useEffect } from "react";
import {
  Card,
  Button,
  Container,
  Row,
  Col,
  Form,
  FormControl,
  Alert,
} from "react-bootstrap";
import NavigationBar from "../Components/NavigationBar";
import { searchMentor } from "../utils/api";
import { useNavigate } from "react-router-dom";
import Footer from "../Components/Footer";

const MentorSelectPage = () => {
  // Get the mentor value from localStorage
  let mentor = localStorage.getItem("mentor");
  if (mentor) mentor = JSON.parse(mentor);

  const navigate = useNavigate();
  const [autocompleteOptions, setAutocompleteOptions] = useState([]);
  // state for search bar input
  const [searchString, setSearchString] = useState("");
  // state for the list of mentors
  const [mentors, setMentors] = useState([]);
  // state for the selected mentor
  const [selectedMentor, setSelectedMentor] = useState(mentor);
  // state for error messages
  const [message, setMessage] = useState("");
  // state for showing/hiding error message
  const [show, setShow] = useState(true);

  // const [showAutoComplete, setShowAutoComplete] = useState(false);

  const handleMentorSearch = () => {
    // e.preventDefault();
    setSearchString("");
    setAutocompleteOptions([]);
    // fetch mentors from the server based on search string
    fetchMentors(searchString);
  };

  const handleMentorSelect = (mentor) => {
    setSelectedMentor(
      // select/deselect mentor by updating state
      selectedMentor && selectedMentor.id === mentor.id ? null : mentor
    );
  };

  const handleConfirmSelection = () => {
    if (selectedMentor) {
      // save selected mentor to localStorage
      localStorage.setItem("mentor", JSON.stringify(selectedMentor));

      navigate("/student-select");
    } else {
      // display an alert if no mentor is selected
      alert("Please select a mentor");
    }
  };

  // Function to search for mentors on the server
  const fetchMentors = async (searchString) => {
    setSearchString("");
    const data = await searchMentor(searchString);
    if (typeof data === "string") {
      // set error message if response is a string
      setMessage(data);
    } else {
      // set list of mentors if response is an array of mentors
      setMentors(data);
    }
  };

  useEffect(() => {
    // fetch all mentors from the server when the component mounts
    fetchMentors("");
    // setSearchString("")
  }, [setSearchString]);

  const handleAutocomplete = (input) => {
    if(!input) {
      setAutocompleteOptions([]);
      return;
    }
    const filteredOptions = mentors.filter((ment) => {
      // console.log(student)
      return ment.email.toLowerCase().includes(input.toLowerCase())
    }
    );

    console.log(filteredOptions)

    setAutocompleteOptions(filteredOptions);
    // setShowAutoComplete(filteredOptions.length > 0);
  };

  return (
    <>
      <NavigationBar />
      <Container fluid style={{ marginTop: "-40px" }}>
        <Row>
          <Col md={8}>
            {message && show && (
              <Alert
                variant="danger"
                className="mt-2 d-flex align-items-center justify-content-between"
              >
                {message}
                <Button
                  className="close"
                  variant="danger"
                  onClick={() => setShow(false)}
                >
                  <span>&times;</span>
                </Button>
              </Alert>
            )}
            <div className="d-flex align-items-center justify-content-between mx-3 my-2">
              <h2 className="mt-4 mb-3 d-inline-block">Mentors Available</h2>
              <Form
                className="d-flex"
                style={{ height: "50px" }}
                onSubmit={handleMentorSearch}
              >
                <form autocomplete="off" onSubmit={e => {
                  e.preventDefault();
                }}>
                  <div class="autocomplete" style={{
                    width: "300px"
                  }}>
                    <input id="myInput" type="text" name="mentors" value={searchString} placeholder="Mentors" onChange={
                      e => {
                        setSearchString(e.target.value);
                        console.log(e.target.value);
                        handleAutocomplete(e.target.value)
                      }
                    } />
                    { (autocompleteOptions.length != 0) && (<div className="autocomplete-items">
                      {autocompleteOptions.map(x => {
                        console.log(x);
                        const idx = x.email.toLowerCase().indexOf(searchString.toLowerCase());
                        const nonBoldStart = x.email.substr(0, idx);
                        const boldPart = x.email.substr(idx, searchString.length);
                        const nonBoldEnd = x.email.substr(idx + searchString.length);
                        return (<button style={{
                          all:"unset",
                          background: "white"
                        }} onClick={e => { 
                          e.preventDefault();
                        setSearchString(x.email)
                        }}>
                          <span>  
                            {nonBoldStart}
                            <strong>{boldPart}</strong>
                            {nonBoldEnd}
                          </span>
                        </button>)
                      })}
                    </div>) }
                  </div>
                  <button onClick={handleMentorSearch} type="button" className="btn btn-primary">
                    Search
                  </button>
                </form>
              </Form>
            </div>
            <div className="d-flex flex-wrap">
              {mentors.map((mentor) => (
                <Card

                  border="info"
                  key={mentor.id}
                  className="m-2"
                  style={{ width: "17rem", backgroundColor: mentor.id % 2 === 0 ? 'rgb(174, 210, 255)' : 'rgb(220, 255, 183)' }}
                  onClick={() => handleMentorSelect(mentor)}
                >
                  <Card.Img
                    variant="top"
                    src="/teacher.gif"
                    alt="default_image"
                  />
                  <Card.Body>
                    <Card.Title>{mentor.name}</Card.Title>
                    <Card.Text>{mentor.email}</Card.Text>
                    <Card.Text>{mentor.phone}</Card.Text>
                  </Card.Body>
                  <Card.Footer>
                    {selectedMentor && selectedMentor.id === mentor.id ? (
                      <Button
                        variant="danger"
                        onClick={() => handleMentorSelect(mentor)}
                      >
                        Deselect
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        onClick={() => handleMentorSelect(mentor)}
                      >
                        Select
                      </Button>
                    )}
                  </Card.Footer>
                </Card>
              ))}
            </div>
          </Col>
          <Col
            md={4}
            className="text-center"
            style={{ borderLeft: "2px solid #ccc", minHeight: "100vh" }}
          >
            {selectedMentor ? (
              <>
                <h2 className="mt-4 mb-3">Mentor</h2>
                <Card style={{ width: "18rem", margin: "0 auto", backgroundColor: "rgb(255, 104, 104)" }}>
                  <Card.Img
                    variant="top"
                    src="/teacher1.gif"
                    alt="default_image"
                  />
                  <Card.Body>
                    <Card.Title>{selectedMentor.name}</Card.Title>
                    <Card.Text>{selectedMentor.email}</Card.Text>
                    <Card.Text>{selectedMentor.phone}</Card.Text>
                    <Button
                      variant="danger"
                      onClick={() => handleMentorSelect(selectedMentor)}
                    >
                      Deselect
                    </Button>
                  </Card.Body>
                </Card>
              </>
            ) : (
              <>
                <h2 className="mt-4 mb-3">Selected Mentor</h2>
                <p>No mentor selected</p>
              </>
            )}
            <Button
              className="my-4"
              variant="success"
              onClick={handleConfirmSelection}
            >
              Confirm Selection
            </Button>
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
};

export default MentorSelectPage;
