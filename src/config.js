let API_ROOT_URL = "http://localhost:3080";
let WS_URL = `ws://localhost:9060`;
//console.log(process.env);

process.env.NODE_ENV === "production" ? (API_ROOT_URL = "") : "";
process.env.NODE_ENV === "production"
  ? (WS_URL = `wss://${window.location.hostname}/socket`)
  : "";

const API_URL = {
  ROOT_URL: API_ROOT_URL,
  INIT: "requestAccess/init",
  SAVERESPONSES: "api/saveResponses",
  SUBMITRESPONSES: "api/submitResponses",
  HANDLE_FILE_UPDATE: "api/handleFileUpload",
  HANDLE_FILE_DOWNLOAD: "api/download/",
  HANDLE_FILE_DELETE: "api/delete/",
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
  ACCEPT_FILES: [
    ".doc",
    ".docx",
    ".pdf",
    ".png",
    ".jpg",
    ".jpeg",
    ".xls",
    ".xlsx",
  ],
  ACCEPT_SIZE: 31457280,
};

export default API_URL;
