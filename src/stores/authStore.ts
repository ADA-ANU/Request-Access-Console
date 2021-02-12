import React from "react";
import { observable, action, computed, reaction } from "mobx";
import { Modal } from "antd";
import API_URL from "../config";
import apiagent from "./apiagent";
import systemStore from "./systemStore";
import { AdminType, RestaurantType, RequestAccessQ } from "./data";
import { setWsHeartbeat } from "ws-heartbeat/client";
import routingStore from "./routingStore";
import moment from "moment";
import { FormInstance } from "antd/lib/form";
export class AuthStore {
  // @observable token = window.localStorage.getItem('jwt');
  @observable test = false;
  @observable isLoading: boolean = false;
  @observable submitting: boolean = false;
  @observable result: boolean = false;
  @observable questions?: Array<RequestAccessQ>;
  @observable userFirstName: string | undefined;
  @observable userLastName: string | undefined;
  @observable datasetTitle: string | undefined;
  @observable doi: string | undefined;
  @observable restaurantInfo: RestaurantType = {} as RestaurantType;
  @observable wsOrders: Array<string> = [];
  @observable companyShops: Array<RestaurantType> = [];
  @observable formRef = React.createRef<FormInstance>();
  @observable responseValues: object = {};

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
            console.log(json.guestbook);
            console.log(json.responseValues);
            this.responseValues = json.responseValues;
            this.questions = json.guestbook;
            const { firstname, lastname, dataset_title, DOI } = json.info;
            this.userFirstName = firstname;
            this.userLastName = lastname;
            this.datasetTitle = dataset_title;
            this.doi = DOI;
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
            setTimeout(() => (this.isLoading = false), 1000);
          })
        );
    }
  }

  @action submit() {
    this.submitting = true;
    setTimeout(() => {
      this.submitting = false;
      this.result = true;
      Modal.success({
        title: "Your answers have been submitted, thank you. ",
      });
    }, 2000);
  }

  @action save() {
    this.submitting = true;
    setTimeout(() => {
      this.submitting = false;
      this.result = true;
      Modal.success({
        title: "Your answers have been saved. ",
      });
    }, 2000);
  }
}

export default new AuthStore();
