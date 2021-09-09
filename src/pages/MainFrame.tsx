import React from "react";
import { inject, observer } from "mobx-react";
import { Switch, Route, Link } from "react-router-dom";
import ADAlogo from "../resource/ADA-logo.png";
import ANUlogo from "../resource/ANUlogo.png";
import Vertical_line from "../resource/vertical-line.js";
import DVlogo from "../resource/DVlogo.png";
import warningLogo from "../resource/warningLogo.png";
import {
  Layout,
  Menu,
  Typography,
  Alert,
  Spin,
  Form,
  Row,
  Badge,
  Tooltip,
  Affix,
  Modal,
  Skeleton,
  Button,
  Col,
  Checkbox,
} from "antd";
import { SystemStore } from "../stores/systemStore";
import { IRoutingProps } from "../props.d";
import UserProfile from "./UserProfile";
import authStore, { AuthStore } from "../stores/authStore";
//import PrinterConfig from './PrinterConfig';
import {
  UserOutlined,
  KeyOutlined,
  PoweroffOutlined,
  ExclamationCircleOutlined,
  CheckCircleTwoTone,
  CheckCircleOutlined,
} from "@ant-design/icons";
import RequestAccessForm from "../components/RequestAccessForm";
import Parser from "html-react-parser";
const { Title, Text, Paragraph } = Typography;
const { Header, Content, Footer } = Layout;
const CheckboxGroup = Checkbox.Group;

export interface IMainFrameProps extends IRoutingProps {
  systemStore?: SystemStore;
  authStore?: AuthStore;
}

