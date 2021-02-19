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
const { Option } = Select;
const { TextArea } = Input;
// interface ReturnFileType{
//     name: string
// }
interface RequestAccessQuestionProps {
  question: RequestAccessQ;
  authStore?: AuthStore;
}

@inject("authStore")
@observer
export default class Options extends React.Component<RequestAccessQuestionProps> {
  render() {
    const { question, authStore } = this.props;
    //console.log(authStore);
    return (
      <Form.Item
        key={question.displayorder}
        name={question.questionid}
        label={question.questionstring}
        rules={[
          {
            required: question.required,
            message: "This field cannot be empty.",
          },
        ]}
      >
        <Select
          style={{ width: "100%" }}
          allowClear
          disabled={authStore?.submitted}
        >
          {question.options.map((option: string) => (
            <Option key={option} value={option}>
              {option}
            </Option>
          ))}
        </Select>
      </Form.Item>
    );
  }
}
