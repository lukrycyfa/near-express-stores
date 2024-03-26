// dependencies, components and functions imports
import React, { useState } from "react";
import PropTypes from "prop-types";
import { utils } from "near-api-js";
import { toast } from "react-toastify";
import Loader from "../utils/Loader";
import { NotificationSuccess, NotificationError } from "../utils/Notifications";
import { Card, Button, Col, Stack, Modal, Row } from "react-bootstrap";
import { getPurchasedReferences, deletePurchasedReference } from "../../utils/expressstores";

// The Purchased References construct taking accountId as props
const PurchasedReferences = ({ accountId }) => {

  // references and loading state variables
  const [_references, setRefrences] = useState([]);
  const [loading, setLoading] = useState(false);

  // the modal state and state togglers
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // get all stores
  const getRefrences = async () => {
    try {
      setLoading(true);
      // calling the contract
      const references = await getPurchasedReferences(accountId)
      setRefrences(references == null ? [] : references);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // delete a purchase reference 
  const deleteReference = async (idx) => {
    try {
      setLoading(true);
      // calling the contract
      await deletePurchasedReference(idx).then((resp) => getRefrences());
      toast(<NotificationSuccess text="Reference Deleted successfully." />);
    } catch (error) {
      if (error.kind !== undefined) {
        toast(<NotificationError text={`Failed to Delete Reference. ${error.kind.kind.FunctionCallError.ExecutionError}`} />);
      } else {
        toast(<NotificationError text={`Failed to Delete Reference. ${error}`} />);
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
          getRefrences();
        }}
        className="btn btn-primary border-info rounded-pill px-3"
      >
        Purchased References
      </Button>
      <Modal show={show} onHide={handleClose} size="xl" centered scrollable={true} backdrop={true} className="rounded-4 border-4 shadow-lg">
        <Modal.Header>
          {!loading ? (<><Modal.Title>Users Purchased References</Modal.Title>
          </>) : (<Loader />)}
        </Modal.Header>
        <Modal.Body style={{ "backgroundColor": "#3333ae" }} className="overflow-x-hidden">
          <Row xs={1} sm={2} lg={3} className="g-3 flex flex-nowrap overflow-x-scroll  mb-0 g-xl-4 g-xxl-5 px-3 py-5">
            {_references.map((_ref, idx) => (
              <Col key={_ref.id}>
                <Card className=" h-100 rounded-4 border-4 shadow-lg bg-white text-dark">
                  <Card.Header>
                    <Stack direction="horizontal" gap={2}>
                      <span className="font-monospace text-secondary">{utils.format.formatNearAmount(_ref.price)} NEAR</span>
                    </Stack>
                  </Card.Header>
                  <div className=" ratio ratio-4x3">
                    <img src={_ref.image} alt={_ref.name} style={{ objectFit: "cover" }} />
                  </div>
                  <Card.Body className="d-flex  flex-column text-center">
                    <Card.Title><i className="bi bi-info-circle-fill"></i> {_ref.name}</Card.Title>
                    <Card.Text className="flex-grow-1 "><i className="bi bi-info-circle-fill"></i>{_ref.description}</Card.Text>
                    <Card.Text className="text-secondary">
                      <i className="bi bi-geo-alt-fill"></i> <span>{_ref.location}</span>
                    </Card.Text>
                    <Button
                      disabled={loading}
                      onClick={() => {

                        deleteReference(idx);
                      }}
                      className="rounded-pill btn btn-danger px-0"
                      style={{ width: "38px" }}
                    >
                      <i className="bi bi-trash"></i>
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button disabled={loading} variant="outline-secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );

};

PurchasedReferences.propTypes = {
  accountId: PropTypes.string.isRequired,
};

export default PurchasedReferences;