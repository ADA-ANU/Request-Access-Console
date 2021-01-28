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
export default class RequestAccessQuestion extends React.Component<RequestAccessQuestionProps> {
  //RAFormRef = React.createRef<FormInstance>();
  handleCancel = () => {
    //this.props.form.resetFields();
  };
  handleSubmit = (e: any) => {
    e.preventDefault();
  };

  render() {
    const { authStore, question } = this.props;
    console.log(authStore);
    return question && question.questiontype === "options" ? (
      <Form.Item
        name={question.questionstring}
        label={question.questionstring}
        rules={[
          {
            required: question.required,
            message: "Please input your E-mail!",
          },
        ]}
      >
        <Select style={{ width: 120 }} allowClear>
          {question.options.map((option: string) => (
            <Option value={option}>{option}</Option>
          ))}
        </Select>
      </Form.Item>
    ) : (
      <Form.Item
        name={question.questionstring}
        label={question.questionstring}
        rules={[
          {
            required: question.required,
            message: "Please input your E-mail!",
          },
        ]}
      >
        <TextArea rows={4} />
      </Form.Item>
    );
  }
}
