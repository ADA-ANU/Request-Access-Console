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
import {
  RcFile,
  UploadChangeParam,
  UploadFile,
  UploadListType,
} from "antd/lib/upload/interface";
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

  handleUploadedFiles = (files: any[]) =>
    files.map((file) =>
      Object.assign(
        {},
        {
          uid: file.id,
          name: file.originalname,
          status: "done" as
            | "success"
            | "error"
            | "done"
            | "uploading"
            | "removed"
            | undefined,
          url: `${API_URL.fileDownload}${file.filename}`,
          fileName: file.filename,
        }
      )
    );
  fileUpload = (options: any) => {
    const { onSuccess, onError, file, onProgress } = options;
    const { question, authStore } = this.props;
    console.log(file);
    if (
      authStore?.uploadedFiles.get(question.questionid) &&
      authStore?.uploadedFiles.get(question.questionid).length >=
        API_URL.UPLOAD_LIMIT
    ) {
      //authStore?.openNotification(`Upload limit reached.`);
      return onError(`Upload limit reached`);
    }
    if (file.size > API_URL.ACCEPT_SIZE) {
      //authStore?.openNotification(`File is too large.`);
      return onError(`File is too large`);
    }
    console.log(authStore?.uploadedFiles.get(question.questionid));
    if (
      authStore?.uploadedFiles.get(question.questionid) &&
      authStore?.uploadedFiles.get(question.questionid).includes(file.name)
    ) {
      //authStore?.openNotification(`Duplicate file found.`);
      return onError(`Duplicate file found`);
    } else authStore?.addFileName(question.questionid, file.name);
    const extension = `.${file.name
      .split(".")
      [file.name.split(".").length - 1].toLowerCase()}`;

    if (!API_URL.ACCEPT_FILES.includes(extension)) {
      // authStore?.openNotification(
      //   `File with extension "${extension}" isn't allowed to upload.`
      // );
      return onError(
        `File with extension "${extension}" isn't allowed to upload`
      );
    }
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
        // authStore?.openNotification(
        //   e.data
        //     ? `Failed to upload ${file.name} due to ${e.data}`
        //     : `Failed to upload ${file.name} due to ${e}`
        // );
        onError(e.data ? e.data : e);
      });
  };

  onChange = (info: UploadChangeParam<UploadFile<any>>) => {
    console.log(info.file);
    // if (status !== "uploading") {
    //   //console.log(info.file, info.fileList);
    // }
    if (info.file.status === "done") {
      this.props.authStore?.openNotificationSuccessful(
        `${info.file.name} successfully uploaded.`
      );
    }
    if (info.file.status === "error") {
      this.props.authStore?.openNotification(
        `Failed to upload ${info.file.name} as ${
          info.file.error.e ? info.file.error.e : info.file.error
        }.`
      );
    }
  };
  onRemove = (file: any) => {
    console.log(file);
    this.props.authStore?.deleteFile(this.props.question.questionid, file);
  };
  render() {
    const { question, authStore } = this.props;
    console.log(
      question.clientuploadedfiles[0],
      question.clientuploadedfiles[0].id,
      this.handleUploadedFiles(question.clientuploadedfiles)
    );
    const props = {
      //style: { width: "30vw" },
      name: "file",
      accept: API_URL.ACCEPT_FILES.join(","),
      multiple: true,
      listType: "text" as "picture" | "text" | "picture-card" | undefined,
      //data: { qID: question.questionid, userid: authStore?.userid },
      //action: `${API_URL.ROOT_URL}/${API_URL.HANDLE_FILE_UPDATE}`,
      //this.handleUploadedFiles(value.files)

      // value.files[0].id
      //   ? this.handleUploadedFiles(value.files)
      //   : ([] as UploadFile<any>[]),
      showUploadList: {
        showDownloadIcon: false,
        //downloadIcon: "download ",
        showRemoveIcon: true,
        removeIcon: <DeleteOutlined />,
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
        //key={question.displayorder}
        name={`upload-${question.questionid}`}
        label={question.questionstring}
        rules={[
          {
            //question.required
            //required: true,
            //message: "This field cannot be empty.",
          },
        ]}
      >
        {question.questionfiles &&
          question.questionfiles[0] &&
          question.questionfiles[0].id && (
            <Row gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 16]}>
              {question.questionfiles.map((file: uploadFile) => (
                <FileDownload file={file} key={file.id} />
              ))}
            </Row>
          )}
        <Form.Item
          //key={question.displayorder}
          //name="fileUpload"
          rules={[
            {
              //question.required
              required: true,
              message: "This field cannot be empty.",
            },
          ]}
        >
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
                //removeIcon: <DeleteOutlined />,
              }}
              defaultFileList={
                question.clientuploadedfiles[0] &&
                question.clientuploadedfiles[0].id
                  ? (this.handleUploadedFiles(
                      question.clientuploadedfiles
                    ) as UploadFile<any>[])
                  : ([] as UploadFile<any>[])
              }
              customRequest={this.fileUpload}
              onChange={this.onChange}
              onRemove={this.onRemove}
              progress={{
                strokeColor: {
                  "0%": "#108ee9",
                  "100%": "#87d068",
                },
                strokeWidth: 3,
                format: (percent: any) => `${parseFloat(percent.toFixed(2))}%`,
              }}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag <strong> up to 10</strong> files to this area to
                upload.
              </p>
              <p className="ant-upload-text">
                Maximum size for each file is <strong>30 MB</strong>
              </p>
              <p className="ant-upload-text">
                Allowed file types:{" "}
                <strong>
                  .doc, .docx, .pdf, .png, .jpg, .jpeg, .xls, .xlsx
                </strong>
              </p>
              <p className="ant-upload-hint"></p>
            </Dragger>
          </div>
        </Form.Item>
      </Form.Item>
    );
  }
}
