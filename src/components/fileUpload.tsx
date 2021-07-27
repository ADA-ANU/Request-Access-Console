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
import { InboxOutlined, DeleteOutlined } from "@ant-design/icons";
import FileDownload from "./fileDownload";
const { Option } = Select;
const { TextArea } = Input;
const { Dragger } = Upload;
// interface ReturnFileType{
//     name: string
// }
interface RequestAccessFileUploadProps {
  question: RequestAccessQ;
  authStore?: AuthStore;
}

@inject("authStore")
@observer
export default class FileUpload extends React.Component<RequestAccessFileUploadProps> {
  render() {
    const { question, authStore } = this.props;
    //console.log(authStore);
    const props = {
      //style: { width: "30vw" },
      name: "file",
      multiple: true,
      listType: "text" as "picture" | "text" | "picture-card" | undefined,
      //data: { qID: value.qid },
      action: `http://localhost:3080/${API_URL.HANDLE_FILE_UPDATE}`,
      //this.handleUploadedFiles(value.files)
      defaultFileList: [],
      // value.files[0].id
      //   ? this.handleUploadedFiles(value.files)
      //   : ([] as UploadFile<any>[]),
      showUploadList: {
        showDownloadIcon: false,
        //downloadIcon: "download ",
        showRemoveIcon: true,
        removeIcon: <DeleteOutlined onClick={() => console.log("deleted")} />,
      },
      onChange(info: any) {
        const { status } = info.file;
        if (status !== "uploading") {
          console.log(info.file, info.fileList);
        }
        if (status === "done") {
          message.success(`${info.file.name} uploaded successfully.`);
        } else if (status === "error") {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
      onDrop(e: any) {
        console.log("Dropped files", e.dataTransfer.files);
      },
    };
    return (
      <Form.Item
        // key={question.displayorder}
        // name={question.questionid}
        label={question.questionstring}
        rules={[
          {
            required: question.required,
            message: "This field cannot be empty.",
          },
        ]}
      >
        {question.files && question.files[0] && question.files[0].id && (
          <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 16]}>
            {question.files.map((file: uploadFile) => (
              <FileDownload file={file} key={file.id} />
            ))}
          </Row>
        )}
        <Form.Item name="fileUpload">
          <div style={{ marginTop: "4vh" }}>
            <Dragger {...props}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag files to this area to upload
              </p>
              <p className="ant-upload-hint"></p>
            </Dragger>
          </div>
        </Form.Item>
      </Form.Item>
    );
  }
}
