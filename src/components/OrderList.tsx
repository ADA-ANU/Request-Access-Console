import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { OrderListStore } from '../stores/orderListStore'
import { inject, observer } from 'mobx-react';
import { List, Avatar, Row, Col, Spin } from 'antd';
import OrderCard from './OrderCard'
import '../index.css'

interface OrderListProps extends RouteComponentProps{
    orderListStore: OrderListStore
}

@inject('orderListStore')
@observer
export default class OrderList extends React.Component<OrderListProps> {
    render() {
        const orderListStore = this.props.orderListStore
        const orderList = orderListStore.orderList

        return (
            <div style={{ background: '#FFF', padding: '20px 5%' }}>
                <Spin spinning={this.props.orderListStore.orderListLoading}>
                    <Row gutter={[16, 32]} style={{minHeight:300}}>
                        {
                            orderList.map((orderStore, index) => {
                                return (
                                    <Col xs={24} sm={24} md={8} lg={8} xl={6} xxl={6} key={index}>
                                        <OrderCard orderStore={orderStore} />
                                        <div className="print-card"></div>
                                    </Col>
                                )
                            })
                        }

                    </Row>
                </Spin>

            </div>
        );
    }
}