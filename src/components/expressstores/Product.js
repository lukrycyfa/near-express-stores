// dependencies and component imports 
import React from "react";
import PropTypes from "prop-types";
import { utils } from "near-api-js";
import { Card, Button, Col, Badge, Stack } from "react-bootstrap";

// The product construct taking product and buy as props
const Product = ({ product, buy }) => {

  // the product instance
  const { id, name, description, image, price, owner, sold, available } = product;

  // called to buy a product
  const triggerBuy = () => {
    buy(id, price);
  };

  return (
    <Col key={id}>
      <Card className=" h-100 rounded-4 border-4 shadow-lg bg-white text-dark">
        <Card.Header>
          <Stack direction="horizontal" gap={2}>
            <i className="bi bi-person-fill"></i>
            <span className="font-monospace text-secondary">{owner}</span>
            <Badge bg="secondary" className="ms-auto">
              {sold} Sold
            </Badge>
            <Badge bg="secondary" className="ms-auto">
              {available} Available
            </Badge>
          </Stack>
        </Card.Header>
        <div className=" ratio ratio-4x3">
          <img src={image} alt={name} style={{ objectFit: "cover" }} />
        </div>
        <Card.Body className="d-flex  flex-column text-center">
          <Card.Title><i className="bi bi-info-circle-fill"></i> {name}</Card.Title>
          <Card.Text className="flex-grow-1 "><i className="bi bi-info-circle-fill"></i> {description}</Card.Text>
          <Card.Text className="text-secondary">
          </Card.Text>
          <Button
            variant="outline-dark"
            onClick={triggerBuy}
            className="w-100 py-3 border-info rounded-pill px-3"
          >
            Buy for {utils.format.formatNearAmount(price)} NEAR
          </Button>
        </Card.Body>
      </Card>
    </Col>
  );

};


Product.propTypes = {
  product: PropTypes.instanceOf(Object).isRequired,
  buy: PropTypes.func.isRequired,
};

export default Product;