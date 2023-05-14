/**** 
•	Using the Houses API, or any open API of your choice you can find online, create a single  
  page that allowsfor all 4 CRUD operations to be performed on a resource from the API. 
•	Create a React component (or more, if needed) to represent the resource. 
•	Make all forms and other necessary UI pieces their own components as reasonable. 
****/

import 'bootstrap/dist/css/bootstrap.min.css'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';

import './App.css';
import {useEffect, useState} from 'react'

function App() {
  
  const MOCK_API_URL = 'https://643ecfc36c30feced833f509.mockapi.io/person'

  const [persons, setPersons] = useState([])

  const [newPersonName, setNewPersonName] = useState('')
  const [newPersonLanguage, setNewPersonLanguage] = useState('')
  const [newPersonStatus, setNewPersonStatus] = useState('')

  const [updatedPersonName, setUpdatedPersonName] = useState('')
  const [updatedPersonLanguage, setUpdatedPersonLanguage] = useState('')
  const [updatedPersonStatus, setUpdatedPersonStatus] = useState('')

  // For the MODAL Upadate Form
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Create 4 functions: getPersons(){}, deletePerson(){}, updatePerson(){}, and postNewPerson(){}.
  // Use async/await
    async function getPersons() {
       const response = await fetch(MOCK_API_URL);
       const data = await response.json();
      setPersons(data);
 }
   
  // Load the page only the first time after getting data. useEffect takes
  // an anonymous function and an empty array.
  useEffect(() => {
    getPersons()
  },[])


  // Delete a person resource given the id (DELETE)
  async function deletePerson(id) {
    const response = await fetch(`${MOCK_API_URL}/${id}`, {
      method: "DELETE",
    })
    // After we delete user, call getPersons to re-rendered updated info.
    getPersons()
  }
  

  // Create a new person resource (POST)
  async function postNewPerson(e) {
    // To prevent from refreshing and because this function is inside
    // a form pass the event and call preventDefault()
    e.preventDefault()

    const response = await fetch(MOCK_API_URL, {
    method: "POST", 
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      name: newPersonName,
      language: newPersonLanguage,
      status: newPersonStatus,
    }) // body data type must match "Content-Type" header
  })
  const newdata = await response.json();

  getPersons()
  return newdata
}

// Update a person object: (PUT)
// The new variable is updatedPersonObject with personObject with updated values, 
// since we need to stringify an object. updtatedPersonObject is the old object, 
// spread out all key value pairs from our personObject which is what we pass in,
// and then update values.
async function updatePerson(e, personObject){
  e.preventDefault()

    let updatedPersonObject = {
      ...personObject,
      name: updatedPersonName,
      language: updatedPersonLanguage,
      status: updatedPersonStatus,
    }
    const response = await fetch(`${MOCK_API_URL}/${personObject.id}`, {
      method: "PUT", 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedPersonObject)
    })
    getPersons();
  }
  
  return (
    <div className="App">
    <h3>Add New Language Interpreter</h3>
   
    {/* Connecting POST to Form */}
    <Form className="postPersonForm">
      <Form.Group className="mb-0">
        <Form.Label>Name</Form.Label>
          <Form.Control
			  	onChange={(e) => setNewPersonName(e.target.value)}
          type="text"
          placeholder="Interpreter Name"
          autoFocus
          />
    </Form.Group>
    <Form.Group className="mb-0">
        <Form.Label>Language</Form.Label>
          <Form.Control
			  	onChange={(e) => setNewPersonLanguage(e.target.value)}
          type="text"
          placeholder="Interpreter Language(s)"
          autoFocus
          />
      </Form.Group>
      <Form.Group className="mb-0">
        <Form.Label>Status</Form.Label>
          <Form.Control
			  	onChange={(e) => setNewPersonStatus(e.target.value)}
          type="text"
          placeholder="Interpreter Status"
          autoFocus
          />
      </Form.Group>
      <Button onClick={(e) => postNewPerson(e)}>Submit</Button>
    </Form>


    {persons.map((person, index) => (
      <div  className="personContainer" key={index}>
        <div>
          <Table striped bordered hover size="sm">
            <thead>
            <tr>
              <th>Name</th>
              <th>Language</th>
              <th>Status</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>{person.name}</td>
              <td>{person.language}</td>
              <td>{person.status}</td>
            </tr>
            </tbody>
          </Table>

        </div>
        <div  className="d-flex gap-2" >
          <Button size="sm" onClick={() => deletePerson(person.id)}>Delete</Button>
          <Button size="sm" variant="primary" onClick={handleShow}>
            Update
          </Button>
        </div>
        <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update Interpreter Form</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-0" >
              <Form.Label>Update Interpreter Name</Form.Label>
              <Form.Control
			        onChange={(e)=>setUpdatedPersonName(e.target.value)}
                type="text"
                placeholder="Update Name"
                autoFocus
              />
            </Form.Group>
			      <Form.Group className="mb-0">
              <Form.Label>Update Interpreter Language</Form.Label>
              <Form.Control
			  	    onChange={(e)=>setUpdatedPersonLanguage(e.target.value)}
                type="text"
                placeholder="Update Language"
                autoFocus
              />
            </Form.Group>
			      <Form.Group className="mb-0" >
              <Form.Label>Update Interpreter Status</Form.Label>
              <Form.Control
			  	    onChange={(e)=>setUpdatedPersonStatus(e.target.value)}
                type="text"
                placeholder="Update Status"
                autoFocus
              />
            </Form.Group>
		     </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={(e)=>updatePerson(e, person)}>
            Update 
          </Button>
        </Modal.Footer>
        </Modal>
      </div>
    ))}
    </div>
  );
}

export default App;
