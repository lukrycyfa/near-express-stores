// dependencies, components and functions imports
import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import Loader from "../utils/Loader";
import { Row, Card, Stack, Navbar, Container, Nav } from "react-bootstrap";
import { NotificationSuccess, NotificationError } from "../utils/Notifications";
import Store from "./Store";
import AddStore from "./AddStore";
import AddSuggestedProduct from "./AddSuggestedProduct";
import SuggestedProduct from "./SuggestedProduct";
import PurchasedReferences from "./PurchasedReferences";
import UsersStore from "./UsersStore";
import {
  getStores as allStores, getSuggestedProducts as SuggestedProducts, rateStore as _rateStore,
  addStore as createStore, addSuggestedProduct as createSuggestedProduct
} from "../../utils/expressstores";


// The store construct holding all stores and other components
const Stores = () => {

  // connected users account instance, stores, suggestedproduct and loading state variables
  const account = window.walletConnection.account();
  const [stores, setStores] = useState([]);
  const [suggestedproduct, setSuggestedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lstIdx, setLastIdx] = useState(null);

  // get all stores
  const getStores = useCallback(async () => {
    try {
      setLoading(true);
      // calling the contract
      let _stores = await allStores()
      setStores(_stores == null ? [] : _stores);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  // get suggested products 
  const getSuggestedProducts = useCallback(async () => {
    try {
      setLoading(true);
      // calling the contract
      let _products = await SuggestedProducts()
      setSuggestedProducts(_products == null ? [] : _products);
      setLastIdx(_products.length == 6 ? _products[0]: null)
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Add a Store
  const addStore = async (data) => {
    try {
      setLoading(true);
      // calling the contract
      await createStore(data).then((resp) => {
        getStores();
      });
      toast(<NotificationSuccess text="Store added successfully." />);
    } catch (error) {
      if (error.kind !== undefined) {
        toast(<NotificationError text={`Failed to create store. ${error.kind.kind.FunctionCallError.ExecutionError}`} />);
      } else {
        toast(<NotificationError text={`Failed to create store. ${error}`} />);
      }
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Add a suggested product
  const addSuggestedProduct = async (data) => {
    try {
      setLoading(true);
      // calling the contract
      await createSuggestedProduct(data);
      getSuggestedProducts();
      toast(<NotificationSuccess text="Suggested Product added successfully." />);
    } catch (error) {
      if (error.kind !== undefined) {
        toast(<NotificationError text={`Failed to create Suggested Product. ${error.kind.kind.FunctionCallError.ExecutionError}`} />);
      } else {
        toast(<NotificationError text={`Failed to create Suggested Product. ${error}`} />);
      }
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Rate A store 
  const rateStore = async (id, rating) => {
    try {
      setLoading(true);
      // calling the contract
      await _rateStore(id, rating).then((resp) => getStores());
      toast(<NotificationSuccess text="Rated Store Successfully." />);
    } catch (error) {
      if (error.kind !== undefined) {
        toast(<NotificationError text={`Failed to Rated Store. ${error.kind.kind.FunctionCallError.ExecutionError}`} />);
      } else {
        toast(<NotificationError text={`Failed to Rated Store. ${error}`} />);
      }
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getStores();
    getSuggestedProducts();
  }, [getStores, getSuggestedProducts]);

  return (
    <>
      <Navbar collapseOnSelect sticky="top" expand="lg" className="bg-body-tertiary">
        <Container>

          <Navbar.Brand>Great Shopping Experience</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            {!loading ? (
              <>
                <Nav className="me-auto">
                  <Stack direction="horizontal" gap={4}>
                    <Nav.Item>
                      <AddStore addstore={addStore} />
                    </Nav.Item>
                    <Nav.Item>
                      <UsersStore accountId={account.accountId} getstores={getStores} />
                    </Nav.Item>
                    <Nav.Item>
                      <PurchasedReferences accountId={account.accountId} />
                    </Nav.Item>
                  </Stack>
                </Nav>
              </>
            ) : (<Loader />)}
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Stack direction="vertical" gap={5}>
        <Card className="text-center rounded-2 border-info shadow-lg py-3" style={{ "backgroundColor": "#21212b" }}>
          <Card.Header className="text-white display-5">Express Stores</Card.Header>
          <Card.Body>
            <Row xs={1} sm={2} lg={3} className="g-3  mb-5 g-xl-4 g-xxl-5 py-3">
              {stores.map((_store, idx) => (
                <Store
                  key={idx}
                  store={{
                    ..._store,
                  }}
                  ratestore={rateStore}
                  idxloading={loading}
                />
              ))}
            </Row>
          </Card.Body>
        </Card>
        <Card className="text-center rounded-2 border-info shadow-lg py-3" id="suggest" style={{ "backgroundColor": "#21212b" }}>
          <Card.Header className="text-white display-5">
            <Stack direction="horizontal" gap={2}>
              <span className="display-6">Suggested Products for Stores</span>
              <AddSuggestedProduct loading={loading} addproduct={addSuggestedProduct} />
              <span className="display-6">{`${lstIdx !== null ? lstIdx.lifeSpan/1000000 > new Date().getTime() ? 
              "available spot @"+ new Date(lstIdx.lifeSpan/1000000).toLocaleString() + "GMT": "available spot": "" }`}</span>
            </Stack>
          </Card.Header>
          <Card.Body className="overflow-x-hidden">
            <Row xs={1} sm={2} lg={3} className="g-3 flex flex-nowrap overflow-x-scroll  mb-0 g-xl-4 g-xxl-5 px-3 py-5">
              {suggestedproduct.map((_sugg, idx) => (
                <SuggestedProduct
                  key={idx}
                  product={{
                    ..._sugg,
                  }}
                />
              ))}
            </Row>
          </Card.Body>
        </Card>
      </Stack>

    </>
  );
};


export default Stores;
