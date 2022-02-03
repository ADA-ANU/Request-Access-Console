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
  Anchor,
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
import { EmailNotification } from "../components/emailNotification";
import DataFile from "../components/dataFile";
import SiblingDatasets from "../components/siblingDatasets";
import "../App.css";
import { datafile } from "../stores/data";
const { Title, Text, Paragraph } = Typography;
const { Header, Content, Footer } = Layout;
const CheckboxGroup = Checkbox.Group;
//const { Link as AnchorLink } = Anchor;

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
    console.log(pathname?.split("/")[1]);
    const param = pathname?.split("/")[1];
    //console.log(param);
    if (!param || param === "") {
      this.props.authStore?.unauthorised(
        `Please access this application through https://dataverse.ada.edu.au`
      );
    } else if (param !== "warning") {
      this.props.authStore?.init(param);
    }
    const notification = localStorage.getItem("ADA_Request_Access");
    if (
      notification &&
      typeof JSON.parse(notification).notification === "boolean"
    ) {
      this.props.authStore?.emailNotificationOnChangeWithoutLocalStorage(
        JSON.parse(notification).notification
      );
    }
  }
  handleAnchorClick = (e: any) => {
    e.preventDefault();
  };
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

  findDatafile = (datafileID: number) => {
    const datafile_originalRequest = this.props.authStore?.dataFiles.find(
      (ele) => ele.id === datafileID
    );
    if (datafile_originalRequest) return datafile_originalRequest.label;

    const datafile_sibling = this.props.authStore?.siblingDatasets.reduce(
      (prev, dataset) =>
        // @ts-ignore
        prev || dataset.datafiles.find((df) => df.id === datafileID),
      undefined
    );
    // @ts-ignore
    if (datafile_sibling) return datafile_sibling.label;
    return "Not found";
  };

  urlify = (text: string) => {
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    if (!text) return "";
    const url = text.match(urlRegex) ? text.match(urlRegex)![0] : undefined;
    console.log(130, text.match(urlRegex), url);
    if (url) {
      const textWithoutURL = text.replace(urlRegex, (url) => "");
      return (
        <div>
          {textWithoutURL} <a href={url}>{url}</a>
        </div>
      );
    } else return text;
    // return text.replace(urlRegex, function (url: string) {
    //   return `<a href="' + url + '">' + {url} + "</a>`;
    // });
    // or alternatively
    // return text.replace(urlRegex, '<a href="$1">$1</a>')
  };

  handleSubmit = () => {
    const values = authStore?.customquestionFormRef.current?.getFieldsValue();
    console.log("Received values of form: ", values);

    this.props.authStore?.submit(values);
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
      <Layout style={{ background: "#f8f7fa" }}>
        <Affix offsetTop={0}>
          <Header
            style={{
              background: "#ffffff",
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
                  style={{ width: "18vw" }}
                  src={ADAlogo}
                />
                {/*cursor:'pointer' onClick={()=>{history.push('/dashboard/adapt2-new')}}*/}
              </Col>
              <Col
                xs={{ span: 13, offset: 0 }}
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
                    //paddingTop: "1%",
                  }}
                >
                  <span
                    style={{
                      verticalAlign: "middle",
                      display: "inline-block",
                      fontSize: "1.7vw",
                    }}
                  >
                    REQUEST ACCESS MANAGEMENT SYSTEM
                  </span>
                </div>
              </Col>
              <Col
                xs={{ span: 6, offset: 0 }}
                sm={{ span: 6, offset: 0 }}
                md={{ span: 5, offset: 1 }}
                lg={{ span: 4, offset: 2 }}
                xl={{ span: 4, offset: 2 }}
                xxl={{ span: 4, offset: 2 }}
              >
                <Row style={{ display: "flex" }}>
                  <Col
                    xs={{ span: 9, offset: 0 }}
                    sm={{ span: 5, offset: 0 }}
                    md={{ span: 6, offset: 0 }}
                    lg={{ span: 6, offset: 0 }}
                    xl={{ span: 5, offset: 0 }}
                    xxl={{ span: 4, offset: 3 }}
                  >
                    <div style={{ textAlign: "center" }}>
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
                    xs={{ span: 15, offset: 0 }}
                    sm={{ span: 19, offset: 0 }}
                    md={{ span: 18, offset: 0 }}
                    lg={{ span: 18, offset: 0 }}
                    xl={{ span: 18, offset: 0 }}
                    xxl={{ span: 16, offset: 0 }}
                  >
                    <div
                      style={{
                        paddingLeft: "5px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        //height: "50px",
                        width: "90%",
                      }}
                    >
                      {authStore?.userFirstName && authStore.userLastName
                        ? `${authStore.userFirstName} ${authStore.userLastName}`
                        : "Guest"}
                    </div>
                  </Col>
                </Row>
              </Col>
              {/* <Col
                xs={{ span: 0, offset: 0 }}
                sm={{ span: 4, offset: 0 }}
                md={{ span: 4, offset: 0 }}
                lg={{ span: 3, offset: 0 }}
                xl={{ span: 3, offset: 0 }}
                xxl={{ span: 2, offset: 0 }}
              >
                
              </Col> */}
            </Row>
          </Header>
        </Affix>
        <Content
          style={{
            //padding: "1%",

            marginBottom: "6vh",
            backgroundColor: "#f8f7fa",
          }}
        >
          {authStore?.authenticated ? (
            this.props.authStore?.isLoading ? (
              <div style={{ width: "70%", margin: "auto" }}>
                <Skeleton active title={true} paragraph={{ rows: 20 }} />
              </div>
            ) : (
              <>
                <Row>
                  <Col xs={1} sm={1} md={4} lg={3} xl={4} xxl={6}>
                    <Anchor
                      onClick={this.handleAnchorClick}
                      offsetTop={150}
                      style={{ paddingLeft: "1vw" }}
                      className="hidden-xs hidden-sm"
                    >
                      <Anchor.Link href="#guestbook" title="Guestbook" />
                      <Anchor.Link href="#datasetFiles" title="Datafiles" />
                      <Anchor.Link
                        href="#siblingDatasets"
                        title="Sibling Datasets"
                      />
                      {!authStore.submitted && (
                        <Anchor.Link href="#submit" title="Save/Submit" />
                      )}
                    </Anchor>
                  </Col>
                  <Col xs={22} sm={22} md={16} lg={18} xl={16} xxl={12}>
                    <div
                      style={{
                        borderRadius: "20px",
                        backgroundColor: "#ffffff",
                        marginTop: "5vh",
                        //width: "100%",
                        boxShadow: "0 16px 64px -16px rgb(46 55 77 / 8%)",
                      }}
                    >
                      <div
                        style={{
                          paddingTop: "3vh",
                          paddingBottom: "3vh",
                          textAlign: "center",
                        }}
                      >
                        <Title level={3}>
                          Dataset: {authStore.datasetTitle}
                        </Title>
                        <Row justify="center" align="middle">
                          <Col>
                            <Title level={4}>Link:</Title>
                          </Col>
                          <Col
                            style={{ marginLeft: "1vw", marginBottom: "10px" }}
                          >
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
                              <Title level={4}>
                                This form has been submitted.
                              </Title>
                            </Col>
                          </Row>
                        </div>
                      ) : null}
                      <RequestAccessForm
                        uploadQIDwithError={uploadQIDwithError}
                      />
                    </div>
                  </Col>
                  <Col xs={1} sm={1} md={4} lg={3} xl={4} xxl={6} />
                </Row>
                <Row>
                  <Col xs={1} sm={1} md={4} lg={3} xl={4} xxl={6} />
                  <Col xs={22} sm={22} md={16} lg={18} xl={16} xxl={12}>
                    <div
                      style={{
                        borderRadius: "20px",
                        backgroundColor: "#ffffff",
                        marginTop: "5vh",
                        //width: "100%",
                        boxShadow: "0 16px 64px -16px rgb(46 55 77 / 8%)",
                      }}
                    >
                      {authStore?.dataFiles && <DataFile />}
                    </div>
                  </Col>
                  <Col xs={1} sm={1} md={4} lg={3} xl={4} xxl={6} />
                </Row>
                <Row>
                  <Col xs={1} sm={1} md={4} lg={3} xl={4} xxl={6} />
                  <Col xs={22} sm={22} md={16} lg={18} xl={16} xxl={12}>
                    <div
                      style={{
                        borderRadius: "20px",
                        backgroundColor: "#ffffff",
                        marginTop: "5vh",
                        //width: "100%",
                        boxShadow: "0 16px 64px -16px rgb(46 55 77 / 8%)",
                      }}
                    >
                      {authStore?.dataFiles && <SiblingDatasets />}
                    </div>
                  </Col>
                  <Col xs={1} sm={1} md={4} lg={3} xl={4} xxl={6} />
                </Row>
                <Row>
                  <Col xs={1} sm={1} md={4} lg={3} xl={4} xxl={6} />
                  <Col xs={22} sm={22} md={16} lg={18} xl={16} xxl={12}>
                    {!authStore.submitted ? (
                      <div
                        id="submit"
                        style={{
                          textAlign: "center",
                          paddingTop: "5vh",
                          paddingBottom: "4vh",
                        }}
                      >
                        <Row>
                          <Col
                            xs={{ span: 8, offset: 0 }}
                            sm={{ span: 8, offset: 0 }}
                            md={{ span: 7, offset: 1 }}
                            lg={{ span: 6, offset: 2 }}
                            xl={{ span: 5, offset: 4 }}
                            xxl={{ span: 7, offset: 2 }}
                          >
                            <EmailNotification
                              disabled={authStore.submitted}
                              checked={authStore.emailNotification}
                              check={authStore.emailNotificationOnChange}
                            />
                          </Col>

                          <Col
                            xs={{ span: 3, offset: 0 }}
                            sm={{ span: 3, offset: 0 }}
                            md={{ span: 3, offset: 0 }}
                            lg={{ span: 2, offset: 0 }}
                            xl={{ span: 2, offset: 0 }}
                            xxl={{ span: 1, offset: 0 }}
                          >
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

                          <Col
                            xs={{ span: 4, offset: 2 }}
                            sm={{ span: 4, offset: 2 }}
                            md={{ span: 5, offset: 2 }}
                            lg={{ span: 3, offset: 2 }}
                            xl={{ span: 2, offset: 2 }}
                            xxl={{ span: 2, offset: 3 }}
                          >
                            <div>
                              <Button
                                form="requestAccess"
                                key="submit"
                                htmlType="submit"
                                type="primary"
                                icon={<PoweroffOutlined />}
                                loading={authStore.submitting}
                                disabled={
                                  authStore.submitted ||
                                  authStore?.checkedDataFiles.size === 0
                                }
                                onClick={() => this.submissionCheck()}
                              >
                                Submit!
                              </Button>
                            </div>
                          </Col>
                          <Col span={3}>
                            {/* {authStore?.validationError && (
                              <Text type="danger" strong>
                                You must answer all questions unless they are
                                marked optional.
                              </Text>
                            )} */}
                          </Col>
                        </Row>
                      </div>
                    ) : null}
                  </Col>
                  <Col xs={1} sm={1} md={4} lg={3} xl={4} xxl={6} />
                </Row>
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
              <Title level={3}>{this.urlify(authStore?.errorMsg!)}</Title>
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
          <Row justify="center" style={{ paddingTop: "2vh" }}>
            <img
              className="logo"
              style={{
                height: "32px",
                //width: "195px",
                //lineHeight: "76px",
                marginTop: "10px",
              }}
              src={ADAlogo}
            />
            <img
              className="logo"
              style={{
                height: "45px",
                //lineHeight: "96px"
              }}
              src={Vertical_line}
            />
            <img
              className="logo"
              style={{
                height: "32px",
                //lineHeight: "76px",
                marginTop: "10px",
              }}
              src={ANUlogo}
            />
            <img
              className="logo"
              style={{
                height: "45px",
                //, lineHeight: "76px"
              }}
              src={Vertical_line}
            />
            <img
              className="logo"
              style={{
                height: "32px",
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
                  //htmlType="submit"
                  type="primary"
                  loading={authStore?.submitting}
                  onClick={this.handleSubmit}
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
              authStore?.hasError ? (
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
            {authStore?.submissionResult?.data && (
              <div>
                {authStore.submissionResult.data.map((result, index) => (
                  <>
                    <Text strong style={{ paddingLeft: "22px" }}>
                      {result.datasetTitle}
                    </Text>
                    <Text strong style={{ paddingLeft: "22px" }}>
                      Ticket Number: {result.ticketID}
                    </Text>
                    <ol style={{ marginTop: "2vh" }}>
                      {result.result.map((file: any, index: number) => (
                        <li
                          key={index}
                          style={{
                            color:
                              file.status === "ERROR" ? "#ff4d4f" : "black",
                            fontSize: "16px",
                          }}
                        >
                          {`${file.msg}`}
                        </li>
                      ))}
                    </ol>
                  </>
                ))}
              </div>
            )}
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
