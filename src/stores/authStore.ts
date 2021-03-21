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
import { ResultType, dataFiles } from "../stores/data.d";

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
  @observable dataFiles: Array<dataFiles> = [];
  @observable restaurantInfo: RestaurantType = {} as RestaurantType;
  @observable wsOrders: Array<string> = [];
  @observable companyShops: Array<RestaurantType> = [];
  @observable formRef = React.createRef<FormInstance>();
  @observable responseValues: object = {};
  @observable token: string | undefined;
  @observable authenticated: boolean = true;
  @observable errorMsg: string | undefined;
  @observable checkedDataFiles: Array<number> = [];
  @observable inputCheckedDataFiles: Array<number> = [];
  @observable checkall: boolean = false;
  @observable indeterminate: boolean = true;
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
            // console.log(json.guestbook);
            // console.log(json.responseValues);
            // console.log(json.info, json.submitted);
            // console.log(json.dataFiles);
            const dfs = json.dataFiles.map((d: any) => {
              d["value"] = d.id;
              if (d.assigneeidentifier || d.authenticated_user_id)
                d.disabled = true;
              else d.disabled = false;
              if (d.assigneeidentifier) d.label += "(Approved)";
              if (d.authenticated_user_id) d.label += "(Requested)";
              if (json.info.inputDataFileIDs.includes(d.id)) d.disabled = true;
              return d;
            });
            //console.log(dfs);
            this.checkedDataFiles = json.info.inputDataFileIDs;
            this.dataFiles = dfs;
            this.inputCheckedDataFiles = json.info.inputDataFileIDs;
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
            // this.authenticated = false;
            // this.errorMsg =
            //   "Session expired, please proceed to Dataverse to start over again.";
            this.unauthorised(
              "Session expired, please proceed to Dataverse to start over again."
            );
            //alert(error.data);
          } else {
            this.unauthorised(
              error.data ? error.data : "Server error, please try again."
            );
            //this.openNotification(error.data);
            // this.authenticated = false;
            // this.errorMsg = error.data
            //   ? error.data
            //   : "Server error, please try again.";
          }
        })
        .finally(
          action(() => {
            setTimeout(() => (this.isLoading = false), 1000);
          })
        );
    }
  }

  @action unauthorised(value: string) {
    this.authenticated = false;
    this.errorMsg = value;
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
            checkedDataFiles: this.checkedDataFiles,
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
  @action onChange = (list: any) => {
    console.log(list);
    this.checkedDataFiles = list;
    this.indeterminate = !!list.length && list.length < this.dataFiles.length;
    this.checkall = list.length === this.dataFiles.length;
  };
  @action individualOnChange = (e: any, fileID: number) => {
    console.log(e, fileID);
    if (e.target.checked) {
      if (!this.checkedDataFiles.includes(fileID)) {
        const checkedList = [...this.checkedDataFiles, fileID];
        console.log(checkedList);
        this.checkedDataFiles = checkedList;
        this.indeterminate =
          !!checkedList.length && checkedList.length < this.dataFiles.length;
        this.checkall = checkedList.length === this.dataFiles.length;
      }
    } else {
      const checkedList = [
        ...this.checkedDataFiles.filter((item) => item !== fileID),
      ];
      console.log(checkedList);
      this.checkedDataFiles = checkedList;
      this.indeterminate =
        !!checkedList.length && checkedList.length < this.dataFiles.length;
      this.checkall = checkedList.length === this.dataFiles.length;
    }
  };
  @action onCheckAllChange = (e: any) => {
    this.checkedDataFiles = this.sortChcked(e.target.checked);
    this.indeterminate = false;
    this.checkall = e.target.checked;
  };
  sortChcked = (checked: boolean) => {
    var checkedFiles: Array<number> = [...this.inputCheckedDataFiles];
    if (checked) {
      this.dataFiles.map((d: dataFiles) => {
        if (!d.disabled) checkedFiles.push(d.id);
      });
    } else checkedFiles = [...this.inputCheckedDataFiles];
    return checkedFiles;
  };
  resultModal = (type: string) => {
    Modal.success({
      title:
        type === "save"
          ? `Your answers have been saved, a confirmation email has been sent to your registered email address.`
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
