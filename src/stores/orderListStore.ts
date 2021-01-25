import { observable, action } from 'mobx';
import { OrderType, OrderStatus } from './data.d'
import API_URL from '../config'
import apiagent from './apiagent'
import authStore from './authStore'
import { OrderStore } from './orderStore'
import moment from 'moment';

export class OrderListStore{
    @observable orderListLoading = false
    @observable orderList: Array<OrderStore> = []
    @observable currentCompanyHistoryOrders: Array<OrderType> = []
    @observable currentHistoryOrders: Array<OrderStore> = []
    @observable playSound = 'STOPPED'
    dateFormat = 'YYYY-MM-DD'
    @observable selectedDate: string = moment().format(this.dateFormat)


    @action updateSelectedDate(selectedDate: string){
        this.selectedDate = selectedDate
        this.getHistoryOrderList(this.selectedDate)
    }
    @action resetPlaySound(){
        this.playSound = 'STOPPED'
    }

    @action getActiveOrderList(restaurantId: number){
        this.orderListLoading = true
        return apiagent.get(`${API_URL.ACTIVE_ORDER_LIST}/${restaurantId}`).then(action(orders=>{
            //@ts-ignore
            orders.map(order=>this.orderList.push(new OrderStore(order)))
            // this.playSound = "PLAYING"

        })).finally(()=>this.orderListLoading=false)
    }
    @action putOrderToHistory(order: OrderStore){
        const index = this.orderList.findIndex(ele => ele.order.id === order.order.id)
        order.orderLoading = true
        apiagent.get(`${API_URL.UPDATE_ORDER_STATUS}/${OrderStatus.Delivering}/${order.order.id}`).then(action(res =>{
            const removed = this.orderList.splice(index, 1)[0]
        })).finally(()=>order.orderLoading = false)

    }
    @action getHistoryOrderList(selectedDate: string){
        // this.orderListLoading = true
        const restaurantId = authStore.adminAccount.restaurantId
        return apiagent.get(`${API_URL.HISTORY_ORDER_LIST}/${restaurantId}/${selectedDate}`).then(action(orders=>{
            //@ts-ignore
            const historyOrders = orders.map(order=> new OrderStore(order))
            this.currentHistoryOrders = historyOrders
        }))
    }
    @action getOrderByOrderId(orderId: string){
        let orderExists = false
        for(let order of this.orderList){
            if(''+order.order.id == orderId){
                orderExists = true
                order.order.status = OrderStatus.NewOrder
                this.playSound = "PLAYING"
                return
            }
        }
        if(!orderExists){
            apiagent.get(`${API_URL.GET_ORDER_BY_ORDER_ID}/${orderId}`).then(action(res =>{
                let newOrder = new OrderStore(res)
                this.orderList.splice(0, 0, newOrder)
                //Play notify sound
                this.playSound = "PLAYING"
                if(authStore.restaurantInfo.printMode==='auto'){
                    newOrder.kitchenPrint(newOrder.order)
                    newOrder.regiesterPrint(newOrder.order)
                }
            }))
        }
    }
    @action getCompanyHistoryOrders(selectedDate: string){
        const companyId = authStore.adminAccount.companyId
        return apiagent.get(`${API_URL.COMPANY_HISTORY_ORDER_LIST}/${companyId}/${selectedDate}`).then(action(orders=>{
            this.currentCompanyHistoryOrders = orders as Array<OrderType>
        }))
    }

    @action deleteOrder(orderId: number){
        this.orderListLoading = true
        apiagent.get(`${API_URL.DELETE_ORDER}/${orderId}`).then(action(res=>{
            let tmpOrderList = []
            for(let order of this.orderList){
                if(order.order.id !== orderId){
                    tmpOrderList.push(order)
                }
            }
            this.orderList = tmpOrderList
        })).finally(action(()=>this.orderListLoading=false))
    }
}
export default new OrderListStore()
