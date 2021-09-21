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
import { RequestAccessQ, Country } from "../stores/data.d";
import { RouteComponentProps } from "react-router-dom";
import { UploadFile, UploadListType } from "antd/lib/upload/interface";
import systemStore from "../stores/systemStore";
import { action, toJS } from "mobx";
import { NotificationPlacement } from "antd/lib/notification";
//import DynamicFieldSet from "./dynamicFields";
import authStore, { AuthStore } from "../stores/authStore";
import { FormInstance } from "antd/lib/form";
import Options from "./options";
import Text from "./text";
import FileUpload from "./fileUpload";
import CountryList from "./countryList";
import "../index.css";
const { Option } = Select;
const { TextArea } = Input;
// interface ReturnFileType{
//     name: string
// }
interface RequestAccessQuestionProps {
  question: RequestAccessQ;
  authStore?: AuthStore;
  key: number;
  uploadQIDwithError: number[];
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
    const { authStore, question, uploadQIDwithError } = this.props;
    //console.log(authStore);
    const returnQuestion = (question: RequestAccessQ) => {
      const type = question.questiontype;
      if (type === "options")
        return (
          <div className="question">
            <Options question={question} />
          </div>
        );
      else if (type === "fileupload")
        return (
          <FileUpload
            question={question}
            uploadQIDwithError={uploadQIDwithError}
          />
        );
      else if (type === "countrylist")
        return (
          <div className="question">
            <CountryList list={authStore!.countryList} question={question} />
          </div>
        );
      else
        return (
          <div className="question">
            <Text question={question} />
          </div>
        );
    };
    return question && returnQuestion(question);
    // question.questiontype === "options" ? (
    //   <Options question={question} />
    // ) : (
    //   <Text question={question} />
    // );
  }
}
