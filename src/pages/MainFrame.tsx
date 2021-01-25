import React from "react";
import { inject, observer } from "mobx-react";
import { Switch, Route, Link } from "react-router-dom";
import ADAlogo from "../resource/ADA-logo.png";
import ANUlogo from "../resource/ANUlogo.png";
import Vertical_line from "../resource/vertical-line.js";
import DVlogo from "../resource/DVlogo.png";
import {
  Layout,
  Menu,
  DatePicker,
  Alert,
  Spin,
  Modal,
  Row,
  Badge,
  Tooltip,
  Affix,
  Avatar,
  Button,
  Col,
  Dropdown,
} from "antd";
import { SystemStore } from "../stores/systemStore";
import { IRoutingProps } from "../props.d";
import OrderList from "../components/OrderList";
import ProductList from "../components/ProductList";
import OrderHistoryList from "../components/OrderHistoryList";
import UserProfile from "./UserProfile";
import authStore, { AuthStore } from "../stores/authStore";
import { PrinterStore } from "../stores/printerStore";
//import PrinterConfig from './PrinterConfig';
import { UserOutlined, KeyOutlined } from "@ant-design/icons";

const { Header, Content, Footer } = Layout;

export interface IMainFrameProps extends IRoutingProps {
  systemStore?: SystemStore;
  authStore?: AuthStore;
  printerStore?: PrinterStore;
}

@inject("systemStore", "routingStore", "authStore", "printerStore")
@observer
export default class MainFrame extends React.Component<IMainFrameProps> {
  componentDidMount() {
    const pathname = this.props.routingStore?.location.pathname;
    const param = pathname?.split("/")[1];
    console.log(param);
    this.props.authStore?.init(param);
  }
  render() {
    let { systemStore, routingStore, printerStore } = this.props;
    const menu = (
      <Menu>
        <Menu.Item key="0" icon={<KeyOutlined />}>
          <span style={{ cursor: "pointer" }} onClick={() => {}}>
            Manage API Keys
          </span>
          {/* <APIManager /> */}
        </Menu.Item>
        <Menu.Item key="1">
          <span style={{ cursor: "pointer" }} onClick={() => {}}>
            Log out
          </span>
        </Menu.Item>
      </Menu>
    );
    return (
      // <Spin spinning={siteStore?siteStore.siteLoading : true} tip="Loading...">
      <Spin spinning={false} tip="Loading...">
        <Layout style={{ background: "#f0f2f5" }}>
          <Affix offsetTop={0}>
            <Header
              style={{
                background: "white",
                width: "100%",
                height: "64px",
                lineHeight: "64px",
                padding: "0px",
                fontSize: "100",
                boxShadow: "0 1px 4px rgba(0,21,41,0.08",
              }}
            >
              <Row>
                {/*marginLeft: '68px', marginRight:'32px' style={{marginTop:'auto', marginBottom:'auto'}}*/}
                <Col
                  xs={{ span: 4, offset: 1 }}
                  sm={{ span: 4, offset: 2 }}
                  md={{ span: 4, offset: 1 }}
                  lg={{ span: 4, offset: 1 }}
                  xl={{ span: 4, offset: 1 }}
                  xxl={{ span: 4, offset: 1 }}
                >
                  <img
                    alt="LOGO"
                    className="logo"
                    style={{ width: "80%" }}
                    src={ADAlogo}
                  />
                  {/*cursor:'pointer' onClick={()=>{history.push('/dashboard/adapt2-new')}}*/}
                </Col>
                <Col
                  xs={{ span: 16, offset: 0 }}
                  sm={{ span: 12, offset: 0 }}
                  md={{ span: 13, offset: 0 }}
                  lg={{ span: 13, offset: 0 }}
                  xl={{ span: 13, offset: 0 }}
                  xxl={{ span: 13, offset: 0 }}
                ></Col>
                <Col
                  xs={{ span: 1, offset: 0 }}
                  sm={{ span: 1, offset: 0 }}
                  md={{ span: 1, offset: 1 }}
                  lg={{ span: 1, offset: 1 }}
                  xl={{ span: 1, offset: 1 }}
                  xxl={{ span: 1, offset: 1 }}
                >
                  <div style={{ textAlign: "center" }}>
                    <Dropdown
                      overlay={menu}
                      trigger={["click"]}
                      placement="bottomCenter"
                    >
                      <Badge count={0}>
                        <Button
                          type="primary"
                          shape="circle"
                          icon={<UserOutlined />}
                        />
                      </Badge>
                    </Dropdown>
                  </div>
                </Col>
                <Col
                  xs={{ span: 0, offset: 1 }}
                  sm={{ span: 4, offset: 1 }}
                  md={{ span: 3, offset: 0 }}
                  lg={{ span: 3, offset: 0 }}
                  xl={{ span: 2, offset: 0 }}
                  xxl={{ span: 2, offset: 0 }}
                >
                  {/* <span>{user? user.userName: ""}</span> */}
                </Col>
              </Row>
            </Header>
          </Affix>
          <Content style={{ padding: "1%" }}>
            asdfadsf
            {
              // authStore? authStore.networkError === true?
              //     <Alert style={{textAlign: 'center'}} message={ authStore.networkErrorMessage.toString() } type="error" />
              //     : '' : ''
            }
            {/* <Route exact path='/dashboard' component={newAdapt2} />
                                    <Route exact path='/dashboard/copy-tool' component={CopyTool} />
                                    <Route exact path='/dashboard/bulk-publish' component={bulkPublish} />
                                    <Route exact path='/dashboard/hccda-images' component={hccdaImages} /> */}
          </Content>

          <Footer style={{ textAlign: "center" }}>
            <hr />
            <Row justify="center" style={{ paddingTop: "2vh" }}>
              <img
                className="logo"
                style={{
                  height: "64px",
                  lineHeight: "76px",
                  marginTop: "10px",
                }}
                src={ADAlogo}
              />
              <img
                className="logo"
                style={{ height: "84px", lineHeight: "96px" }}
                src={Vertical_line}
              />
              <img
                className="logo"
                style={{
                  height: "64px",
                  lineHeight: "76px",
                  marginTop: "10px",
                }}
                src={ANUlogo}
              />
              <img
                className="logo"
                style={{ height: "84px", lineHeight: "76px" }}
                src={Vertical_line}
              />
              <img
                className="logo"
                style={{
                  height: "64px",
                  lineHeight: "76px",
                  marginTop: "10px",
                }}
                src={DVlogo}
              />
            </Row>
            <br />
            <Row justify="center">
              © {new Date().getFullYear()} Australian Data Archive (Australian
              National University) | All Rights Reserved.
            </Row>
          </Footer>
        </Layout>
      </Spin>
    );
  }
}
