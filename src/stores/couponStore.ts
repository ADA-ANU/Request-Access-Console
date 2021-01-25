
import { observable, action, computed, reaction } from 'mobx';
import API_URL from '../config'
import apiagent from './apiagent'
import authStore from './authStore'
import { CouponType, CouponRuleType } from './data';

export class CouponStore {
    @observable isLoading: boolean = false
    @observable couponList: Map<number, CouponType> = observable.map()
    @observable tempCoupon: CouponType = {} as CouponType
    @observable couponRule: CouponRuleType = {} as CouponRuleType
    @observable modelVisible: boolean = false
    @observable ruleModelVisible: boolean = false

    @computed get CouponList(){
        return [...this.couponList.values()]
    }
    @action addCoupon(){
        this.tempCoupon = {} as CouponType
        this.tempCoupon.companyId = authStore.adminAccount.companyId
        this.modelVisible = true
    }
    @action updateCoupon(coupon: any){
        this.tempCoupon = coupon as CouponType
        this.modelVisible = true
    }
    @action saveCoupon(values: CouponType){
        this.tempCoupon.coupon = values.coupon
        // @ts-ignore
        this.tempCoupon.expireDate = values.expireDate.format()
        this.tempCoupon.limit = values.limit||1
        this.tempCoupon.type = values.type
        this.tempCoupon.valid = values.valid || true
        this.tempCoupon.value = values.value
        this.tempCoupon.condition = values.condition
        this.tempCoupon.accumulate = values.accumulate
        this.syncConpon(this.tempCoupon)
        this.modelVisible = false

    }
    @action cancelSave(){
        this.modelVisible = false
    }

    @action addCouponRule(){
        this.couponRule = {} as CouponRuleType
        this.couponRule.companyId = authStore.adminAccount.companyId
        this.ruleModelVisible = true
    }
    @action generateCoupon(){
        return 'aa'
    }
    @action saveCouponRule(values: CouponRuleType){
        this.couponRule.condition = values.condition
        this.couponRule.status = true
        this.couponRule.unit = values.unit,
        this.couponRule.value = values.value
        this.ruleModelVisible = false
        this.updateConponRule(this.couponRule)
    }
    @action cancelSaveRule(){
        this.ruleModelVisible = false
    }

    @action changeCouponInfo(key: string, value: string|number){
        //@ts-ignore
        this.tempCoupon[key] = value
    }
    @action changeCouponRuleInfo(key: string, value: string|number){
        //@ts-ignore
        this.couponRule[key] = value
    }

    @action getCoupons(companyId: number) {
        this.isLoading = true;
        apiagent.get(`${API_URL.GET_COUPONS}/${companyId}`).then(action(json => {
            // @ts-ignore
            json.map(ele=>this.couponList.set(ele.couponId, ele as CouponType))
        })).finally(action(() => { this.isLoading = false }))
    }

    @action getCouponRule(companyId: number) {
        this.isLoading = true;
        apiagent.get(`${API_URL.GET_COUPON_RULE}/${companyId}`).then(action(json => {
            // @ts-ignore
            json.map(ele=>this.couponList.set(ele.couponId, ele as CouponType))
        })).finally(action(() => { this.isLoading = false }))
    }

    @action syncConpon(coupon: CouponType){
        this.isLoading = true
        apiagent.post(`${API_URL.UPDATE_COUPON}`, coupon).then(action(info=>{
            console.log(info)
            // @ts-ignore
            if(this.couponList.get(info.insertId)){
                this.couponList.set(coupon.couponId, coupon)
            }else{
                // @ts-ignore
                coupon.couponId = info.insertId
                this.couponList.set(coupon.couponId, coupon)
            }
        })).finally(()=>this.isLoading=false)
    }
    @action updateConponRule(couponRule: CouponRuleType){
        this.isLoading = true
        apiagent.post(`${API_URL.UPDATE_COUPON_RULE}`, couponRule).then(action(info=>{
            if(!couponRule.couponRuleId){
                // @ts-ignore
                this.couponRule.couponRuleId = info.insertId
            }
        })).finally(()=>this.isLoading=false)
    }
    @action deleteCoupon(coupon: any){
        this.isLoading = true
        apiagent.post(`${API_URL.DELETE_COUPON}`, coupon.couponId).then(action(info=>{
            this.couponList.delete(coupon.couponId)
        })).finally(()=>this.isLoading=false)
    }
}

export default new CouponStore();
