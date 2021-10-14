import React from "react";
import { observable, action, computed, reaction, toJS } from "mobx";
import { Modal, notification } from "antd";
import API_URL from "../config";
import apiagent from "./apiagent";
import systemStore from "./systemStore";
import { AdminType, RestaurantType, RequestAccessQ, Country } from "./data";
import { setWsHeartbeat } from "ws-heartbeat/client";
import routingStore from "./routingStore";
import moment from "moment";
import { FormInstance } from "antd/lib/form";
import {
  convertCompilerOptionsFromJson,
  textChangeRangeIsUnchanged,
} from "typescript";
import {
  ResultType,
  dataFiles,
  submissionResult,
  siblingDataset,
} from "../stores/data.d";
import { file } from "jszip";
import { RcFile } from "antd/lib/upload";
import { CheckboxChangeEvent } from "../../node_modules/antd/es/checkbox";

export class AuthStore {
  // @observable token = window.localStorage.getItem('jwt');
  @observable test = false;
  @observable isLoading: boolean = false;
  @observable submitting: boolean = false;
  @observable submitted: boolean = false;
  @observable hasAnyFileSubmitted: boolean = false;
  @observable validationError: boolean = false;
  @observable emailNotification: boolean = true;
  @observable datasetURL: string | undefined;
  @observable result: boolean = false;
  @observable datasetID_orginalRequest: number | undefined;
  @observable questions?: Array<RequestAccessQ>;
  @observable siblingDatasets: Array<siblingDataset> = [];
  @observable userid: number | undefined;
  @observable userFirstName: string | undefined;
  @observable userLastName: string | undefined;
  @observable datasetTitle: string | undefined;
  @observable userEmail: string | undefined;
  @observable countryList: Array<Country> = [];
  @observable uploadedFiles: Map<any, any> = new Map();
  @observable doi: string | undefined;
  @observable dataFiles: Array<dataFiles> = [];
  @observable submittedFileIDs: Array<number> = [];
  @observable unrestrictedFileIDs: Array<number> = [];
  @observable restaurantInfo: RestaurantType = {} as RestaurantType;
  @observable wsOrders: Array<string> = [];
  @observable companyShops: Array<RestaurantType> = [];
  @observable formRef = React.createRef<FormInstance>();
  @observable responseValues: { [k: number]: any } = {};
  @observable token: string | undefined;
  @observable authenticated: boolean = true;
  @observable errorMsg: string | undefined;
  @observable checkedDataFiles: Map<any, any> = new Map();
  @observable inputCheckedDataFiles: Array<number> = [];
  @observable checkall: boolean = false;
  @observable indeterminate: boolean = true;
  @observable termsOfAccess: string | undefined;
  @observable termsOfUse: string = "";
  @observable showModal: boolean = false;
  @observable showResultModal: boolean = false;
  @observable termsCheckboxes: Array<string> = [
    "I accept the Terms of Access.",
    "I accept the Terms of Use.",
  ];
  @observable termsCheckboxValues: Array<string> = [];
  @observable submissionResult: Array<submissionResult> = [];
  @observable ticketID: number | undefined;
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
            console.log(json);
            // console.log(json.responseValues);
            // console.log(json.info, json.submitted);
            //console.log(json.terms);
            this.datasetURL = json.datasetURL;
            this.siblingDatasets = json.siblingDatasets;
            this.datasetID_orginalRequest = Number(json.info.dataset_id);
            const dfs = json.dataFiles.map((d: any) => {
              d["value"] = d.id;
              if (
                d.restricted &&
                (d.assigneeidentifier || d.authenticated_user_id)
              ) {
                d.disabled = true;
              } else {
                d.disabled = false;
              }
              // if (d.restricted && !d.disabled)
              //   this.checkedDataFiles.set(
              //     Number(json.info.dataset_id),
              //     this.checkedDataFiles.get(Number(json.info.dataset_id))
              //       ? [
              //           ...this.checkedDataFiles.get(
              //             Number(json.info.dataset_id)
              //           ),
              //           d.id,
              //         ]
              //       : [d.id]
              //   );

              // if (d.assigneeidentifier) d.label += " (Approved)";
              // if (d.authenticated_user_id) {
              //   d.label += " (Requested)";
              //   this.hasAnyFileSubmitted = true;
              // }
              //if (json.info.inputDataFileIDs.includes(d.id)) d.disabled = true;
              return d;
            });
            //console.log(dfs);
            const { termsofaccess, termsofuse } = json.terms[0];
            this.termsOfAccess = termsofaccess;
            this.termsOfUse = termsofuse;
            //this.checkedDataFiles = json.info.inputDataFileIDs;
            this.dataFiles = dfs;
            this.inputCheckedDataFiles = json.info.inputDataFileIDs;
            this.onChange(json.info.inputDataFileIDs);
            this.userEmail = json.info.email;
            console.log(json.responseValues);
            //json.responseValues[755] = undefined;
            this.responseValues = json.responseValues;
            this.questions = json.guestbook;
            json.guestbook.map((q: RequestAccessQ) => {
              if (q.questiontype === "fileupload") {
                this.uploadedFiles.set(
                  q.questionid,
                  q.clientuploadedfiles
                    ? q.clientuploadedfiles.map((file) => file.originalname)
                    : []
                );
              }
            });
            const { firstname, lastname, dataset_title, DOI, userid } =
              json.info;
            this.userFirstName = firstname;
            this.userLastName = lastname;
            //console.log(userid);
            this.userid = userid;
            this.datasetTitle = dataset_title;
            this.doi = DOI;
            this.submitted = json.submitted;
            console.log(json.submittedFileIDs);
            this.submittedFileIDs = json.submittedFileIDs;
            this.unrestrictedFileIDs = json.unrestrictedFileIDs;
            this.countryList = json.countryList;
            //console.log(json.countryList);
          })
        )
        .catch((error) => {
          console.log(error.status);
          if (error.status === 401) {
            // this.authenticated = false;
            // this.errorMsg =
            //   "Session expired, please proceed to Dataverse to start over again.";
            this.unauthorised(
              "Session expired, please proceed to Dataverse to start over again."
            );
            //alert(error.data);
          } else if (error.status === 405) {
            console.log("6666");
            this.unauthorised(
              "Email unconfirmed, please proceed to Dataverse to confirm your email."
            );
          } else {
            console.log("777", error.data ? error.data : error);
            this.unauthorised(
              error.data
                ? error.data.msg
                  ? error.data.msg
                  : error.data
                : "Server error, please try again."
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
  @action handleValidationError(value: boolean) {
    this.validationError = value;
  }
  @action addFileName(qID: number, name: string) {
    const prevArray = this.uploadedFiles.get(qID);
    if (!prevArray) this.uploadedFiles.set(qID, [name]);
    else {
      this.uploadedFiles.set(qID, [...prevArray, name]);
    }
    this.handleValidationError(false);
    this.formRef.current?.validateFields();
  }
  @action deleteFile(qID: number, file: any) {
    //console.log(`${API_URL.HANDLE_FILE_DELETE}${file.fileName}`);
    if (file.error || !file.fileName) {
      const temp = [...this.uploadedFiles.get(qID)].filter(
        (ele) => ele !== file.name
      );
      this.uploadedFiles.set(qID, temp);
    } else {
      apiagent
        .get(`${API_URL.HANDLE_FILE_DELETE}${file.fileName}`)
        .then(
          action((json) => {
            console.log(json, qID, this.uploadedFiles.get(qID));
            const temp = [...this.uploadedFiles.get(qID)].filter(
              (ele) => ele !== file.name
            );
            this.uploadedFiles.set(qID, temp);
            this.openNotificationSuccessful(`${file.name} deleted.`);
          })
        )
        .catch((error) => {
          console.log(error);

          this.openNotification(error.data);
        });
    }
  }

  @action unauthorised(value: string) {
    this.authenticated = false;
    this.errorMsg = value;
  }
  @action confirmModal() {
    this.formRef.current
      ?.validateFields()
      .then(
        action((values) => {
          this.handleValidationError(false);
          console.log(toJS(values));
          this.showModal = true;
        })
      )
      .catch((err) => {
        this.handleValidationError(true);
        console.log(err);
      });
  }
  @action handleModal(value: boolean) {
    this.showModal = value;
    if (!value) this.termsCheckboxValues = [];
  }
  @action handleResultModal(value: boolean) {
    this.showResultModal = value;
  }
  @action submit(values: { [k: number]: any }) {
    this.submitting = true;
    console.log(values);

    //this.handleModal(false);
    if (
      this.termsCheckboxValues.sort().join(",") !==
      this.termsCheckboxes.sort().join(",")
    ) {
      this.openNotification(
        "Please tick the checkboxes of terms before the submission."
      );
      this.submitting = false;
      return;
    }
    for (let q of this.questions!) {
      if (q.questiontype === "fileupload") {
        values[q.questionid] = null;
      }
    }

    let ids: any = [];
    this.checkedDataFiles.forEach((value) => ids.push([...value]));
    const checkedDatafileIDs = ids.flat();
    apiagent
      .post(API_URL.SUBMITRESPONSES, {
        token: this.token,
        responses: values,
        checkedDataFiles: checkedDatafileIDs,
      })
      .then(
        action((json) => {
          console.log(json);
          // console.log(
          //   json.some((ele: any) => ele.status === "ERROR"),
          //   json.some((ele: any) => ele.status === "ERROR") ? false : true
          // );
          const { result, ticketID } = json;
          this.submitted = result.some((ele: any) => ele.status === "ERROR")
            ? false
            : true;
          console.log(this.submitted);
          this.showResultModal = true;
          this.submissionResult = result;
          this.ticketID = ticketID;
          //this.resultModal("submit");
        })
      )
      .catch((error) => {
        console.log(error);
        if (error.status === 401) {
          this.authenticated = false;
          this.errorMsg =
            "Session expired, please proceed to Dataverse to start over again.";
        } else {
          this.openNotification(error.data ? error.data : error.statusText);
        }
      })
      .finally(
        action(() => {
          this.handleModal(false);
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
            checkedDataFiles: this.checkedDataFiles.get(
              this.datasetID_orginalRequest
            ),
            emailNotification: this.emailNotification,
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
    //console.log(this.submittedFileIDs.length);
    console.log(this.dataFiles.length);
    this.checkedDataFiles.set(this.datasetID_orginalRequest, list);
    this.indeterminate =
      !!list.length &&
      list.length <
        this.dataFiles.length -
          this.submittedFileIDs.length -
          this.unrestrictedFileIDs.length;
    this.checkall =
      list.length ===
      this.dataFiles.length -
        this.submittedFileIDs.length -
        this.unrestrictedFileIDs.length;
  };
  @action individualOnChange = (e: any, fileID: number, datasetID: number) => {
    console.log(e, fileID);
    if (e.target.checked) {
      if (!this.checkedDataFiles.get(datasetID).includes(fileID)) {
        const checkedList = [...this.checkedDataFiles, fileID];
        console.log(checkedList);
        this.checkedDataFiles.set(datasetID, checkedList);
        this.indeterminate =
          !!checkedList.length && checkedList.length < this.dataFiles.length;
        this.checkall = checkedList.length === this.dataFiles.length;
      }
    } else {
      const checkedList = [
        ...this.checkedDataFiles
          .get(datasetID)
          .filter((item: any) => item !== fileID),
      ];
      console.log(checkedList);
      this.checkedDataFiles.set(datasetID, checkedList);
      this.indeterminate =
        !!checkedList.length && checkedList.length < this.dataFiles.length;
      this.checkall = checkedList.length === this.dataFiles.length;
    }
  };
  @action onCheckAllChange = (e: any) => {
    this.checkedDataFiles.set(
      this.datasetID_orginalRequest,
      this.sortChcked(e.target.checked)
    );
    console.log(this.checkedDataFiles);
    this.indeterminate = false;
    this.checkall = e.target.checked;
  };

  @action siblingCheckAllOnChange(datasetID: number, datafileIDs: number[]) {
    if (datafileIDs.length > 0) {
      this.checkedDataFiles.set(Number(datasetID), datafileIDs);
      //console.log(this.checkedDataFiles.get(Number(datasetID)));
    } else {
      this.checkedDataFiles.delete(Number(datasetID));
    }
  }
  @action termsOnchange = (list: any) => {
    console.log(list);
    this.termsCheckboxValues = list;
  };

  sortChcked = (checked: boolean) => {
    var checkedFiles: number[] = [];
    //Array<number> = [...this.inputCheckedDataFiles];
    console.log(checkedFiles, this.submittedFileIDs);
    if (checked) {
      this.dataFiles.map((d: dataFiles) => {
        //console.log(d, !d.disabled, !this.unrestrictedFileIDs.includes(d.id));
        if (!d.disabled && !this.unrestrictedFileIDs.includes(d.id)) {
          checkedFiles.push(d.id);
        }
      });
    }
    //...this.inputCheckedDataFiles
    else checkedFiles = [];
    console.log(checkedFiles);
    return checkedFiles;
  };

  @action emailNotificationOnChange = (e: CheckboxChangeEvent) => {
    this.emailNotification = e.target.checked;
    localStorage.setItem(
      "ADA_Request_Access",
      JSON.stringify({ notification: e.target.checked })
    );
  };

  @action emailNotificationOnChangeWithoutLocalStorage = (value: boolean) => {
    this.emailNotification = value;
  };

  resultModal = (type: string) => {
    Modal.success({
      width: 500,
      centered: true,
      title:
        type === "save"
          ? this.emailNotification
            ? `Your answers have been saved, a confirmation email has been sent to your registered email address (${this.userEmail}).`
            : `Your answers have been saved.`
          : `Submission Result: `,
    });
  };
  openNotification = (msg: string) => {
    notification.error({
      message: `Oops`,
      description: msg,
      duration: 0,
      top: 80,
    });
  };
  openNotificationSuccessful = (msg: string) => {
    notification.success({
      message: msg,
      top: 80,
    });
  };
}

export default new AuthStore();
