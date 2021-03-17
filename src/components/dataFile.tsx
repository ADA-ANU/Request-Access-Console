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
    //console.log(authStore);
    return (
      <>
        <Checkbox
          indeterminate={authStore?.indeterminate}
          onChange={authStore?.onCheckAllChange}
          checked={authStore?.checkall}
        >
          Check all
        </Checkbox>
        <Divider />
        <CheckboxGroup
          options={authStore?.dataFiles.map((d) => d.label)}
          value={authStore?.checkedDataFiles}
          onChange={authStore?.onChange}
        />
      </>
    );
  }
}
