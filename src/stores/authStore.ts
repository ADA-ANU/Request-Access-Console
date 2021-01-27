import { observable, action, computed, reaction } from "mobx";
import API_URL from "../config";
import apiagent from "./apiagent";
import systemStore from "./systemStore";
import { AdminType, RestaurantType, RequestAccessQuestion } from "./data";
import { setWsHeartbeat } from "ws-heartbeat/client";
import routingStore from "./routingStore";
import moment from "moment";

export class AuthStore {
  // @observable token = window.localStorage.getItem('jwt');
  @observable test = false;
  @observable isLoading: boolean = false;
  @observable questions?: Array<RequestAccessQuestion>;
  @observable restaurantInfo: RestaurantType = {} as RestaurantType;
  @observable wsOrders: Array<string> = [];
  @observable companyShops: Array<RestaurantType> = [];

  constructor() {
    this.initApp();
  }
  initApp() {
    // const pathname = routingStore?.location.pathname
    // const param = pathname?.split('/')[1]
    // console.log(param)
    // if(this.adminAccount.restaurantId && this.adminAccount.role==='user') {
    //     const isExpire = moment().unix() - moment(this.adminAccount.date).unix() > 5*60*60
    //     if(isExpire) {
    //         this.logout()
    //         return
    //     }
    //     this.setupSocket()
    //     this.getRestaurantInfo()
    //     printerStore.getPrinters(this.adminAccount.restaurantId)
    //     productStore.getProudctList(this.adminAccount.restaurantId)
    //     productStore.getDishTypes(this.adminAccount.restaurantId)
    //     openTimeStore.getOpenTime(this.adminAccount.restaurantId)
    //     orderListStore.getActiveOrderList(this.adminAccount.restaurantId)
    // }else if(this.adminAccount.companyId && this.adminAccount.role==='admin'){
    //     this.getCompanyInfo()
    //     couponStore.getCoupons(this.adminAccount.companyId)
    //     couponStore.getCouponRule(this.adminAccount.companyId)
    // }
  }

  @action init(token: string | undefined) {
    if (token) {
      this.isLoading = true;
      apiagent
        .post(API_URL.INIT, {
          token: token,
        })
        .then(
          action((json) => {
            console.log(json);
            this.questions = json;
          })
        )
        .catch((error) => {
          console.log(error);
          if (error.status === 401) {
            alert("Email or password is incorrect, please try again ... ");
          } else {
            alert("Sign In Error, please refresh page and try again ... ");
            // systemStore.networkError = true
            // systemStore.networkErrorInfo = error
          }
        })
        .finally(
          action(() => {
            setTimeout(() => (this.isLoading = false), 3000);
          })
        );
    }
  }
}

export default new AuthStore();
