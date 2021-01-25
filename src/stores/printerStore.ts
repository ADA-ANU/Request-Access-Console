
import { observable, action, computed, reaction } from 'mobx';
import API_URL from '../config'
import apiagent from './apiagent'
import systemStore from './systemStore'
import authStore from './authStore'
import { PrinterType } from './data';

export class PrinterStore {
    // @observable token = window.localStorage.getItem('jwt');
    @observable isLoading: boolean = false
    @observable regiesterPrinter: PrinterType = {} as PrinterType
    @observable kitchenPrinter: Map<number, PrinterType> = observable.map()
    @observable tempPrinter: PrinterType = {} as PrinterType
    @observable modelVisible: boolean = false
    @observable modelTitle: string = ''

    @action addPrinter(){
        this.modelTitle = "Add Printer"
        this.tempPrinter = {} as PrinterType
        this.tempPrinter.restaurantId = authStore.adminAccount.restaurantId
        this.modelVisible = true
    }
    @action editPrinter(printer: PrinterType){
        this.modelTitle = 'Edit Printer'
        this.tempPrinter = printer
        this.modelVisible = true

    }
    @action savePrinter(printer: PrinterType){
        this.modelVisible = false
        this.tempPrinter.printerIP = printer.printerIP
        this.tempPrinter.printerName = printer.printerName
        this.tempPrinter.printerPort = printer.printerPort
        this.tempPrinter.printerStandard = printer.printerStandard
        this.tempPrinter.printerType = printer.printerType
        delete this.tempPrinter.status
        console.log(this.tempPrinter)
        this.updatePrinter(this.tempPrinter)
    }
    @action cancelSave(){
        this.modelVisible = false
    }

    @action changePrinterInfo(key: string, value: string|number){
        //@ts-ignore
        this.tempPrinter[key] = value
    }

    @action getPrinters(restaurantId: number) {
        this.isLoading = true;
        apiagent.get(`${API_URL.GET_PRINTERS}/${restaurantId}`).then(action(json => {
            //@ts-ignore
            json.map(ele=>{
                let p = ele as PrinterType
                p.status='error'
                if(p.printerType==='regiester') this.regiesterPrinter = p
                else this.kitchenPrinter.set(p.printerId, p)

                this.getPrinterStatus(p)
            })
        })).finally(action(() => { this.isLoading = false }))
    }

    @action updatePrinter(printer: PrinterType){
        this.isLoading = true
        let tempPrinter = JSON.parse(JSON.stringify(printer))
        apiagent.post(`${API_URL.UPDATE_PRINTER}`, tempPrinter).then(action(info=>{
            console.log(info)
            if(printer.printerType==='regiester') this.regiesterPrinter = printer
            else this.kitchenPrinter.set(printer.printerId, printer)
            this.getPrinterStatus(printer)
        })).finally(()=>this.isLoading=false)
    }
    @action getPrinterStatus(printer: PrinterType){
        fetch(`${API_URL.PRINTER_STATUS}`, {
            method: 'POST',
            mode: 'cors', // no-cors, *cors, same-origin
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(printer)
        }).then(res=>res.json()).then(action(json=>{
                //@ts-ignore
            if(json.printerType === 'regiester'){
                //@ts-ignore
                this.regiesterPrinter = json as PrinterType
            }else{
                // console.log(json)
                //@ts-ignore
                this.kitchenPrinter.set(json.printerId, json as PrinterType)
            }
        }))
    }
}

export default new PrinterStore();
