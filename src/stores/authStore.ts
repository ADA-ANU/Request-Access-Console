import React from "react";
import { observable, action, computed, reaction } from "mobx";
import { Modal, notification } from "antd";
import API_URL from "../config";
import apiagent from "./apiagent";
import systemStore from "./systemStore";
import { AdminType, RestaurantType, RequestAccessQ } from "./data";
import { setWsHeartbeat } from "ws-heartbeat/client";
import routingStore from "./routingStore";
import moment from "moment";
import { FormInstance } from "antd/lib/form";
import { convertCompilerOptionsFromJson } from "typescript";
import { ResultType } from "../stores/data.d";

export class AuthStore {
  // @observable token = window.localStorage.getItem('jwt');
  @observable test = false;
  @observable isLoading: boolean = false;
  @observable submitting: boolean = false;
  @observable submitted: boolean = false;
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
  @observable token: string | undefined;
  @observable authenticated: boolean = true;
  @observable errorMsg: string | undefined;
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
      this.token = token;
      this.isLoading = true;
      apiagent
        .post(API_URL.INIT, {
          token: token,
        })
        .then(
          action((json) => {
            console.log(json.guestbook);
            console.log(json.responseValues);
            console.log(json.info, json.submitted);
            this.responseValues = json.responseValues;
            this.questions = json.guestbook;
            const { firstname, lastname, dataset_title, DOI } = json.info;
            this.userFirstName = firstname;
            this.userLastName = lastname;
            this.datasetTitle = dataset_title;
            this.doi = DOI;
            this.submitted = json.submitted;
          })
        )
        .catch((error) => {
          console.log(error);
          if (error.status === 401) {
            this.authenticated = false;
            this.errorMsg =
              "Session expired, please proceed to Dataverse to start over again.";

            //alert(error.data);
          } else {
            //this.openNotification(error.data);
            this.authenticated = false;
            this.errorMsg = error.data
              ? error.data
              : "Server error, please try again.";
          }
        })
        .finally(
          action(() => {
            setTimeout(() => (this.isLoading = false), 1000);
          })
        );
    }
  }

  @action submit(values: object) {
    this.submitting = true;
    console.log(values);
    apiagent
      .post(API_URL.SUBMITRESPONSES, {
        token: this.token,
        responses: values,
      })
      .then(
        action((json) => {
          console.log(json);
          this.submitted = true;
          this.resultModal("submit");
        })
      )
      .catch((error) => {
        console.log(error);
        if (error.status === 401) {
          this.authenticated = false;
          this.errorMsg =
            "Session expired, please proceed to Dataverse to start over again.";
        } else {
          this.openNotification(error.data);
        }
      })
      .finally(
        action(() => {
          setTimeout(() => (this.submitting = false), 1000);
        })
      );
  }

  @action save() {
    if (!this.token) {
      return alert("Session expired, please reload the page ... ");
    }
    this.formRef.current
      ?.validateFields()
      .then((values) => {
        this.submitting = true;
        console.log(values);
        apiagent
          .post(API_URL.SAVERESPONSES, {
            token: this.token,
            responses: values,
          })
          .then(
            action((json) => {
              this.resultModal("save");
            })
          )
          .catch((error) => {
            console.log(error);
            if (error.status === 401) {
              this.authenticated = false;
              this.errorMsg =
                "Session expired, please proceed to Dataverse to start over again.";
            } else {
              this.openNotification(error.data);
            }
          })
          .finally(
            action(() => {
              setTimeout(() => (this.submitting = false), 1000);
            })
          );
      })
      .catch((errorInfo) => {
        console.log(errorInfo);
      });

    // setTimeout(() => {
    //   this.submitting = false;
    //   this.result = true;
    //   Modal.success({
    //     title: "Your answers have been saved. ",
    //   });
    // }, 2000);
  }
  resultModal = (type: string) => {
    Modal.success({
      title:
        type === "save"
          ? `Your answers have been saved, a confirmation email has been sent to your registed email address.`
          : `Your answers have been submitted.`,
    });
  };
  openNotification = (msg: string) => {
    notification.error({
      message: `Oops`,
      description: msg,
    });
  };
}

export default new AuthStore();
