import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { OrderListStore } from '../stores/orderListStore'
import { inject, observer } from 'mobx-react';
import { Table, DatePicker, Row, Col, Spin } from 'antd';
import OrderCard from './OrderCard'
import moment from 'moment'

interface CompanyOrderListProps extends RouteComponentProps{
    orderListStore: OrderListStore
}

const columns = [
    {
      title: 'Order Id',
      dataIndex: 'id',
    //   sorter: {
    //         compare: (a: number, b: number) => a - b
    //     },
    },
    {
        title: 'Restaurant Id',
        dataIndex: 'restaurantId',
        // sorter: {
        //     compare: (a: number, b: number) => a - b
        // },
    },
    {
        title: 'Date Time',
        dataIndex: 'createTime',
    },
    {
        title: 'Status',
        dataIndex: 'status',
    },
    {
        title: 'Charge',
        dataIndex: 'totalPrice',
        // sorter: {
        //     compare: (a: number, b: number) => a - b
        // },
    }
  ];

@inject('orderListStore')
@observer
export default class CompanyOrderList extends React.Component<CompanyOrderListProps> {
    componentDidMount(){
        this.props.orderListStore.getCompanyHistoryOrders(moment().format(this.props.orderListStore.dateFormat))
    }
    dateChange = (value:any) =>{
        console.log(value)
        if(value) this.props.orderListStore.updateSelectedDate(value.format(this.props.orderListStore.dateFormat))
    }
    render() {
        const orderListStore = this.props.orderListStore
        const orderList = orderListStore.currentCompanyHistoryOrders
        const totalIncome = orderList.reduce((a, b)=> a + b.totalPrice, 0)
        return (
            <div style={{ background: '#FFF', padding: '20px 5%' }}>
                <Spin spinning={this.props.orderListStore.orderListLoading}>
                <Row justify="space-between">
                    <Col xs={24} md={12}>
                        <DatePicker allowClear={false} defaultValue={moment()} format={orderListStore.dateFormat} 
                            onChange={this.dateChange}
                        />
                    </Col>
                    <Col  xs={24} md={12}>
                        Total Income: ${totalIncome}
                    </Col>
                </Row>
                <hr/>
                <Table 
                    columns={columns} 
                    dataSource={orderList} 
                />
                </Spin>

            </div>
        );
    }
}