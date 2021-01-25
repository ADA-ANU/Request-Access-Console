import React from 'react';
import { inject, observer } from 'mobx-react';
import { Switch, Route, Link } from 'react-router-dom';

import { Layout, Menu, DatePicker, Alert, Spin, Modal, Row, Badge, Tooltip, Affix, Avatar, Button } from 'antd';
import moment, { Moment} from 'moment';
import { SystemStore } from '../stores/systemStore'
import { IRoutingProps} from '../props'
import Csiro from '../resource/csiro.png'
import OrderList from '../components/OrderList';
import ProductList from '../components/ProductList';
import OrderHistoryList from '../components/OrderHistoryList';
import UserProfile from './UserProfile';
import authStore, { AuthStore } from '../stores/authStore';
import printerStore, {PrinterStore} from '../stores/printerStore'
//import PrinterConfig from './PrinterConfig';
import { OrderListStore } from '../stores/orderListStore';
import CompanyOrderList from '../components/CompanyOrderList';


const { Header, Content, Footer } = Layout;
const { RangePicker } = DatePicker;

export interface IMainFrameProps extends IRoutingProps{
    systemStore?: SystemStore,
    authStore?: AuthStore,
    orderListStore?: OrderListStore
}

@inject('systemStore', 'orderListStore', 'authStore')
@observer
export default class Company extends React.Component<IMainFrameProps> {
    render(){
        let { systemStore, routingStore, orderListStore } = this.props
        
        return(
            // <Spin spinning={siteStore?siteStore.siteLoading : true} tip="Loading...">
            <Spin spinning={false} tip="Loading...">    
            <Layout style={{background: '#f0f2f5',}}>
                <Affix offsetTop={0}>
                    <Header style={{  width: '100%', height: '64px', lineHeight: '64px', background: 'white', padding: '0px'}}>
                        <Menu
                            theme="light"
                            mode="horizontal"
                            defaultOpenKeys={['/']}
                            selectedKeys={[this.props.routingStore? this.props.routingStore.location.pathname : '/']}
                            style={{ lineHeight: '64px', height: '64px',boxShadow: '0 1px 4px rgba(0,21,41,0.08' }}
                        >
                            <Menu.Item key='/'><Link to='/history'>History Orders</Link></Menu.Item>
                            <Menu.Item key='/coupone'><Link to='/coupon'>Coupon</Link></Menu.Item>
                        </Menu>
                        <div  style={{float: 'right',  marginRight: '24px', marginTop: '-62px'}}>
                            <span style={{marginRight:10}}>
                                <Tooltip placement="bottom" title="Reload App">
                                    <Button icon="reload" 
                                        onClick={()=>window.location.reload()}
                                        style={{color: '#007916', backgroundColor: '#cce4d0'}} />
                                </Tooltip>
                            </span>
                            
                            {/* <Link to="/profile">
                                <Avatar shape="square" icon="user" style={{ backgroundColor: '#cce4d0' }} />
                            </Link> */}
                            
                        </div>
                        </Header>
                    </Affix>
                    <Content>
                        <Switch>
                            <Route exact path='/' component={CompanyOrderList} />
                            {/* <Route exact path='/coupon' component={Coupon} /> */}
                            {/* <Route exact path='/history' component={OrderHistoryList} />
                            <Route exact path='/products' component={ProductList} />
                            <Route exact path='/profile' component={UserProfile} /> */}

                        </Switch>
                        <div style={{float: 'right',  marginLeft: '36px', marginRight: '48px', }}>
                    </div>
                    </Content>

                    <Footer style={{ textAlign: 'center'}}>
                        <hr/>
                        <Row>
                           
                        </Row>
                        <br/>
                        <Row>
                            © {new Date().getFullYear()} <a href="https://instasoft.com.au">Instasoft</a> | All Rights Reserved.
                        </Row>
                    </Footer>
            </Layout>
            </Spin>

        )
    }
}