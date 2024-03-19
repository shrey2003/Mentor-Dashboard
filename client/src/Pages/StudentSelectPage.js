import React, { useState, useEffect } from "react";
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
import { assignStudent, searchStudent } from "../utils/api";
import { useNavigate } from "react-router-dom";
import Footer from "../Components/Footer";

const StudentSelectPage = () => {
  // Get the mentor value from localStorage
  let mentor = localStorage.getItem("mentor");
  mentor = JSON.parse(mentor);

  const navigate = useNavigate();

  // Set up state for search string, list of students, selected students, error message, and whether to show the message
  const [searchString, setSearchString] = useState("");
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [message, setMessage] = useState("");
  const [show, setShow] = useState(true);

  // Function to handle search form submission and fetch matching students from the server
  const handleStudentSearch = (e) => {
    e.preventDefault();
    fetchStudents(searchString);
  };


  // Function to handle student selection/deselection
  const handleStudentSelect = (student) => {
    // Check if student is already selected
    if (!selectedStudents.map((s) => s.id).includes(student.id)) {
      // Check if there are already 4 selected students
      if (selectedStudents.length < 4) {
        // Add student to selected students
        setSelectedStudents([...selectedStudents, student]);
      }
    } else {
      handleStudentDeselect(student);
    }
  };

  // Function to handle student deselection
  const handleStudentDeselect = (student) => {
    // Remove student from selected students
    setSelectedStudents(selectedStudents.filter((s) => s.id !== student.id));
  };

  // Function to handle confirmation of selected students and assign them to the mentor
  const handleConfirmSelection = async () => {
    // Check if there are at least 1 selected students
    if (selectedStudents.length >= 1) {
      if (selectedStudents.length > 4) {
        alert("Please select at most 4 students");
      } else {
        const data = await assignStudent(
          mentor.id,
          selectedStudents.map((student) => student.id)
        );
        if (typeof data === "string") {
          setMessage(data);
        } else {
          navigate("/student-view");
        }
      }
    } else {
      alert("Please select at least 1 student");
    }
  };

  // Function to fetch students matching the search string from the server
  const fetchStudents = async (searchString) => {
    const data = await searchStudent(searchString);
    console.log(data)
    const newstudes = [...data].filter(x => x.email .includes(searchString));

    setStudents(newstudes)
  };

  const [autocompleteOptions, setAutocompleteOptions] = useState([]);

  const handleAutocomplete = (input) => {
    if(!input) {
      setAutocompleteOptions([]);
      return;
    }
    const filteredOptions = students.filter((ment) => {
      // console.log(student)
      return ment.email.toLowerCase().includes(input.toLowerCase())
    }
    );

    console.log(filteredOptions)

    setAutocompleteOptions(filteredOptions);
  };


  // Fetch all students when the page loads
  useEffect(() => {
    fetchStudents("");
  }, []);

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
              <h2 className="mt-4 mb-3 d-inline-block">Students Available</h2>
              <Form
                className="d-flex"
                style={{ height: "50px" }}
                onSubmit={handleStudentSearch}
              >
                <form autocomplete="off" onSubmit={e => {
                  e.preventDefault();
                }}>
                  <div class="autocomplete" style={{
                    width: "300px"
                  }}>
                    <input id="myInput" type="text" name="students" value={searchString} placeholder="Students" onChange={
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
                  <button onClick={handleStudentSearch} type="button" className="btn btn-primary">
                    Search
                  </button>
                </form>
              </Form>
            </div>

            <div className="d-flex flex-wrap">
              {students.map((student) => (
                <Card
                  key={student.id}
                  className="m-2"
                  style={{ width: "17rem", backgroundColor: student.id % 2 === 0 ? 'rgb(174, 210, 255)' : 'rgb(220, 255, 183)' }}
                  onClick={() => {
                    if (!student.evaluated_by & !student.mentor_id)
                      handleStudentSelect(student);
                  }}
                >
                  <Card.Img
                    variant="top"
                    src="/student.gif"
                    alt="default_image"
                  />
                  <Card.Body>
                    <Card.Title>{student.name}</Card.Title>
                    <Card.Text>{student.email}</Card.Text>
                    <Card.Text>{student.phone}</Card.Text>
                  </Card.Body>
                  <Card.Footer>
                    {student.mentor_id ? (
                      <Button variant="warning" disabled>
                        Assigned
                      </Button>
                    ) : student.evaluated_by ? (
                      <Button variant="danger" disabled>
                        Evaluated
                      </Button>
                    ) : selectedStudents
                      .map((s) => s.id)
                      .includes(student.id) ? (
                      <Button
                        variant="danger"
                        onClick={() => handleStudentDeselect(student)}
                      >
                        Deselect
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        onClick={() => handleStudentSelect(student)}
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
            style={{ borderLeft: "2px solid rgba(128, 128, 128, 0.2)" }}
          >
            <h2 className="mt-4 mb-3">Students Assigned</h2>
            <ul className="list-unstyled">
              {selectedStudents.map((student) => (
                <div className="card mb-3" key={student.id}>
                  <div className="card-body">
                    <h5 className="card-title">{student.name}</h5>
                    <p className="card-text">{`Email: ${student.email}`}</p>
                    <p className="card-text">{`Phone: ${student.phone}`}</p>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleStudentDeselect(student)}
                    >
                      Deselect
                    </button>
                  </div>
                </div>
              ))}
            </ul>
            <Button
              className="mt-4"
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

export default StudentSelectPage;
