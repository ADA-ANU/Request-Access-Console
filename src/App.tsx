import React from "react";
import { inject, observer } from "mobx-react";
import MainFrame from "./pages/MainFrame";
import "antd/dist/antd.less";
import "./App.css";
import { AuthStore } from "./stores/authStore";

interface AppProps {
  authStore?: AuthStore;
}

@inject("authStore")
@observer
export default class App extends React.Component<AppProps> {
  render() {
    // console.log(this.props.authStore!.adminAccount)
    // const admin = this.props.authStore!.adminAccount
    return <MainFrame />;
  }
}
