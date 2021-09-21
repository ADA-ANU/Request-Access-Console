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
//import "antd/dist/antd";
import getUnicodeFlagIcon from "country-flag-icons/unicode";
const { Option } = Select;
const { TextArea } = Input;
// interface ReturnFileType{
//     name: string
// }
interface RequestAccessQuestionProps {
  question: RequestAccessQ;
  authStore?: AuthStore;
  list: Country[] | [];
}

@inject("authStore")
@observer
export default class CountryList extends React.Component<RequestAccessQuestionProps> {
  render() {
    const { question, authStore, list } = this.props;
    //console.log(authStore);
    const _list: Array<Country> = list;
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
          showSearch
          style={{ width: "100%" }}
          allowClear
          disabled={authStore?.submitted || authStore?.hasAnyFileSubmitted}
          placeholder="select one country"
          optionLabelProp="label"
        >
          {_list &&
            _list.map((country: Country) => (
              <Option
                key={country.Name}
                value={country.Name}
                label={country.Name}
              >
                <div className="option-label-item">
                  <span
                    style={{ marginRight: "1vw" }}
                    role="img"
                    aria-label={country.Name}
                  >
                    {getUnicodeFlagIcon(country.Code)}
                  </span>
                  {country.Name}
                </div>
              </Option>
            ))}
        </Select>
      </Form.Item>
    );
  }
}
