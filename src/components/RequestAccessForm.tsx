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
  uploadQIDwithError: number[];
}
type MyState = { uploadQIDwithError: number[] };
// interface IState {
//     fileList: Array<any>,
//     uploading: boolean,
//     product: ProductType,
//     subDishes: Array<AddSubDishType>
// }

@inject("authStore")
@observer
export default class RequestAccessForm extends React.Component<
  RequestAccessProps,
  MyState
> {
  RAFormRef = React.createRef<FormInstance>();
  handleCancel = () => {
    //this.props.form.resetFields();
  };
  handleSubmit = (values: any) => {
    console.log("Received values of form: ", values);
    this.props.authStore?.submit(values);
  };

  render() {
    const { authStore, uploadQIDwithError } = this.props;
    console.log(toJS(authStore?.questions));
    return (
      <Row>
        <Col xs={1} sm={2} md={2} lg={3} xl={4} xxl={4} />
        <Col xs={22} sm={20} md={20} lg={18} xl={16} xxl={16}>
          <div
            style={{
              margin: "auto",
              paddingTop: "3vh",
            }}
          >
            <Form
              id="requestAccess"
              ref={authStore?.formRef}
              layout="vertical"
              size={"large"}
              scrollToFirstError
              onFinish={this.handleSubmit}
              initialValues={authStore?.responseValues}
            >
              {authStore?.questions &&
                authStore.questions.length > 0 &&
                authStore?.questions.map(
                  (q, index) =>
                    q.hidden === false && (
                      <div key={index}>
                        <RequestAccessQuestion
                          question={q}
                          key={index}
                          uploadQIDwithError={uploadQIDwithError}
                        />
                      </div>
                    )
                )}

              {authStore?.dataFiles && <DataFile />}
            </Form>
          </div>
        </Col>
        <Col xs={1} sm={2} md={2} lg={3} xl={4} xxl={4} />
      </Row>
    );
  }
}
