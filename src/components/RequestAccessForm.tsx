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
  Skeleton,
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
import RequestAccessQuestion from "./RequestAccessQuestion";
import DataFile from "./dataFile";
// interface ReturnFileType{
//     name: string
// }
interface RequestAccessProps {
  //questions: Array<RequestAccessQuestion>;
  authStore?: AuthStore;
}
// interface IState {
//     fileList: Array<any>,
//     uploading: boolean,
//     product: ProductType,
//     subDishes: Array<AddSubDishType>
// }

@inject("authStore")
@observer
export default class RequestAccessForm extends React.Component<RequestAccessProps> {
  RAFormRef = React.createRef<FormInstance>();
  handleCancel = () => {
    //this.props.form.resetFields();
  };
  handleSubmit = (values: any) => {
    //console.log("Received values of form: ", values);
    this.props.authStore?.submit(values);
  };

  render() {
    const { authStore } = this.props;
    console.log(authStore?.showModal);
    return (
      <div style={{ margin: "auto", width: "50%", paddingTop: "3vh" }}>
        <Form
          id="requestAccess"
          ref={authStore?.formRef}
          layout="vertical"
          scrollToFirstError={true}
          onFinish={this.handleSubmit}
          initialValues={authStore?.responseValues}
        >
          {authStore?.questions &&
            authStore.questions.length > 0 &&
            authStore?.questions.map(
              (q, index) =>
                q.hidden === false && (
                  <RequestAccessQuestion question={q} key={index} />
                )
            )}
          {!authStore?.submitted && authStore?.dataFiles && <DataFile />}
        </Form>
      </div>
    );
  }
}
