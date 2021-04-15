import warningLogo from "../resource/warningLogo.png";
import { Button, Typography } from "antd";
import React from "react";
import { RollbackOutlined } from "@ant-design/icons";
const { Title, Text, Paragraph } = Typography;

const unauthorised = () => (
  <div
    style={{
      textAlign: "center",
      paddingTop: "5vh",
      marginBottom: "10vh",
    }}
  >
    <img
      className="warning"
      style={{
        height: "200px",
        lineHeight: "200px",
        marginTop: "10vh",
        marginBottom: "8vh",
      }}
      src={warningLogo}
    />
    <Title level={3} type="danger">
      {
        "Invalid API token, please proceed to Dataverse to generate a new API token."
      }
    </Title>
  </div>
);

export default unauthorised;
