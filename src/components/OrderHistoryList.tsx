import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { OrderListStore } from '../stores/orderListStore'
import { inject, observer } from 'mobx-react';
import { List, Avatar, Row, Col, DatePicker, Spin, Empty } from 'antd';
import OrderCard from './OrderCard'
import moment from 'moment';

const { MonthPicker, RangePicker } = DatePicker;

interface OrderListProps extends RouteComponentProps{
    orderListStore: OrderListStore
}

@inject('orderListStore')
@observer
export default class OrderHistoryList extends React.Component<OrderListProps> {
    componentDidMount(){
        //this.props.orderListStore.getHistoryOrderList(moment().format(this.props.orderListStore.dateFormat))
    }
    dateChange = (value:any) =>{
        console.log(value)
        if(value) this.props.orderListStore.updateSelectedDate(value.format(this.props.orderListStore.dateFormat))
    }
    render() {
        const orderListStore = this.props.orderListStore
        // const orderHistoryList = orderListStore.CurrentHistoryOrders
        const orderHistoryList = this.props.orderListStore.currentHistoryOrders
        const totalIncome = orderHistoryList.reduce((a, b)=> a + b.order.totalPrice, 0)

        return (
            <div style={{ background: '#FFF', padding: '20px 5%' }}>
                <Spin spinning={orderListStore.orderListLoading}>
                <Row>
                    <Col xs={24} md={3}>
                        <DatePicker allowClear={false} defaultValue={moment()} format={orderListStore.dateFormat} 
                            onChange={this.dateChange}
                        />
                    </Col>
                    <Col  xs={24} md={3}>
                        Today's Income: ${totalIncome}
                    </Col>
                </Row>
                <hr/>
                <Row gutter={[16, 32]}>
                    {
                        orderHistoryList.map((orderStore, index) => {
                            return (
                                <Col xs={24} sm={24} md={8} lg={8} xl={6} xxl={6} key={index}>
                                    <OrderCard orderStore={orderStore}  />
                                </Col>
                            )
                        })
                    }
                    
                </Row>
                <Row style={{marginTop: '5%',}}>{ orderHistoryList.length === 0 && <Empty />}</Row>
                </Spin>
            </div>
        );
    }
}