import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Form, Button, Container, Card } from "react-bootstrap";
import NavigationBar from "../Components/NavigationBar";
import { useNavigate } from "react-router-dom";
import { evaluateStudent, getStudentMarks, markStudent } from "../utils/api";
import Footer from "../Components/Footer";

const StudentEvaluationPage = () => {
  // Get the mentor value from localStorage
  let mentor = localStorage.getItem("mentor");
  if (mentor) mentor = JSON.parse(mentor);

  const navigate = useNavigate();

  // Get the student ID from the URL parameters
  const params = useParams();
  const studentId = params.id;

  // Set up state for the student's evaluation marks
  const [student, setStudent] = useState({
    ideation_marks: "",
    execution_marks: "",
    viva_marks: "",
    rapidfire_marks: "",
    total_marks: "",
  });

  // Function to handle form submission and save the student's marks
  const handleSubmit = async (event) => {
    event.preventDefault();
    await markStudent(mentor.id, student.id, {
      ideation_marks: student.ideation_marks,
      execution_marks: student.execution_marks,
      viva_marks: student.viva_marks,
      rapidfire_marks: student.rapidfire_marks,
    });
    await fetchStudentDetails();
  };

  // Function to handle when the evaluation is complete and save the final marks
  const handleCompleteEvaluation = async () => {
    await evaluateStudent(mentor.id, student.id);
    navigate("/student-view");
  };

  // Function to fetch the student's evaluation marks from the server
  const fetchStudentDetails = async () => {
    const data = await getStudentMarks(studentId);
    // Set state with the fetched data, converting any null values to 0
    setStudent({
      ...data,
      // Convert any null values to 0 using the bitwise OR operator
      ideation_marks: data.ideation_marks | 0,
      execution_marks: data.execution_marks | 0,
      viva_marks: data.viva_marks | 0,
      rapidfire_marks: data.rapidfire_marks | 0,
      total_marks: data.total_marks | 0,
    });
  };

  // Use the useEffect hook to fetch the student's marks when the component mounts
  useEffect(() => {
    fetchStudentDetails();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchStudentDetails();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <NavigationBar />
      <Container fluid>
        <Form onSubmit={handleSubmit} className="p-3">
          <Card className="my-3">
            <Card.Body>
              <h3 style={{ color: "black" }}>{student.name}</h3>
              <p>Email: {student.email}</p>
              <p>Phone: {student.phone}</p>
            </Card.Body>
          </Card>
          <Form.Group controlId="ideaMarks">
            <Form.Label>Ideation Marks</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter idea marks"
              value={student?.ideation_marks}
              onChange={(e) =>
                setStudent({ ...student, ideation_marks: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group controlId="executionMarks" className="mt-2">
            <Form.Label>Execution Marks</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter execution marks"
              value={student?.execution_marks}
              onChange={(e) =>
                setStudent({ ...student, execution_marks: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group controlId="presentationMarks" className="mt-2">
            <Form.Label>Viva Marks</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter presentation marks"
              value={student?.viva_marks}
              onChange={(e) =>
                setStudent({ ...student, viva_marks: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group controlId="communicationMarks" className="mt-2">
            <Form.Label>RapidFire Marks</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter communication marks"
              value={student?.rapidfire_marks}
              onChange={(e) =>
                setStudent({ ...student, rapidfire_marks: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group controlId="totalMarks" className="mt-2">
            <Form.Label>Total Marks</Form.Label>
            <Form.Control type="text" value={student?.total_marks} disabled />
          </Form.Group>
          <Button variant="primary" type="submit" className="mt-3">
            Submit
          </Button>{" "}
          <Button
            variant="success"
            onClick={handleCompleteEvaluation}
            className="mt-3"
          >
            Complete Evaluation
          </Button>
        </Form>
      </Container>
      <Footer />
    </>
  );
};

export default StudentEvaluationPage;
