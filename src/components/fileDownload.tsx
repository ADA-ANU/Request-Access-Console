import React from "react";
import { inject, observer } from "mobx-react";
import {
  Form,
  Select,
  InputNumber,
  Switch,
  Radio,
  Slider,
  Button,
  Upload,
  Card,
  Row,
  Col,
  Input,
  message,
  notification,
} from "antd";
import API_URL from "../config";
import axios, { AxiosRequestConfig } from "axios";
import apiagent from "../stores/apiagent";
import { RequestAccessQ, uploadFile } from "../stores/data.d";
import { RouteComponentProps } from "react-router-dom";
import { UploadFile, UploadListType } from "antd/lib/upload/interface";
import systemStore from "../stores/systemStore";
import { action, toJS } from "mobx";
import { NotificationPlacement } from "antd/lib/notification";
//import DynamicFieldSet from "./dynamicFields";
import authStore, { AuthStore } from "../stores/authStore";
import { FormInstance } from "antd/lib/form";
import { FileZipOutlined, DownloadOutlined } from "@ant-design/icons";
import "../index.css";
const { Option } = Select;
const { TextArea } = Input;
const { Dragger } = Upload;
// interface ReturnFileType{
//     name: string
// }
interface RequestAccessFileDownloadProps {
  file: uploadFile;
}

@inject("authStore")
@observer
export default class FileUpload extends React.Component<RequestAccessFileDownloadProps> {
  fileOnDownload = (filename: string) => {
    apiagent
      .get(`${API_URL.HANDLE_FILE_DOWNLOAD}${filename}`)
      .catch((error) => {
        console.log(error);
        error.status === 404
          ? this.openNotification("File Not Found.")
          : this.openNotification(error.data);
        //this.openNotification(error.data);
      });
  };

  openNotification = (msg: string) => {
    notification.error({
      message: `Oops`,
      description: msg,
    });
  };
  render() {
    const { file } = this.props;
    //console.log(authStore);
    //const url = `http://localhost:3000/api/download/${file.filename}`;
    return (
      <Col span={8}>
        {/* <a href={url}> */}
        <Card
          hoverable
          bodyStyle={{ padding: "0" }}
          onClick={() => this.fileOnDownload(file.filename)}
        >
          <div
            style={{
              textAlign: "left",
              width: "100%",
              backgroundColor: "#fff",
              userSelect: "none",
              color: "#333",
              fontWeight: 300,
              minHeight: "50px",
            }}
          >
            <Row align="middle">
              <Col
                style={{ fontSize: 30, color: "#158526" }}
                lg={{ span: 4, offset: 1 }}
                xl={{ span: 4, offset: 1 }}
                xxl={{ span: 3, offset: 1 }}
              >
                <FileZipOutlined />
              </Col>
              <Col
                lg={{ span: 4, offset: 1 }}
                xl={{ span: 4, offset: 1 }}
                xxl={{ span: 15, offset: 1 }}
              >
                <p style={{ margin: 0, overflowWrap: "break-word" }}>
                  {file.originalname}
                </p>
              </Col>
              <Col
                style={{ fontSize: 20, color: "#158526" }}
                lg={{ span: 4, offset: 1 }}
                xl={{ span: 4, offset: 1 }}
                xxl={{ span: 1, offset: 1 }}
              >
                <DownloadOutlined />
              </Col>
            </Row>
          </div>
        </Card>
        {/* </a> */}
      </Col>
    );
  }
}
