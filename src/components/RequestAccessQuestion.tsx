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
  Rate,
  Checkbox,
  Row,
  Col,
  Input,
  message,
  notification,
} from "antd";
const { TextArea } = Input;
import API_URL from "../config";
import axios, { AxiosRequestConfig } from "axios";
import apiagent from "../stores/apiagent";
import { RequestAccessQ } from "../stores/data.d";
import { RouteComponentProps } from "react-router-dom";
import { UploadFile, UploadListType } from "antd/lib/upload/interface";
import systemStore from "../stores/systemStore";
import { action, toJS } from "mobx";
import { NotificationPlacement } from "antd/lib/notification";
//import DynamicFieldSet from "./dynamicFields";
import authStore, { AuthStore } from "../stores/authStore";
import { FormInstance } from "antd/lib/form";

// interface ReturnFileType{
//     name: string
// }
interface RequestAccessQuestionProps {
  question: RequestAccessQ;
  authStore?: AuthStore;
}

@inject("authStore")
@observer
export default class RequestAccessQuestion extends React.Component<RequestAccessQuestionProps> {
  RAFormRef = React.createRef<FormInstance>();
  handleCancel = () => {
    //this.props.form.resetFields();
  };
  handleSubmit = (e: any) => {
    e.preventDefault();
  };

  render() {
    const { authStore } = this.props;
    console.log(authStore);
    return (
      <Form
        id="dataverseFiles"
        ref={this.RAFormRef}
        scrollToFirstError={true}
        onFinish={this.handleSubmit}
      >
        {authStore?.questions && authStore.questions.length > 0
          ? authStore?.questions.map((q) => {
              console.log(q);
            })
          : () => console.log("null")}
      </Form>
    );
  }
}
