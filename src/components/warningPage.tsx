import warningLogo from "../resource/warningLogo.png";
import { Button, Typography } from "antd";
import React from "react";
import { RollbackOutlined } from "@ant-design/icons";
const { Title, Text, Paragraph } = Typography;

const warningPage = (props: any) => {
  const params = new URLSearchParams(props.location.search);
  const message = params.get("message");
  console.log(message);
  return (
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
        {message === "Token has been used."
          ? "This link has been used, please contact ADA access team for help."
          : message === "Failed to delete fileaccessrequest."
          ? "Your request has been either awarded or rejected, please proceed to Dataverse to download or start over agin."
          : message}
      </Title>
    </div>
  );
};

export default warningPage;
