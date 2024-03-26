// dependencies and component imports 
import React from "react";
import PropTypes from "prop-types";
import { Card, Col, Stack } from "react-bootstrap";

// The suggested product construct taking product as props
const SuggestedProduct = ({ product }) => {

  // the suggested product instance
  const { id, name, description, image,
    // lifeSpan 
  } = product;

  return (
    <Col key={id}>
      <Card className=" h-100 rounded-4 border-4 shadow-lg bg-white text-dark">
        <Card.Header>
          <Stack direction="horizontal" gap={2}>
            <span className="font-monospace text-secondary"></span>
          </Stack>
        </Card.Header>
        <div className=" ratio ratio-4x3">
          <img src={image} alt={name} style={{ objectFit: "cover" }} />
        </div>
        <Card.Body className="d-flex  flex-column text-center">
          <Card.Title><i className="bi bi-info-circle-fill"></i> {name}</Card.Title>
          <Card.Text className="flex-grow-1 "><i className="bi bi-info-circle-fill"></i> {description}</Card.Text>

        </Card.Body>
      </Card>
    </Col>
  );

};


SuggestedProduct.propTypes = {
  product: PropTypes.instanceOf(Object).isRequired
};

export default SuggestedProduct;