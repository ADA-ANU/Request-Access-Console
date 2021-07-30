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
import { RcFile, UploadFile, UploadListType } from "antd/lib/upload/interface";
import systemStore from "../stores/systemStore";
import { action, toJS } from "mobx";
import { NotificationPlacement } from "antd/lib/notification";
//import DynamicFieldSet from "./dynamicFields";
import authStore, { AuthStore } from "../stores/authStore";
import { FormInstance } from "antd/lib/form";
import { InboxOutlined, DeleteOutlined } from "@ant-design/icons";
import FileDownload from "./fileDownload";
import { FULFILLED } from "mobx-utils";
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
  state = {
    files: [],
    defaultFileList: [],
    progress: 0,
  };
  setProgress = (progress: number) => {
    this.setState({ progress: progress });
  };

  fileUpload = (options: any) => {
    const { onSuccess, onError, file, onProgress } = options;
    const { question, authStore } = this.props;
    console.log(file);
    const fmData = new FormData();
    const config = {
      headers: { "content-type": "multipart/form-data" },
      onUploadProgress: (event: any) => {
        onProgress({ percent: (event.loaded / event.total) * 100 });
      },
    };
    fmData.append("qID", question.questionid.toString());
    fmData.append("userid", authStore?.userid!.toString() as string);
    fmData.append("file", file);
    apiagent
      .post(`${API_URL.ROOT_URL}/${API_URL.HANDLE_FILE_UPDATE}`, fmData, config)
      .then((dd) => {
        console.log(dd);
        file.fileName = dd;
        onSuccess(null, file);
      })
      .catch((e) => {
        console.log(e);
        onError({ e });
      });
  };

  onChange = (info: any) => {
    const { status } = info.file;
    if (status !== "uploading") {
      //console.log(info.file, info.fileList);
    }
    if (status === "done") {
      this.props.authStore?.openNotificationSuccessful(
        `${info.file.name} successfully uploaded.`
      );
    } else if (status === "error") {
      this.props.authStore?.openNotification(
        `${info.file.name} failed to upload.`
      );
    }
  };
  onRemove = (file: any) => {
    console.log(file);
    this.props.authStore?.deleteFile(file);
  };
  render() {
    const { question, authStore } = this.props;
    //console.log(authStore);
    const props = {
      //style: { width: "30vw" },
      name: "file",
      accept: API_URL.ACCEPT_FILES.join(","),
      multiple: true,
      listType: "text" as "picture" | "text" | "picture-card" | undefined,
      data: { qID: question.questionid, userid: authStore?.userid },
      //action: `${API_URL.ROOT_URL}/${API_URL.HANDLE_FILE_UPDATE}`,
      //this.handleUploadedFiles(value.files)
      defaultFileList: [],
      // value.files[0].id
      //   ? this.handleUploadedFiles(value.files)
      //   : ([] as UploadFile<any>[]),
      showUploadList: {
        showDownloadIcon: false,
        //downloadIcon: "download ",
        showRemoveIcon: true,
        removeIcon: <DeleteOutlined />,
      },
      //   beforeUpload(file: RcFile, fileList: Array<any>) {
      //     console.log(file, fileList);
      //     for (let f of fileList) {
      //       if (f.size > API_URL.ACCEPT_SIZE) {
      //         authStore?.openNotification(`File is too large.`);
      //         return Upload.LIST_IGNORE;
      //       }
      //       if (authStore?.uploadedFiles.includes(f.name)) {
      //         authStore?.openNotification(`Duplicate file found.`);
      //         return Upload.LIST_IGNORE;
      //       } else authStore?.addFileName(f.name);
      //       const extension = `.${f.name
      //         .split(".")
      //         [f.name.split(".").length - 1].toLowerCase()}`;

      //       if (!API_URL.ACCEPT_FILES.includes(extension)) {
      //         authStore?.openNotification(
      //           `File with extension "${extension} isn't allowed to upload."`
      //         );
      //         return Upload.LIST_IGNORE;
      //       }
      //     }

      //     return true;
      //   },
      onChange(info: any) {
        const { status } = info.file;
        if (status !== "uploading") {
          console.log(info.file, info.fileList);
        }
        if (status === "done") {
          message.success(`${info.file.name} uploaded successfully.`);
        } else if (status === "error") {
          message.error(`${info.file.name} failed to upload.`);
        }
      },
      onDrop(e: any) {
        console.log("Dropped files", e.dataTransfer.files);
      },
      onRemove(file: UploadFile<any>) {
        console.log(file);
        authStore?.deleteFile(file.name);
        //authStore?.handleFileOnRemove(file);
      },
      progress: {
        strokeColor: {
          "0%": "#108ee9",
          "100%": "#87d068",
        },
        strokeWidth: 3,
        format: (percent: any) => `${parseFloat(percent.toFixed(2))}%`,
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
            <Dragger
              name="file"
              accept={API_URL.ACCEPT_FILES.join(",")}
              multiple={true}
              listType="text"
              showUploadList={{
                showDownloadIcon: false,
                //downloadIcon: "download ",
                showRemoveIcon: true,
                removeIcon: <DeleteOutlined />,
              }}
              customRequest={this.fileUpload}
              onChange={this.onChange}
              onRemove={this.onRemove}
            >
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
