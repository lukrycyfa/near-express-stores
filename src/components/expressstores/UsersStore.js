// dependencies, components and functions imports
import React, { useState } from "react";
import PropTypes from "prop-types";
import { utils } from "near-api-js";
import { toast } from "react-toastify";
import Loader from "../utils/Loader";
import { NotificationSuccess, NotificationError } from "../utils/Notifications";
import { Card, Button, Col, Badge, Stack, Modal, Row } from "react-bootstrap";
import UpadateProduct from "./UpdateProduct";
import UpdateStore from "./UpdateStore"
import AddProduct from "./AddProduct";
import {
  updateStore as _updateStore, addStoreProduct, updateStoreProduct as _updateStoreProduct,
  deleteStore as _deleteStore, deleteStoreProduct as _deleteStoreProduct,
  getStoreProducts as _getStoreProducts, getStore as _getStore, availStoreProduct
} from "../../utils/expressstores";

// The Store construct taking store, ratestore and idxloading as props
const UsersStore = ({ accountId, getstores }) => {

  // references and loading state variables
  const [_store, setStore] = useState({});
  const [_storeproducts, setStoreProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // the modal state and state togglers
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // get store associated with connected account 
  const getStore = async () => {
    try {
      setLoading(true);
      // calling the contract
      const _store = await _getStore(accountId)
      setStore(_store == null ? [] : _store);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // get the store products
  const getStoreProducts = async () => {
    try {
      setLoading(true);
      // calling the contract
      const _storeproducts = await _getStoreProducts(accountId)
      setStoreProducts(_storeproducts == null ? [] : _storeproducts);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // create a store product
  const createStoreProduct = async (data) => {
    try {
      setLoading(true);
      // calling the contract
      await addStoreProduct(data).then((resp) => getStoreProducts());
      toast(<NotificationSuccess text="Product added successfully." />);
    } catch (error) {
      if (error.kind !== undefined) {
        toast(<NotificationError text={`Failed to create Product. ${error.kind.kind.FunctionCallError.ExecutionError}`} />);
      } else {
        toast(<NotificationError text={`Failed to create Product. ${error}`} />);
      }
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // update a store 
  const updateStore = async (data) => {
    try {
      setLoading(true);
      // calling the contract
      await _updateStore(data).then((resp) => getStore());
      toast(<NotificationSuccess text="Store Update successfully." />);
    } catch (error) {
      if (error.kind !== undefined) {
        toast(<NotificationError text={`Failed to Update Store. ${error.kind.kind.FunctionCallError.ExecutionError}`} />);
      } else {
        toast(<NotificationError text={`Failed to Update Store. ${error}`} />);
      }
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // update a store product 
  const updateStoreProduct = async (id, data) => {
    try {
      setLoading(true);
      // calling the contract
      await _updateStoreProduct(id, data).then((resp) => getStoreProducts());
      toast(<NotificationSuccess text="Product Update successfully." />);
    } catch (error) {
      if (error.kind !== undefined) {
        toast(<NotificationError text={`Failed to Update Product. ${error.kind.kind.FunctionCallError.ExecutionError}`} />);
      } else {
        toast(<NotificationError text={`Failed to Update Product. ${error}`} />);
      }
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // avail products in the store
  const availProduct = async (id, amount) => {
    try {
      setLoading(true);
      // calling the contract
      await availStoreProduct(id, amount).then((resp) => getStoreProducts());
      toast(<NotificationSuccess text="Products Added successfully." />);
    } catch (error) {
      if (error.kind !== undefined) {
        toast(<NotificationError text={`Failed to Add Products. ${error.kind.kind.FunctionCallError.ExecutionError}`} />);
      } else {
        toast(<NotificationError text={`Failed to Add Products. ${error}`} />);
      }
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // delete the store 
  const deleteStore = async () => {
    try {
      setLoading(true);
      await _deleteStore().then((resp) => getStore());
      // calling the contract
      toast(<NotificationSuccess text="Store Deleted successfully." />);
    } catch (error) {
      if (error.kind !== undefined) {
        toast(<NotificationError text={`Failed to Delete Store. ${error.kind.kind.FunctionCallError.ExecutionError}`} />);
      } else {
        toast(<NotificationError text={`Failed to Delete Store. ${error}`} />);
      }
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // delete a store product
  const deleteStoreProduct = async (productId) => {
    try {
      setLoading(true);
      // calling the contract
      await _deleteStoreProduct(productId).then((resp) => getStoreProducts());
      toast(<NotificationSuccess text="Store Deleted successfully." />);
    } catch (error) {
      if (error.kind !== undefined) {
        toast(<NotificationError text={`Failed to Delete Store Product. ${error.kind.kind.FunctionCallError.ExecutionError}`} />);
      } else {
        toast(<NotificationError text={`Failed to Delete Store Product. ${error}`} />);
      }
      console.log(error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <Button
        disabled={loading}
        onClick={() => {
          handleShow();
          getStore();
          getStoreProducts();
        }}
        className="btn btn-primary border-info rounded-pill px-3"
      >
        Users Store
      </Button>
      <Modal show={show} onHide={handleClose} fullscreen={true} centered scrollable={true} backdrop={true} className="rounded-4 border-4 shadow-lg">
        <Modal.Header >
          {!loading ? (<>
            <Modal.Title>Users Store
              <span>{_store.name}</span>
            </Modal.Title>
          </>) : (
            <><Loader />
            </>)}
        </Modal.Header>
        <Modal.Body style={{ "backgroundColor": "#3333ae" }}>
          <Row xs={1} sm={2} lg={3} className="g-3  mb-5 g-xl-4 g-xxl-5">
            {_storeproducts.map((_product) => (
              <Col key={_product.id}>
                <Card className=" h-100 rounded-4 border-4 shadow-lg bg-white text-dark">
                  <Card.Header>
                    <Stack direction="horizontal" gap={2}>
                      <i className="bi bi-person-fill"></i>
                      <span className="font-monospace text-secondary">{_product.owner}</span>
                      <Badge bg="secondary" className="ms-auto">
                        {_product.sold} Sold
                      </Badge>
                      <Badge bg="secondary" className="ms-auto">
                        {_product.available} Available
                      </Badge>
                      <Badge bg="secondary" className="ms-auto">
                        {utils.format.formatNearAmount(_product.price)} NEAR
                      </Badge>
                    </Stack>
                  </Card.Header>
                  <div className=" ratio ratio-4x3">
                    <img src={_product.image} alt={_product.name} style={{ objectFit: "cover" }} />
                  </div>
                  <Card.Body className="d-flex  flex-column text-center">
                    <Card.Title><i className="bi bi-info-circle-fill"></i> {_product.name}</Card.Title>
                    <Card.Text className="flex-grow-1 "> <i className="bi bi-info-circle-fill"></i>{_product.description}</Card.Text>
                    <Card.Text className="text-secondary">
                    </Card.Text>
                    <Stack direction="horizontal" gap={3}>
                      <Button
                        disabled={loading}
                        onClick={() => {
                          deleteStoreProduct(_product.id);
                        }}
                        className="rounded-pill btn btn-danger px-0"
                        style={{ width: "38px" }}
                      >
                        <i className="bi bi-trash"></i>
                      </Button>
                      <UpadateProduct loading={loading} updateproduct={updateStoreProduct} addproduct={availProduct} product={_product} />
                    </Stack>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Modal.Body>
        <Modal.Footer>
          {!loading ? (<>
            <Stack direction="horizontal" gap={3}>
              {_store.owner === accountId && (<><span><i className="bi bi-geo-alt-fill"></i>{_store.location}</span>
                <span><i className="bi bi-info-circle-fill"></i>{_store.description}</span>
                <Button
                  disabled={loading}
                  onClick={() => { deleteStore(); }}
                  className="rounded-pill btn btn-danger px-0"
                  style={{ width: "38px" }}
                >
                  <i className="bi bi-trash"></i>
                </Button>
                <UpdateStore loading={loading} store={_store} updatestore={updateStore} />
                <AddProduct loading={loading} addproduct={createStoreProduct} /> </>)}
              <Button disabled={loading} variant="outline-secondary" onClick={() => {
                handleClose();
                getstores();
              }}>
                Close
              </Button>
            </Stack>
          </>) : (
            <><Loader />
            </>)}

        </Modal.Footer>
      </Modal>
    </>
  );

};

UsersStore.propTypes = {
  accountId: PropTypes.string.isRequired,
  getstores: PropTypes.func.isRequired
};

export default UsersStore;