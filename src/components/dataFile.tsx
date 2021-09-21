import React from "react";
import { inject, observer } from "mobx-react";
import {
  Divider,
  Checkbox,
  Row,
  Col,
  Input,
  message,
  Tag,
  Typography,
} from "antd";
import API_URL from "../config";
import axios, { AxiosRequestConfig } from "axios";
import apiagent from "../stores/apiagent";
import { dataFiles } from "../stores/data";
import { RouteComponentProps } from "react-router-dom";
import { UploadFile, UploadListType } from "antd/lib/upload/interface";
import systemStore from "../stores/systemStore";
import { action, toJS } from "mobx";
import { NotificationPlacement } from "antd/lib/notification";
//import DynamicFieldSet from "./dynamicFields";
const { Title, Text } = Typography;
import authStore, { AuthStore } from "../stores/authStore";
import { FormInstance } from "antd/lib/form";
const CheckboxGroup = Checkbox.Group;
// interface ReturnFileType{
//     name: string
// }
interface DataFileProps {
  authStore?: AuthStore;
}

@inject("authStore")
@observer
export default class DataFile extends React.Component<DataFileProps> {
  checkDisable = (file: dataFiles) => {
    if (this.props.authStore?.submitted) {
      return true;
    } else {
      if (file.disabled) return true;
      else return false;
    }
  };
  render() {
    const { authStore } = this.props;
    console.log(authStore?.checkedDataFiles);

    return (
      <div style={{ marginTop: "13vh" }}>
        <div style={{ textAlign: "center", paddingTop: "3vh" }}>
          <Title level={4}>
            Request access to restricted files in the same dataset
          </Title>
        </div>
        <div
          style={{
            paddingTop: "4vh",
            //display: "block",
            marginRight: 10,
          }}
        >
          <Checkbox
            style={{ marginLeft: 0 }}
            indeterminate={authStore?.indeterminate}
            onChange={authStore?.onCheckAllChange}
            checked={authStore?.checkall}
            disabled={authStore?.submitted}
          >
            Check all
          </Checkbox>
          <Divider />
          <CheckboxGroup
            //options={authStore?.dataFiles}
            value={authStore?.checkedDataFiles}
            onChange={authStore?.onChange}
            style={{ display: "flex", flexWrap: "wrap" }}
          >
            {authStore?.dataFiles.map(
              (file) =>
                //console.log(file);
                //console.log(authStore?.checkedDataFiles.includes(file.id));
                //disabled={file.disabled}
                file.restricted && (
                  <div style={{ marginBottom: "5vh", marginRight: "1vw" }}>
                    {/* <Row key={file.id} style={{ marginBottom: "5vh" }}> */}
                    <Checkbox
                      key={file.id}
                      value={file.id}
                      disabled={this.checkDisable(file)}
                    >
                      <div key={file.label} style={{ marginBottom: "1vh" }}>
                        {file.label}
                      </div>
                      <div key={file.description}>
                        Description: {file.description}
                      </div>
                      <div>
                        {file.tags.length > 0 &&
                          file.tags.map((tag, index) => (
                            <Tag key={`${file.id}-${tag}`} color="#108ee9">
                              {tag}
                            </Tag>
                          ))}
                      </div>
                    </Checkbox>

                    {/* </Row> */}
                  </div>
                )
            )}
          </CheckboxGroup>
        </div>
        <div style={{ textAlign: "center", paddingTop: "5vh" }}>
          <Title level={4}>Unrestricted files in the same dataset</Title>
        </div>
        <div
          style={{
            paddingTop: "4vh",
            paddingBottom: "3vh",
            //display: "block",
            //marginRight: 10,
          }}
        >
          <ol style={{ paddingLeft: "16px" }}>
            {authStore?.dataFiles.map(
              (file, index) =>
                !file.restricted && (
                  <li key={`${file.id}-${index}`}>
                    <div key={file.label} style={{ marginBottom: "1vh" }}>
                      {file.label}
                    </div>
                    <div key={file.description}>
                      Description: {file.description}
                    </div>
                    <div>
                      {file.tags.length > 0 &&
                        file.tags.map((tag, index) => (
                          <Tag key={`${file.id}-${tag}`} color="#108ee9">
                            {tag}
                          </Tag>
                        ))}
                    </div>
                  </li>
                )
            )}
          </ol>
        </div>
      </div>
    );
  }
}
