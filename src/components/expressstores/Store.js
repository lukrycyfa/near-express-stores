// dependencies, components and functions imports
import React, { useState } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import Loader from "../utils/Loader";
import { NotificationSuccess, NotificationError } from "../utils/Notifications";
import { Card, Button, Col, Stack, Modal, Row } from "react-bootstrap";
import Product from "./Product";
import { buyProduct, getStoreProducts as _getStoreProducts } from "../../utils/expressstores";

// The Store construct taking store, ratestore and idxloading as props
const Store = ({ store, ratestore, idxloading }) => {

  // a store insatance
  const { id, name, description, banner, location, owner, rating, storeProducts } = store;

  // references and loading state variables
  const [_storeproducts, setStoreProducts] = useState(storeProducts);
  const [loading, setLoading] = useState(false);

  // the modal state and state togglers
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  // get all product associated with the store
  const getStoreProducts = async () => {
    try {
      setLoading(true);
      // calling the contract
      const storeproducts = await _getStoreProducts(id)
      setStoreProducts(storeproducts == null ? [] : _storeproducts);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // purchase a product from the store
  const purchaseProduct = async (pid, price) => {
    try {
      setLoading(true);
      // calling the contract
      await buyProduct(id, pid, price).then((resp) => getStoreProducts());
      toast(<NotificationSuccess text="Product purchased  Successfully." />);
    } catch (error) {
      if (error.kind !== undefined) {
        toast(<NotificationError text={`Failed to purchased product. ${error.kind.kind.FunctionCallError.ExecutionError}`} />);
      } else {
        toast(<NotificationError text={`Failed to purchased product. ${error}`} />);
      }
      console.log(error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <Col key={id}>
      <Card className=" h-100 rounded-4 border-4 shadow-lg bg-white text-dark">
        <Card.Header>
          {!loading ? (<> <Stack direction="horizontal" gap={2}>
            <i className="bi bi-person-fill"></i>
            <span className="font-monospace text-secondary">{owner}</span>
          </Stack></>) :
            (<><Loader /></>)}
        </Card.Header>
        <div className=" ratio ratio-4x3">
          <img src={banner} alt={name} style={{ objectFit: "cover" }} />
        </div>
        <Card.Body className="d-flex  flex-column text-center">
          <Card.Title><i className="bi bi-info-circle-fill"></i> {name}</Card.Title>
          <Card.Text className="flex-grow-1 "><i className="bi bi-info-circle-fill"></i> {description}</Card.Text>
          <Card.Text className="text-secondary">
            <i className="bi bi-geo-alt-fill"></i><span>{location}</span>
          </Card.Text>
          <Stack direction="horizontal" gap={2}>
            <Button onClick={() => ratestore(id, 1)} variant="light" className="rounded-pill px-0 py-0" style={{ width: "35px" }}>
              <i className={`bi bi-star-fill ${rating > 0 ? 'text-warning' : ''}`}></i>
            </Button>
            <Button onClick={() => ratestore(id, 2)} variant="light" className="rounded-pill px-0 py-0" style={{ width: "35px" }}>
              <i className={`bi bi-star-fill ${rating > 1 ? 'text-warning' : ''}`}></i>
            </Button>
            <Button onClick={() => ratestore(id, 3)} variant="light" className="rounded-pill px-0 py-0" style={{ width: "35px" }}>
              <i className={`bi bi-star-fill ${rating > 2 ? 'text-warning' : ''}`}></i>
            </Button>
            <Button onClick={() => ratestore(id, 4)} variant="light" className="rounded-pill px-0 py-0" style={{ width: "35px" }}>
              <i className={`bi bi-star-fill ${rating > 3 ? 'text-warning' : ''}`}></i>
            </Button>
            <Button onClick={() => ratestore(id, 5)} variant="light" className="rounded-pill px-0 py-0" style={{ width: "35px" }}>
              <i className={`bi bi-star-fill ${rating > 4 ? 'text-warning' : ''}`}></i>
            </Button>
          </Stack>
          <Modal show={show} onHide={handleClose} fullscreen={true} centered scrollable={true} backdrop={true} className="rounded-4 border-4 shadow-lg">
            <Modal.Header >
              <Modal.Title>Store Products</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ "backgroundColor": "#3333ae" }}>
              <Row xs={1} sm={2} lg={3} className="g-3  mb-5 g-xl-4 g-xxl-5">
                {_storeproducts.map((_product, idx) => (
                  <Product
                    key={idx}
                    product={{
                      ..._product,
                    }}
                    buy={purchaseProduct}
                  />
                ))}
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="outline-secondary" onClick={handleClose}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </Card.Body>
        <Card.Footer>
          <Button
            onClick={handleShow}
            disabled={idxloading}
            className="btn btn-primary border-info rounded-pill px-3"
          >
            Store Products
          </Button>
        </Card.Footer>
      </Card>
    </Col>
  );

};

Store.propTypes = {
  store: PropTypes.instanceOf(Object).isRequired,
  ratestore: PropTypes.func.isRequired,
  idxloading: PropTypes.bool.isRequired
};

export default Store;