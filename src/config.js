let API_ROOT_URL = "http://localhost:3080";
let WS_URL = `ws://localhost:9060`;
console.log(process.env);

process.env.NODE_ENV === "production" ? (API_ROOT_URL = "") : "";
process.env.NODE_ENV === "production"
  ? (WS_URL = `wss://${window.location.hostname}/socket`)
  : "";

const API_URL = {
  ROOT_URL: API_ROOT_URL,
  INIT: "requestAccess/init",
  SAVERESPONSES: "api/saveResponses",
  DEFAULT_PRINT_SERVICE: "http://localhost:9099",
  PRINTER_STATUS: `http://localhost:9099/printerStatus`,
  SITE: "/api/site",
  QUERY_SITE: "/api/query",
  ACTIVE_ORDER_LIST: "/api/getOrders",
  HISTORY_ORDER_LIST: "/api/getOrdersHistory",
  GET_ORDER_BY_ORDER_ID: "/api/getOrderById",
  // PRODUCT_LIST: '/qapi/getAllDishes',
  PRODUCT_LIST: "/api/getDishesAll",
  UPDATE_ORDER_STATUS: "/qapi/updateOrderStatus",
  GET_ORDER_DELIVERY: "/qapi/getDeliveryDetailByOrderId",
  WS_URL: WS_URL,
  AUTH: "/users/adminlogin",
  LOGOUT: "/users/logout",
  GET_RESTAURANT_INFO: "/qapi/getRestaurantInfo",
  GET_COMPANY_INFO: "/qapi/getCompanyShops",
  SWITCH_AUTO_PRINT: "/qapi/switchAutoPrint",
  COMPANY_HISTORY_ORDER_LIST: "/api/getCompanyHistoryOrders",
  UPDATE_DISH_AVAILABILITY: "/qapi/updateDishAvailability",
  IMAGE: "/api/img",
  GET_PRINTERS: "/qapi/getPrinters",
  UPDATE_PRINTER: "/qapi/updatePrinter",
  GET_DISH_TYPES: "/qapi/getDishTypes",
  UPDATE_PRODUCT: "/api/updateProduct",
  DELETE_EXTRADISH: "/qapi/deleteExtraDish",
  GET_COUPONS: "/qapi/getCoupons",
  UPDATE_COUPON: "/qapi/updateCoupon",
  DELETE_COUPON: "/qapi/deleteCoupon",
  DELETE_ORDER: "/qapi/deleteOrderById",
  GET_COUPON_RULE: "/qapi/getCouponRule",
  UPDATE_COUPON_RULE: "/qapi/updateCouponRule",
  UPDATE_REGISTER_PRINT: "/qapi/setRegisterPrint",
  UPDATE_KITCHEN_PRINT: "/qapi/setKitchenPrint",
  GET_OPEN_TIME: "/qapi/getOpenTime",
  GET_OPEN_DAYS: "/qapi/getOpenDays",
  UPDATE_OPEN_TIME: "/qapi/updateOpenTime",
};

export default API_URL;
