import React from "react";
import { inject, observer } from "mobx-react";
import MainFrame from "./pages/MainFrame";
import "antd/dist/antd.less";
import "./App.css";
import { AuthStore } from "./stores/authStore";
import { Switch, Route, withRouter, Link } from "react-router-dom";
import unauthorised from "./components/unauthorised";
interface AppProps {
  authStore?: AuthStore;
}

@inject("authStore")
@observer
export default class App extends React.Component<AppProps> {
  render() {
    // console.log(this.props.authStore!.adminAccount)
    // const admin = this.props.authStore!.adminAccount
    return (
      <Switch>
        <Route exact path="/unauthorised" component={unauthorised} />
        <Route component={MainFrame} />
      </Switch>
    );
  }
}
