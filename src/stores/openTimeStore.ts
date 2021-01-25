import { observable, action, computed, reaction } from 'mobx';
import API_URL from '../config'
import apiagent from './apiagent'
import {message} from 'antd'
import authStore from './authStore'
import { OpenDayType } from './data';
const show =''
const hide = 'none'

export class OpenTimeStore {
    @observable isLoading: boolean = false
    @observable openTimeEdit: boolean = false
    @observable openDayList: Array<OpenDayType> = []
    @observable description : any[] = []

    @action getOpenTime(restaurantId: number){
        this.isLoading = true;
        this.openDayList =[]
        apiagent.get(`${API_URL.GET_OPEN_TIME}/${restaurantId}`).then(action(json => {
            //@ts-ignore
            json.map(ele=>this.openDayList.push(ele))
        })).then(()=>{ this.description =  this.openDayList}).finally(action(() => { this.isLoading = false }))
    }
    
    @action syncOpenTime(opentime : OpenDayType){
        apiagent.post(`${API_URL.UPDATE_OPEN_TIME}`, opentime)
        .catch(err=>console.log('syncOpenTime Error: ',err))
    }

    @action saveOpenTime(tempDay : OpenDayType, key:string, time:string){
        let openTime  = tempDay
        let Time = time
        if(key == 'open' || 'morningClose'||'afternoonClose'){
            if(key==='open'){
                // @ts-ignore
            Time = !tempDay.open
            }
            if(key==='morningClose'){
                // @ts-ignore
            Time = ! !!+tempDay.morningClose
            }
            if(key==='afternoonClose'){
                // @ts-ignore
            Time = ! !!+tempDay.afternoonClose
            }
        }
        this.openDayList.map(e=>{if(e.restaurantId===openTime.restaurantId && e.openDay===openTime.openDay){
            // @ts-ignore
            e[key] =  Time
        }})
    }

    @action submit (){
        const openTime = this.openDayList
        let promise = openTime.map(ele=>{
            this.syncOpenTime(ele)
        })
        Promise.all(promise).then(()=>{
            this.getOpenTime(authStore.adminAccount.restaurantId)
            message.success('Open Time updated!')
        })
        this.openTimeEditing()
    }

    @action openTimeEditing() {
        const edit = this.openTimeEdit
        this.openTimeEdit = !edit
    }

    @action openTimeDescription(day: OpenDayType){
        const openDay  = day
        let AMdescription = ''
        let PMdescription = ''
        let description =''
        if(!!+openDay.open != true){
            description = 'Close'
        }
        else{
            if(!!+openDay.morningClose ==true){
                AMdescription = 'Morning Close'
            }
            else{
                AMdescription = 'Morning: ' + openDay.morningStart + ' - '+openDay.morningEnd                                          
            }
            if(!!+openDay.afternoonClose ==true){
                PMdescription = 'Afternoon Close'
            }
            else{
                PMdescription = 'Afternoon: ' + openDay.afternoonStart + ' - '+openDay.afternoonEnd                                          
            }
        description = AMdescription + ' , ' +PMdescription
        }
        return description
    }
}

export default new OpenTimeStore();