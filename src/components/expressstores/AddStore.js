// dependencies imports 
import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";

// the add Store construct taking addstore as props
const AddStore = ({ addstore }) => {

  // a stores attributes, state variables
  const [name, setName] = useState("");
  const [banner, setBanner] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");

  // assertion for form inputs
  const isFormFilled = () => name && banner && description && location

  // the modal state and state togglers
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  return (
    <>

      <Button
        onClick={handleShow}
        className="btn btn-primary border-info rounded-pill px-3"
      >
        Add Store
      </Button>
      <Modal show={show} onHide={handleClose} centered className="rounded-4 border-4 shadow-lg">
        <Modal.Header closeButton>
          <Modal.Title>Create Store</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body style={{ "backgroundColor": "#3333ae" }}>
            <FloatingLabel
              controlId="inputName"
              label="Store name"
              className="mb-3"
            >
              <Form.Control
                type="text"
                onChange={(e) => {
                  setName(e.target.value);
                }}
                placeholder="Enter a store name"
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputUrl"
              label="Banner Url"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="Banner Url"
                onChange={(e) => {
                  setBanner(e.target.value);
                }}
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputDescription"
              label="Description"
              className="mb-3"
            >
              <Form.Control
                as="textarea"
                placeholder="description"
                style={{ height: "80px" }}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputLocation"
              label="Location"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="Location"
                onChange={(e) => {
                  setLocation(e.target.value);
                }}
              />
            </FloatingLabel>
          </Modal.Body>
        </Form>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="dark"
            disabled={!isFormFilled()}
            onClick={() => {
              addstore({
                name,
                banner,
                description,
                location
              });
              handleClose();
            }}
          >
            AddStore
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );

};


AddStore.propTypes = {
  addstore: PropTypes.func.isRequired,
};


export default AddStore;  