@inject("systemStore", "routingStore", "authStore")
@observer
export default class MainFrame extends React.Component<IMainFrameProps> {
  state = {
    uploadQIDwithError: [],
  };
  componentDidMount() {
    const pathname = this.props.routingStore?.location.pathname;
    const param = pathname?.split("/")[1];
    //console.log(param);
    if (!param || param === "") {
      this.props.authStore?.unauthorised("No guestbook was found.");
    } else this.props.authStore?.init(param);
  }
  submissionCheck = () => {
    console.log("checking");
    // let qidWithError: number[] = [];
    // this.props.authStore?.uploadedFiles.forEach(
    //   (value: string[], key: number) => {
    //     const question = this.props.authStore?.questions?.find(
    //       (q) => q.questionid === key
    //     );
    //     if (question && question?.required && value.length === 0) {
    //       qidWithError.push(key);
    //     }
    //   }
    // );
    // if (qidWithError.length > 0) {
    //   console.log(qidWithError);
    //   this.setState((prevState) => {
    //     return {
    //       uploadQIDwithError: qidWithError,
    //     };
    //   });
    // } else {
    console.log("checking");
    this.props.authStore?.confirmModal();
    //}
  };
  render() {
    let { systemStore, routingStore, authStore } = this.props;
    const { uploadQIDwithError } = this.state;
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
      // <Spin spinning={this.props.authStore?.isLoading} tip="Loading...">
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
              >
                <div
                  style={{
                    textAlign: "center",
                    margin: "auto",
                    paddingTop: "1%",
                  }}
                >
                  <Title level={3}>REQUEST ACCESS MANAGEMENT SYSTEM</Title>
                </div>
              </Col>
              <Col
                xs={{ span: 1, offset: 0 }}
                sm={{ span: 1, offset: 0 }}
                md={{ span: 1, offset: 1 }}
                lg={{ span: 1, offset: 1 }}
                xl={{ span: 1, offset: 1 }}
                xxl={{ span: 2, offset: 1 }}
              >
                <div style={{ textAlign: "right" }}>
                  {/* <Dropdown
                      overlay={menu}
                      trigger={["click"]}
                      placement="bottomCenter"
                    > */}
                  <Badge count={0}>
                    <Button
                      type="primary"
                      shape="circle"
                      icon={<UserOutlined />}
                    />
                  </Badge>
                  {/* </Dropdown> */}
                </div>
              </Col>
              <Col
                xs={{ span: 0, offset: 0 }}
                sm={{ span: 4, offset: 0 }}
                md={{ span: 3, offset: 0 }}
                lg={{ span: 3, offset: 1 }}
                xl={{ span: 2, offset: 1 }}
                xxl={{ span: 2, offset: 0 }}
              >
                <div style={{ paddingLeft: "1vw" }}>
                  <span>
                    {authStore?.userFirstName && authStore.userLastName
                      ? `${authStore.userFirstName} ${authStore.userLastName}`
                      : "Guest"}
                  </span>
                </div>
              </Col>
            </Row>
          </Header>
        </Affix>
        <Content style={{ padding: "1%", marginBottom: "15vh" }}>
          {authStore?.authenticated ? (
            this.props.authStore?.isLoading ? (
              <div style={{ width: "70%", margin: "auto" }}>
                <Skeleton active title={true} paragraph={{ rows: 20 }} />
              </div>
            ) : (
              <>
                <div
                  style={{
                    paddingTop: "3vh",
                    paddingBottom: "3vh",
                    textAlign: "center",
                  }}
                >
                  <Title level={3}>Dataset: {authStore.datasetTitle}</Title>
                  <Row justify="center" align="middle">
                    <Col>
                      <Title level={4}>Link:</Title>
                    </Col>
                    <Col style={{ marginLeft: "1vw", marginBottom: "10px" }}>
                      <a href={authStore.datasetURL} target="_blank">
                        {authStore.datasetURL}
                      </a>
                    </Col>
                  </Row>
                </div>
                {this.props.authStore?.submitted ? (
                  <div style={{ textAlign: "center", paddingTop: "5vh" }}>
                    <Row justify="center" gutter={16}>
                      <Col>
                        <CheckCircleOutlined
                          style={{ color: "#007916", fontSize: "3vh" }}
                        />
                      </Col>
                      <Col>
                        <Title level={4}>This form has been submitted.</Title>
                      </Col>
                    </Row>
                  </div>
                ) : null}
                <RequestAccessForm uploadQIDwithError={uploadQIDwithError} />
                {!authStore.submitted ? (
                  <div style={{ textAlign: "center", paddingTop: "5vh" }}>
                    <Row>
                      <Col span={2} offset={9}>
                        <Button
                          //form="requestAccess"
                          key="save"
                          htmlType="button"
                          type="primary"
                          //icon={<PoweroffOutlined />}
                          loading={authStore.submitting}
                          onClick={() => authStore!.save()}
                          disabled={authStore.submitted}
                        >
                          Save!
                        </Button>
                      </Col>
                      <Col span={2} offset={2}>
                        <div>
                          <Button
                            form="requestAccess"
                            key="submit"
                            //htmlType="submit"
                            type="primary"
                            icon={<PoweroffOutlined />}
                            loading={authStore.submitting}
                            disabled={
                              authStore.submitted ||
                              authStore?.checkedDataFiles.length === 0
                            }
                            onClick={() => this.submissionCheck()}
                          >
                            Submit!
                          </Button>
                        </div>
                      </Col>
                      <Col span={3}>
                        {authStore?.validationError && (
                          <Text type="danger" strong>
                            You must answer all questions unless they are marked
                            optional.
                          </Text>
                        )}
                      </Col>
                    </Row>
                  </div>
                ) : null}
              </>
            )
          ) : (
            <div
              style={{
                textAlign: "center",
                paddingTop: "5vh",
                marginBottom: "10vh",
              }}
            >
              <img
                className="warning"
                style={{
                  height: "200px",
                  lineHeight: "200px",
                  marginTop: "10vh",
                  marginBottom: "8vh",
                }}
                src={warningLogo}
              />
              <Title level={3}>{authStore?.errorMsg}</Title>
            </div>
          )}

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

        <Footer
          style={{
            textAlign: "center",
            backgroundColor: "white",
            paddingTop: "0",
          }}
        >
          <Row justify="center" style={{ paddingTop: "5vh" }}>
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
            National University) All Rights Reserved.
          </Row>
          <Modal
            visible={authStore?.showModal}
            //title="Terms and Conditions"
            width="60%"
            closable={false}
            maskClosable={false}
            onOk={() => authStore?.handleModal(false)}
            onCancel={() => authStore?.handleModal(false)}
            footer={null}
          >
            <p
              style={{
                textAlign: "center",
                fontWeight: "bold",
                fontSize: "150%",
              }}
            >
              Terms and Conditions
            </p>
            <hr />
            <Row
              style={{
                paddingTop: "2vh",
                minHeight: "30vh",
              }}
            >
              <Col span={10} offset={1}>
                <p
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: "120%",
                  }}
                >
                  Terms of Access
                </p>
                {authStore?.termsOfAccess}
              </Col>
              <Col span={10} offset={2}>
                <p
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: "120%",
                  }}
                >
                  Terms of Use
                </p>
                <div style={{ maxHeight: "40vh", overflow: "auto" }}>
                  {
                    Parser(authStore?.termsOfUse!)
                    // <div
                    //   dangerouslySetInnerHTML={{ __html: authStore.termsOfUse! }}
                    // />
                  }
                </div>
              </Col>
            </Row>

            <Row style={{ paddingTop: "5vh" }}>
              <Col span={10} offset={1}>
                <CheckboxGroup
                  value={authStore?.termsCheckboxValues}
                  onChange={authStore?.termsOnchange}
                >
                  {authStore?.termsCheckboxes.map((term, index) => (
                    <Row key={index}>
                      <Checkbox value={term}>{term}</Checkbox>
                    </Row>
                  ))}
                </CheckboxGroup>
              </Col>
            </Row>
            <div style={{ paddingTop: "3vh" }}>
              <hr />
            </div>

            <Row justify="center" style={{ paddingTop: "2vh" }}>
              <Col>
                <Button
                  key="back"
                  onClick={() => authStore?.handleModal(false)}
                >
                  Return
                </Button>
              </Col>
              <Col offset={1}>
                <Button
                  form="requestAccess"
                  key="submit"
                  htmlType="submit"
                  type="primary"
                  loading={authStore?.submitting}
                  //onClick={() => authStore.handleModal(false)}
                  disabled={
                    authStore?.termsCheckboxValues.length !== 2 ||
                    authStore.termsCheckboxValues.sort().join(",") !==
                      authStore.termsCheckboxes.sort().join(",")
                  }
                >
                  Request Access
                </Button>
              </Col>
            </Row>
          </Modal>
          <Modal
            title={
              authStore?.submissionResult.some(
                (ele) => ele.status === "ERROR"
              ) ? (
                <Row>
                  <Col span={2} offset={1}>
                    <ExclamationCircleOutlined
                      style={{ fontSize: "23px", color: "#faad14" }}
                    />
                  </Col>
                  <Col span={16} offset={0}>
                    <span>One or more requests failed</span>
                  </Col>
                </Row>
              ) : (
                <Row>
                  <Col span={2} offset={1}>
                    <CheckCircleTwoTone
                      twoToneColor="#52c41a"
                      style={{ fontSize: "23px" }}
                    />
                  </Col>
                  <Col span={8} offset={0}>
                    <span>Requests submitted</span>
                  </Col>
                </Row>
              )
            }
            closable={false}
            maskClosable={false}
            visible={authStore?.showResultModal}
            onOk={() => authStore?.handleResultModal(false)}
            onCancel={() => authStore?.handleResultModal(false)}
            footer={null}
          >
            {authStore?.submissionResult &&
            authStore.submissionResult.length > 0 ? (
              <ol>
                {authStore.submissionResult.map((result, index) => (
                  <li
                    key={index}
                    style={{
                      color: result.status === "ERROR" ? "#ff4d4f" : "black",
                      fontSize: "16px",
                    }}
                  >
                    {`${
                      authStore?.dataFiles.find(
                        (ele) => ele.id === result.datafileID
                      )?.label
                    } (${result.datafileID}): ${result.msg}`}
                  </li>
                ))}
              </ol>
            ) : null}
            <Row justify="center" style={{ paddingTop: "4vh" }}>
              <Button
                key="OK"
                type="primary"
                onClick={() => authStore?.handleResultModal(false)}
              >
                OK
              </Button>
            </Row>
          </Modal>
        </Footer>
      </Layout>
    );
  }
}
