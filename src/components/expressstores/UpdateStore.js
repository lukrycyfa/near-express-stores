// dependencies imports 
import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";

// the update store construct taking loading, updatestore and store as props
const UpdateStore = ({ loading, updatestore, store }) => {

  // the store instance
  const { name, banner, description, location } = store;

  // the store attributes, state variables
  const [name_, setName] = useState(name);
  const [banner_, setBanner] = useState(banner);
  const [description_, setDescription] = useState(description);
  const [location_, setLocation] = useState(location);

  // assertion for form inputs
  const isFormFilled = () => name_ && banner_ && description_ && location_;

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
        Update Store
      </Button>
      <Modal show={show} onHide={handleClose} centered>
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
                value={name_}
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
                value={banner_}
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
                value={description_}
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
                value={location_}
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
              updatestore({
                name: name_,
                banner: banner_,
                description: description_,
                location: location_
              });
              handleClose();
            }}
          >
            Update Store
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );

};


UpdateStore.propTypes = {
  loading: PropTypes.bool.isRequired,
  store: PropTypes.instanceOf(Object).isRequired,
  updatestore: PropTypes.func.isRequired,
};


export default UpdateStore;  