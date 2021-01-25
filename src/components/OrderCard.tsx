import React from 'react';
import { observer, inject } from 'mobx-react';
import { OrderListStore } from '../stores/orderListStore'
import { OrderStore } from  '../stores/orderStore'
import { Card, Button, Popover, List, Statistic, Row, Col, Spin} from 'antd';
import { OrderStatus, DishItemStatus } from '../stores/data.d';
import NewIcon from '../resource/new-icon-2.png'
import moment from 'moment-timezone'
import Item from 'antd/lib/list/Item';
import authStore from '../stores/authStore';

interface OrderProps{
    orderStore: OrderStore,
    orderListStore?: OrderListStore
}
@inject('orderListStore')
@observer
export default class OrderCard extends React.Component<OrderProps> {
    render() {
        const orderStore = this.props.orderStore
        const orderListStore = this.props.orderListStore
        const order = orderStore.order
        const dishItems = order.items
        const trigger = orderStore.trigger
        return (
            <Spin spinning={orderStore.orderLoading } >
            <Card title={<b> {`No. ${order.id} `} {order.status === OrderStatus.NewOrder? <img style={{height: 30, width: 30}} src={NewIcon} />:''}</b>}
                extra={
                    <Popover placement="bottomLeft" content={<div><li><a href='#' onClick={()=>orderListStore!.deleteOrder(order.id)}>Delete Order</a></li></div>} trigger="click">
                        <a href='#'>...</a>
                    </Popover>} 
                actions={[
                    // 
                    <Button block size="large" 
                        onClick={()=> orderStore.confirmOrder()}
                        type={order.status === OrderStatus.NewOrder ? 'link': 'primary'}>
                            {/* <Icon type="check" key="Confirm" /> */}
                            Confirm
                    </Button>,
                    <Button block size="large" 
                        onClick={()=>orderStore.deliveryOrder()}
                        type={order.status === OrderStatus.Delivering ? 'primary': 'link'}>
                            {/* <Icon type="car" key="Delivery" /> */}
                            Delivery
                    </Button>,
                    ]}
                    bodyStyle={{height: `calc(100% - 65px)`}}
                    // headStyle={{backgroundColor: '#cce4d0' }}
                    headStyle={{backgroundColor: `${order.status === OrderStatus.NewOrder? '#FF6666': '#cce4d0'}` }}
                    style={{height: `calc(100% - 65px)`}}            >
                <Row>
                    {moment.utc(order.creatTime).tz('Australia/Sydney').format(' hh:mm a, YYYY-MM-DD')}
                </Row>
                <hr />
                    <List
                        size='small'
                        dataSource={dishItems}
                        renderItem={item =>
                            <List.Item 
                                style={{backgroundColor: `${item.status === DishItemStatus.Cook? '#cce4d0': ''}`}}
                                actions={[<a>${Math.round(item.price*item.dishCount*100)/100.0}</a>, <Button type="default" shape="round" icon="fire" size='small' onClick={()=>orderStore.updateDishItemStatus(item)} />]}
                                > 
                                <div>
                                {`${item.name} x ${item.dishCount}` }
                                { item.dishExtra && item.dishExtra.map((extra, index) =>{
                                    return <li style={{color: 'gray', paddingLeft: 5}} key={index}>{` - ${extra.name} x ${extra.num}`} <span style={{marginLeft: 10}}>{`A$${extra.price}`}</span></li>
                                })}
                                </div>
                            </List.Item>
                        }
                    
                    ></List>
                    {
                        order.comment && order.comment !=='Null' && 
                        <>  <hr/>
                            <Row><b>Note: <i>{order.comment}</i></b></Row>
                        </>
                    }
                    <hr />
                    <Row><b>Delivery:</b></Row>
                    {
                        order.phone || order.address ? 
                            <Row>
                                <Col span={8}>
                                    <Statistic title={''} value={order.name} groupSeparator=''  valueStyle={{fontSize: 14, color: '#4c4c4c'}}></Statistic>
                                </Col>
                                <Col span={12}>
                                    <Statistic title={''} value={order.phone} groupSeparator='' valueStyle={{fontSize: 14, color: '#4c4c4c'}}></Statistic>
                                </Col>
                                <Col span={4}>
                                    <Statistic title={''} value={`\$${order.deliveryFee}`} valueStyle={{fontSize: 14, color: '#4c4c4c'}}></Statistic>
                                </Col>
                                <Col span={24}>
                                    <Statistic title={''} value={order.address} valueStyle={{fontSize: 14, color: '#4c4c4c'}}></Statistic>
                                </Col>
                            </Row>
                            
                        : ' No delivery address and phone number provided'
                    }
                    <hr/>
                    <Row style={{float: 'right'}}>
                        <Col>
                            <Statistic title={'TOTAL'} value={`\$${Math.round(order.totalPrice*100)/100.0||0}`}></Statistic>
                        </Col>
                        <Col>
                            {order.paymentReturn? 'Paypal Paid': 'Cash/Card, Not Paid'}
                        </Col>
                    </Row>
                    <Row gutter={[32,32]} style={{marginTop: 'auto'}}>
                        { authStore.restaurantInfo.regiesterPrinter && <Col span={12} >
                            <Button onClick={()=>orderStore.regiesterPrint(order)} >Register Print</Button>
                        </Col>
                        }
                        { authStore.restaurantInfo.kitchenPrinter && <Col span={12} >
                            <Button onClick={()=>orderStore.kitchenPrint(order)} >Kitchen Print</Button>
                        </Col>
                        }
                    </Row>
            </Card>
            </Spin>
        );
      }
}