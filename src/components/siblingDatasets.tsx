import React from "react";
import { inject, observer } from "mobx-react";
import {
  Divider,
  Checkbox,
  Row,
  Col,
  Input,
  message,
  Tag,
  Typography,
} from "antd";
import API_URL from "../config";
import axios, { AxiosRequestConfig } from "axios";
import apiagent from "../stores/apiagent";
import { dataFiles, siblingDataset } from "../stores/data";
import { RouteComponentProps } from "react-router-dom";
import { UploadFile, UploadListType } from "antd/lib/upload/interface";
import systemStore from "../stores/systemStore";
import { action, toJS } from "mobx";
import { NotificationPlacement } from "antd/lib/notification";
import SiblingDataset from "./siblingDataset";
//import DynamicFieldSet from "./dynamicFields";
const { Title, Text } = Typography;
import authStore, { AuthStore } from "../stores/authStore";
import { FormInstance } from "antd/lib/form";
const CheckboxGroup = Checkbox.Group;
// interface ReturnFileType{
//     name: string
// }
interface SiblingDatasetsProps {
  authStore?: AuthStore;
}

@inject("authStore")
@observer
export default class SiblingDatasets extends React.Component<SiblingDatasetsProps> {
  checkDisable = (file: dataFiles) => {
    if (this.props.authStore?.submitted) {
      return true;
    } else {
      if (file.disabled) return true;
      else return false;
    }
  };
  render() {
    const { authStore } = this.props;
    // console.log(authStore!.checkedDataFiles.get(11));
    // console.log(authStore!.checkedDataFiles.get(15));

    return (
      <Row>
        <Col xs={1} sm={1} md={2} lg={3} xl={4} xxl={2} />
        <Col xs={22} sm={22} md={20} lg={18} xl={16} xxl={20}>
          <div
            id="siblingDatasets"
            style={{ textAlign: "center", paddingTop: "3vh" }}
          >
            <Title level={4}>
              Request access to restricted files in sibling datasets
            </Title>
          </div>
          <div
            style={{
              paddingTop: "4vh",
              //display: "block",
              marginRight: 10,
              width: "100%",
            }}
          >
            {authStore!.siblingDatasets &&
              authStore!.siblingDatasets.length > 0 &&
              authStore!.siblingDatasets!.map(
                (dataset: siblingDataset, idx: number) => (
                  <SiblingDataset
                    key={dataset.id}
                    dataset={dataset}
                    authStore={this.props.authStore}
                    isLastItem={idx === authStore!.siblingDatasets.length - 1}
                    checkedDataFiles={authStore?.checkedDataFiles.get(
                      Number(dataset.id)
                    )}
                    siblingCheckAllOnChange={(
                      datasetID: number,
                      datafileIDs: number[]
                    ) =>
                      authStore!.siblingCheckAllOnChange(datasetID, datafileIDs)
                    }
                    submitted={authStore!.submitted}
                  />
                )
              )}
          </div>
        </Col>
        <Col xs={1} sm={1} md={2} lg={3} xl={4} xxl={2} />
      </Row>
    );
  }
}
