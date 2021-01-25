import React from 'react';
import { inject, observer } from 'mobx-react';
import MainFrame from './pages/MainFrame'
import 'antd/dist/antd.less'
import './App.css';
import { AuthStore } from './stores/authStore';
import Login from './pages/Login';
import Company from './pages/Company'
import { OrderListStore } from './stores/orderListStore';

interface AppProps {
  authStore?: AuthStore
  orderListStore?: OrderListStore
}

@inject('authStore', 'orderListStore')
@observer
export default class App extends React.Component<AppProps> {
  render(){
    // console.log(this.props.authStore!.adminAccount)
    // const admin = this.props.authStore!.adminAccount
    return <MainFrame />
  }
}

