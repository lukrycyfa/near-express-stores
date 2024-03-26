import React from "react";

import { Spinner } from "react-bootstrap";


const Loader = () => (

<div className="d-flex justify-content-center text-info">
  <Spinner animation="border" role="status" className="opacity-75">
    <span className="visually-hidden">Loading...</span>
  </Spinner>
</div>
);

export default Loader;