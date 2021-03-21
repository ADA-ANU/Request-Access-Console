import React from "react";
import { inject, observer } from "mobx-react";
import {
  Divider,
  Checkbox,
  Row,
  Col,
  Input,
  message,
  notification,
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
  render() {
    const { authStore } = this.props;
    //console.log(authStore?.submitted);

    return (
      <>
        <div style={{ textAlign: "center", paddingTop: "5vh" }}>
          <Title level={4}>Request access to files in the same dataset</Title>
        </div>
        <div
          style={{
            paddingTop: "4vh",
            //display: "block",
            marginRight: 10,
          }}
        >
          <Checkbox
            style={{ display: "block", marginLeft: 0 }}
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
          >
            {authStore?.dataFiles.map((file) => {
              //console.log(authStore?.checkedDataFiles);
              //console.log(authStore?.checkedDataFiles.includes(file.id));
              return (
                <Row key={file.id}>
                  <Checkbox value={file.id} disabled={file.disabled}>
                    {file.label}
                  </Checkbox>
                </Row>
              );
            })}
          </CheckboxGroup>
        </div>
      </>
    );
  }
}
