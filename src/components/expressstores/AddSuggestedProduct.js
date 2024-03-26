// dependencies imports
import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";

// the add suggested product construct taking loading and addproduct as props
const AddSuggestedProduct = ({ loading, addproduct }) => {

  // a suggested product attributes, state variable
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");

  // assertion for form inputs
  const isFormFilled = () => name && image && description;

  // the modal state and state togglers
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button
        disabled={loading}
        onClick={handleShow}
        className="btn btn-primary border-info rounded-pill px-3"
      >
        Make Suggestion
      </Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>New Suggested Product</Modal.Title>
        </Modal.Header>
        <Form>
          <Modal.Body style={{ "backgroundColor": "#3333ae" }}>
            <FloatingLabel
              controlId="inputName"
              label="Product name"
              className="mb-3"
            >
              <Form.Control
                type="text"
                onChange={(e) => {
                  setName(e.target.value);
                }}
                placeholder="Enter name of product"
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputUrl"
              label="Image URL"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="Image URL"
                onChange={(e) => {
                  setImage(e.target.value);
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
              addproduct({
                name,
                image,
                description
              });
              handleClose();
            }}
          >
            Add suggestion
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

AddSuggestedProduct.propTypes = {
  loading: PropTypes.bool.isRequired,
  addproduct: PropTypes.func.isRequired,
};

export default AddSuggestedProduct;  