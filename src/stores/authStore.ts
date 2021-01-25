import { observable, action, computed, reaction } from "mobx";
import API_URL from "../config";
import apiagent from "./apiagent";
import systemStore from "./systemStore";
import { AdminType, RestaurantType } from "./data";
import { setWsHeartbeat } from "ws-heartbeat/client";
import couponStore from "./couponStore";
import printerStore from "./printerStore";
import productStore from "./productStore";
import openTimeStore from "./openTimeStore";
import orderListStore from "./orderListStore";
import routingStore from "./routingStore";
import moment from "moment";

export class AuthStore {
  // @observable token = window.localStorage.getItem('jwt');
  @observable test = false;
  @observable isLoading: boolean = false;
  @observable adminAccount: AdminType = JSON.parse(
    window.localStorage.getItem("user") || "{}"
  ) as AdminType;
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
  setupSocket() {
    let ws: WebSocket = new WebSocket(API_URL.WS_URL);
    setWsHeartbeat(ws, '{"kind":"ping"}', {
      pingTimeout: 70000, // in 60 seconds, if no message accepted from server, close the connection.
      pingInterval: 60000, // every 25 seconds, send a ping message to the server.
    });
    ws.onopen = () => {
      // on connecting, do nothing but log it to the console
      // console.log('connected as user id: ' +this.adminAccount.id)
      let message = {
        userId: this.adminAccount.id,
        companyId: this.adminAccount.companyId,
        restaurantId: this.adminAccount.restaurantId,
        type: "conn",
      };
      ws.send(JSON.stringify(message));
    };
    ws.onmessage = (evt) => {
      // on receiving a message, add it to the list of messages
      let orderId = JSON.parse(evt.data);
      console.log(orderId);
      if (orderId === "pong") {
        systemStore.disconnected = false;
      } else {
        orderListStore.getOrderByOrderId(orderId);
      }
      // this.wsOrders.push(orderId)
    };
    ws.onclose = (e) => {
      alert("Disconnected from server, please refresh this page ... ");
      systemStore.disconnected = true;
      //systemStore.networkErrorInfo = null
      console.log("Disconnected!");
    };
  }

  @action login(username: string, password: string) {
    this.isLoading = true;
    apiagent
      .post(API_URL.AUTH, {
        name: username,
        password: password,
      })
      .then(
        action((json) => {
          // console.log(json)
          this.adminAccount = json as AdminType;
          this.adminAccount.date = moment().format();
          window.localStorage.setItem(
            "user",
            JSON.stringify(this.adminAccount)
          );
          this.initApp();

          return json;
        })
      )
      .catch((error) => {
        console.log(error);
        if (error.status === 401) {
          alert("Email or password is incorrect, please try again ... ");
        } else {
          alert("Sign In Error, please refresh page and try again ... ");
          systemStore.networkError = true;
          systemStore.networkErrorInfo = error;
        }
      })
      .finally(
        action(() => {
          this.isLoading = false;
        })
      );
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
            this.isLoading = false;
          })
        );
    }
  }
  @action getRestaurantInfo() {
    this.isLoading = true;
    apiagent
      .get(`${API_URL.GET_RESTAURANT_INFO}/${this.adminAccount.restaurantId}`)
      .then(
        action((info) => {
          // console.log(info)
          //@ts-ignore
          this.restaurantInfo = info[0] as RestaurantType;
        })
      )
      .catch((error) => {
        console.log(error);
      })
      .finally(() => (this.isLoading = false));
  }
  @action getCompanyInfo() {
    this.isLoading = true;
    apiagent
      .get(`${API_URL.GET_COMPANY_INFO}/${this.adminAccount.companyId}`)
      .then(
        action((info) => {
          //@ts-ignore
          info.map((ele) => this.companyShops.push(ele as RestaurantType));
        })
      )
      .catch((error) => {
        console.log(error);
      })
      .finally(() => (this.isLoading = false));
  }

  @action switchAutoPrint(printMode: boolean) {
    let mode = "auto";
    if (!printMode) mode = "manual";
    this.isLoading = true;
    apiagent
      .get(
        `${API_URL.SWITCH_AUTO_PRINT}/${mode}/${this.adminAccount.restaurantId}`
      )
      .then(
        action((info) => {
          this.restaurantInfo.printMode = mode;
        })
      )
      .finally(() => (this.isLoading = false));
  }

  @action logout() {
    this.isLoading = true;
    apiagent
      .get(API_URL.LOGOUT)
      .then(
        action((res) => {
          window.localStorage.setItem("user", "{}");
          this.adminAccount = {} as AdminType;
        })
      )
      .finally(() => (this.isLoading = false));
  }
}

export default new AuthStore();
