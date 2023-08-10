import React from "react";
import "antd/dist/antd.css";
import { Button } from "antd";
import { CaretRightFilled } from "@ant-design/icons";

function Btn() {
  return (
    <>
      <Button
        type="primary"
        style={{ width: "90%", border: "1px solid" }}
        onClick={() => {
          console.log("inside on click");
        }}
      >
        Play
        <CaretRightFilled />
      </Button>
    </>
  );
}

export default Btn;
