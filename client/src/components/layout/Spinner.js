import React from "react";
import spinner from "../../img/spinner.gif";

const Spinner = () => {
  return (
    <>
      <img
        src={spinner}
        alt="loading..."
        style={{ width: "200px", display: "block", margin: "auto" }}
      />
    </>
  );
};

export default Spinner;
