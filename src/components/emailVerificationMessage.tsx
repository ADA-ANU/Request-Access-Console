import verifyImage from "../resource/verifyImage.png";
import { Button, Typography } from "antd";
import React from "react";
import { RollbackOutlined } from "@ant-design/icons";
const { Title, Text, Paragraph } = Typography;

const emailVerification = `Your email address hasn't been verified`;
const emailVerificationTitle1 = `How to verify your email address `;
const emailVerificationTitle2 = `If less than 24 hours have passed since you created your Dataverse Account.`;
const emailVerificationPara1 = `When you created your Dataverse Account, you should have received an automated email from the system that contained a verification link. Please open this email and use this link within 24 hours of creating your account to verify your email address and complete the account set up. If you do not think you have received the email containing the verification link, please check your spam/junk folder.`;
const emailVerificationTitle3 = `If more than 24 hours have passed since you created your Dataverse Account. `;
const emailVerificationPara2 = `To verify your email address, log in to Dataverse and navigate to the "Account Information" page using the drop-down menu at the top right of the screen beneath your name. Adjacent to your recorded email address you will see the option "verify email" (as per the image below). Select this option and Dataverse will send an automated email to you which contains a new email verification link. `;
const emailVerificationPara3 = `Please use this link within 24 hours of requesting it to verify your email address and complete the account set up. If the email hasn't arrived within an hour, please check your spam/junk folder.
If you receive an error message when verifying your email address, please attempt to verify your email address using a different browser before contacting the ADA. We are aware that this has been an issue in some cases and will be the first thing that we ask you to confirm.

If you do have any problems verifying your email address, please let us know via email at ada@anu.edu.au 

`;

const EmailVerificationMessage = () => (
  <div
    style={{
      textAlign: "center",
      margin: "auto",
      width: "50%",
    }}
  >
    <Title level={3} type="danger">
      {emailVerification}
    </Title>
    <div
      style={{
        textAlign: "left",
        marginTop: "5vh",
      }}
    >
      <Title level={5}>{emailVerificationTitle1}</Title>
      <Title level={5}>{emailVerificationTitle2}</Title>
      <Paragraph>
        <blockquote>{emailVerificationPara1}</blockquote>
      </Paragraph>
      <Title level={5}>{emailVerificationTitle3}</Title>
      <Paragraph>
        <blockquote>{emailVerificationPara2}</blockquote>
      </Paragraph>
      <img
        className="warning"
        style={{
          marginTop: "3vh",
          marginBottom: "3vh",
          width: "100%",
          maxWidth: "700px",
        }}
        src={verifyImage}
      />
      <Paragraph>{emailVerificationPara3}</Paragraph>
    </div>
  </div>
);

export default EmailVerificationMessage;
