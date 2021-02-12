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
import { RequestAccessQ } from "../stores/data";
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
}

@inject("authStore")
@observer
export default class Text extends React.Component<RequestAccessQuestionProps> {
  render() {
    const { question } = this.props;
    //console.log(authStore);
    return (
      <Form.Item
        key={question.displayorder}
        name={question.displayorder}
        label={question.questionstring}
        rules={[
          {
            required: question.required,
            message: "This field cannot be empty.",
          },
        ]}
      >
        <TextArea rows={4} />
      </Form.Item>
    );
  }
}
