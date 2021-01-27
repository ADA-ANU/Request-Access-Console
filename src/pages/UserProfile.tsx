import React from "react";
import { inject, observer } from "mobx-react";
import { AuthStore } from "../stores/authStore";

import {
  Layout,
  Spin,
  Badge,
  Button,
  Row,
  Col,
  Descriptions,
  List,
} from "antd";
import API_URL from "../config";

export interface UserProfileProps {
  authStore: AuthStore;
}

@inject("authStore", "openTimeStore")
@observer
export default class UserProfile extends React.Component<UserProfileProps> {
  render() {
    let { authStore } = this.props;
    const restaurantInfo = authStore!.restaurantInfo || {};

    return (
      // <Spin spinning={siteStore?siteStore.siteLoading : true} tip="Loading...">
      <Spin spinning={false} tip="Loading...">
        <Layout
          style={{ background: "#FFFFFF", margin: "20px 5%", padding: 20 }}
        >
          <Row justify="center">
            <Col>
              <h1>Restaurant Information</h1>
            </Col>
          </Row>
          <Row justify="center">
            <Descriptions
              bordered
              layout="vertical"
              style={{ width: "100%" }}
              column={{ xs: 2, sm: 3, md: 4, lg: 5, xl: 6 }}
            >
              <Descriptions.Item label="Restaurent Top Band" span={24}>
                <img
                  src={`${API_URL.ROOT_URL}${API_URL.IMAGE}/${restaurantInfo.backgroundImg}`}
                ></img>
              </Descriptions.Item>
              <Descriptions.Item label="Name">
                {restaurantInfo.name}
              </Descriptions.Item>
              <Descriptions.Item label="Type">
                {restaurantInfo.type}
              </Descriptions.Item>
              <Descriptions.Item label="Logo">
                <img
                  src={`${API_URL.ROOT_URL}${API_URL.IMAGE}/${restaurantInfo.logo}`}
                ></img>{" "}
              </Descriptions.Item>

              <Descriptions.Item label="Phone">
                {restaurantInfo.phone}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {restaurantInfo.email}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                {restaurantInfo.checkin === true ? (
                  <Badge status="processing" text="Active" />
                ) : (
                  <Badge status="warning" text="Inactive" />
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Address" span={24}>{`${
                restaurantInfo.no || ""
              } ${restaurantInfo.street} ${restaurantInfo.suburb} ${
                restaurantInfo.state
              }`}</Descriptions.Item>

              <Descriptions.Item label="Introduction" span={24}>
                {restaurantInfo.description}
              </Descriptions.Item>
            </Descriptions>
          </Row>
          <Row>
            * Please contact{" "}
            <a
              href={`mailto:info@instasoft.com.au?Subject=${restaurantInfo.name}`}
            >
              info@instasoft.com.au
            </a>{" "}
            to update restaurant information.
          </Row>
          <hr />
          <Row justify="center">
            {/* <Button size="large" onClick={()=>authStore!.logout()}>Logout</Button> */}
          </Row>
        </Layout>
      </Spin>
    );
  }
}
