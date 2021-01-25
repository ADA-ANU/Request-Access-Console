import { observable, action, computed, reaction, ObservableMap } from 'mobx';
import { OrderType, OrderStatus, DishItemType, DishItemStatus, RegisterPrinterType, KitchenPrinterType, PrintItemType, DishExtraType } from './data.d'
import API_URL from '../config'
import apiagent from './apiagent'
import authStore from './authStore'
import printerStore from './printerStore'
import orderListStore from './orderListStore'
import { message } from 'antd'

export class DishItemStore{
    @observable dishItem: DishItemType
    constructor(dishItem: any){
        this.dishItem = dishItem as DishItemType
    }
    @action updateDishItemStatus(){
        console.log(this.dishItem)
        if(this.dishItem.status===DishItemStatus.Cook){
            this.dishItem.status = DishItemStatus.Wait

        } else {
            this.dishItem.status = DishItemStatus.Cook
        }
        // console.log(this.dishItem)
    }
}

export class OrderStore{
    @observable orderLoading = false
    @observable addressLoading = false
    @observable order: OrderType
    @observable dishItems: Array<DishItemType> = []
    @observable trigger = 1;
    @observable printStatus = false // antd Message?
    @observable printMessage = ''

    constructor(order:any){
        this.order = order as OrderType
        for(const item of this.order.items){
            // this.dishItems.push(new DishItemStore(item))
            let tempItem = item as DishItemType
            //@ts-ignore
            tempItem.dishExtra = JSON.parse(item.dishExtra) as Array<DishExtraType>
            this.dishItems.push(tempItem)
        }
        order.items = this.dishItems
    }
    @action updateDishItemStatus(dishItem: DishItemType){
        for(let item of this.order.items){
            if(item.id === dishItem.id){
                if(item.status===DishItemStatus.Cook){
                    item.status = DishItemStatus.Wait
                } else {
                    item.status = DishItemStatus.Cook
                }
            }
        }
        this.trigger = this.trigger + 1
    }

    @action updateOrderStatus(status: OrderStatus){
        this.order.status = status
    }
    @action confirmOrder(){
        if(this.order.status === OrderStatus.NewOrder) {
            this.orderLoading = true
            apiagent.get(`${API_URL.UPDATE_ORDER_STATUS}/${OrderStatus.ConfirmOrder}/${this.order.id}`).then(action(res =>{
                this.order.status = OrderStatus.ConfirmOrder
            })).finally(()=>this.orderLoading = false)
        }
    }
    @action deliveryOrder(){
        if(this.order.status === OrderStatus.ConfirmOrder) {
            this.order.status = OrderStatus.Delivering
            orderListStore.putOrderToHistory(this)
        }
    }
    @action regiesterPrint(order: OrderType){
        if(printerStore.regiesterPrinter.status==='error') {
            message.error(`Printer ${printerStore.regiesterPrinter.printerName} is not connected. Please check your network and printer.`)
            return
        }
        let r = {} as RegisterPrinterType
        r.printerIP = printerStore.regiesterPrinter.printerIP
        r.printerPort = printerStore.regiesterPrinter.printerPort
        r.abn = authStore.restaurantInfo.abn
        r.restaurantName = authStore.restaurantInfo.name + ' | ' + authStore.restaurantInfo.ename
        r.restaurantphone = authStore.restaurantInfo.phone
        r.priceTotal = order.totalPrice
        r.paymentInfo = order.paymentReturn? 'Paypal Paid': 'Cash/Card, Not Paid'
        r.orderId = order.id
        r.orderTime = order.creatTime
        r.name = order.name
        r.phone = order.phone
        r.address = order.address,
        r.deliveryFee = order.deliveryFee,
        r.note = order.comment
        r.url = authStore.restaurantInfo.url
        r.items = []
        for(let ele of order.items){
            let item = {} as PrintItemType
            item.name = ele.name,
            item.count = ele.dishCount
            item.price = ele.price
            item.dishExtra = ele.dishExtra
            r.items.push(item)
        }
        fetch(`${API_URL.DEFAULT_PRINT_SERVICE}/regiester`, {
            method: 'POST',                    
            mode: 'cors', // no-cors, *cors, same-origin
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(r)
        }).then(action(res=>{
            //@ts-ignore
            if(res.status === 200) {
                message.success(`${printerStore.regiesterPrinter.printerName} printing finished successfully. `)
                this.updateRegisterPrint(order.id)
            }
            else {
                //set error to system store
                message.error('Print Error, please check your network and refresh ...');
            }
        }))

    }
    @action kitchenPrint(order: OrderType){
        let splitMap = new Map<number, Array<DishItemType>>()
        for(let ele of order.items){
            let dishItems = splitMap.get(ele.printer)
            if(dishItems !== undefined) {
                splitMap.set(ele.printer, dishItems.concat(ele))
            }else{
                splitMap.set(ele.printer, [ele])
            }
        }
        for(let [printerId, dishItems] of splitMap){
            let p = {} as KitchenPrinterType
            p.orderId = order.id
            p.items = []
            for(let ele of dishItems){
                let item = {} as PrintItemType
                item.name = ele.name,
                item.count = ele.dishCount
                item.price = ele.price
                item.dishExtra = ele.dishExtra
                p.items.push(item)
            }
            let printer = printerStore.kitchenPrinter.get(printerId)
            if(printer !== undefined){
                if(printer.status==='error') {
                    message.error(`Printer ${printer.printerName} is not connected. Please check your network and printer.`)
                    return
                }
                p.printerIP = printer.printerIP
                p.printerPort = printer.printerPort
                fetch(`${API_URL.DEFAULT_PRINT_SERVICE}/kitchen`, {
                    method: 'POST',
                    mode: 'cors', // no-cors, *cors, same-origin
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(p)
                }).then(action(res=>{
                    //@ts-ignore
                    if(res.status === 200) {
                        message.success(`${printer!.printerName} printing finished successfully. `)
                        this.updateKitchenPrint(order.id)
                    }else {
                        //set error to system store
                        message.error('Print Error, please check your network and refresh ...');
                    }
                }))
            }else{
                // Notify no printer find
                message.error(`No printer find for given printer Id: ${printerId}`);
            }
        }
    }
    updateRegisterPrint(orderId: number){
        apiagent.get(`${API_URL.UPDATE_REGISTER_PRINT}/${orderId}`).then(res=>{
            this.order.registerPrint = true
            this.trigger = Math.random()
        })
    }
    updateKitchenPrint(orderId: number){
        apiagent.get(`${API_URL.UPDATE_KITCHEN_PRINT}/${orderId}`).then(res=>{
            this.order.kitchenPrint = true
            this.trigger = Math.random()
        })
    }
}