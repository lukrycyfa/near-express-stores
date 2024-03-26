// dependencies imports 
import React, { useState } from "react";
import PropTypes from "prop-types";
import { utils } from "near-api-js";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";

// the update product construct taking loading, updateproduct, addproduct and product as props
const UpadateProduct = ({ loading, updateproduct, addproduct, product }) => {

  // the  product instance
  const { id, name, image, description, price } = product;

  // the product attributes, state variables
  const [name_, setName] = useState(name);
  const [image_, setImage] = useState(image);
  const [description_, setDescription] = useState(description);
  const [price_, setPrice] = useState(utils.format.formatNearAmount(price));
  const [_addproduct, setAddProduct] = useState(0);

  // assertion for form inputs
  const isFormFilled = () => name_ && image_ && description_ && price_;

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
        Update Product
      </Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Update Product</Modal.Title>
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
                value={name_}
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
                value={image_}
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
                value={description_}
                placeholder="description"
                style={{ height: "80px" }}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              />
            </FloatingLabel>
            <FloatingLabel
              controlId="inputPrice"
              label="Price"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="Price"
                value={price_}
                onChange={(e) => {
                  if (Number(e.target.value) < 0) return;
                  setPrice(e.target.value);
                }}
              />
            </FloatingLabel>
          </Modal.Body>
          <Modal.Body style={{ "backgroundColor": "#3333ae" }}>
            <Modal.Header>
              <Modal.Title>Add Products</Modal.Title>
            </Modal.Header>
            <FloatingLabel
              controlId="input Amount"
              label="Amount"
              className="mb-3"
            >
              <Form.Control
                type="text"
                onChange={(e) => {
                  if (!Number(e.target.value)) return;
                  setAddProduct(Number(e.target.value));
                }}
                placeholder="Enter amount of product"
              />
            </FloatingLabel>
          </Modal.Body>
        </Form>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            disabled={_addproduct <= 0}
            onClick={() => {
              addproduct(id, _addproduct);
              handleClose();
            }}
            variant="dark"
          >
            Add Products
          </Button>
          <Button
            variant="dark"
            disabled={!isFormFilled()}
            onClick={() => {
              updateproduct(id, {
                name: name_,
                image: image_,
                description: description_,
                price: price_,
              });
              handleClose();
            }}
          >
            Update product
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

UpadateProduct.propTypes = {
  loading: PropTypes.bool.isRequired,
  updateproduct: PropTypes.func.isRequired,
  addproduct: PropTypes.func.isRequired,
  product: PropTypes.instanceOf(Object).isRequired
};

export default UpadateProduct;  