import axios from "axios";


function apiUrl() {
  switch (process.env.NODE_ENV === "development") {
    case "production":
      return "http://140.118.118.173:20023/";
    default:
    case "development":
      return "http://140.118.118.173:20023/";
  }
}

export const defaultAxios = axios.create({
  baseURL: apiUrl(),
  // baseURL: "http://localhost:8080/",
  // baseURL: "http://192.168.1.3:8080/",
});
export function settingToken(token) {
  defaultAxios.defaults.headers.common["token"] = token;
}

defaultAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (!config.headers.token) config.headers.token = token;
  return config;
});

// api

export const api = {
  login: { url: "api/investor/login", method: "POST" },
  logout: { url: "api/investor/logout", method: "POST" },

  getOrder: { url: "api/order", method: "GET" },
  postOrder: { url: "api/order", method: "POST" },
  deleteOrder: { url: "api/order", method: "DELETE" },
  getDisplay: { url: "api/display", method: "GET" },
  getDisplayChart: { url: "api/display/chart", method: "GET" },
  getTransaction: { url: "api/transaction", method: "GET" },
  getStock: { url: "api/stock", method: "GET" },
  postStock: { url: "api/stock", method: "POST" },
  putStock: { url: "api/stock", method: "PUT" },
  deleteStock: { url: "api/stock", method: "DELETE" },
  resetStock: { url: "api/stock/reset", method: "PUT" },
  getVirtualOrder: { url: "api/virtualOrder", method: "GET" },
  postVirtualOrder: { url: "api/virtualOrder", method: "POST" },
  resetVirtualOrder: { url: "api/virtualOrder", method: "PUT" },
  getVirtualOrderContainer: {
    url: "api/virtualOrder/container",
    method: "GET",
  },

  getContainer: { url: "api/virtualOrder/container", method: "GET" },
  postContainer: { url: "api/virtualOrder/container", method: "POST" },
  putContainer: { url: "api/virtualOrder/container", method: "PUT" },
  deleteContainer: {
    url: "api/virtualOrder/container",
    method: "DELETE",
  },
  getGroup: { url: "api/group", method: "GET" },

  //Available -----
  getAvailableStock: {
    url: "api/available/stock",
    method: "GET",
  },

  getAvailableFutures: {
    url: "api/available/futures",
    method: "GET",
  },
  //Available -----

  //Real data -----
  getRealDataStockOrder: { url: "api/real-data/stock/order", method: "GET" },
  postRealDataStockOrder: { url: "api/real-data/stock/order", method: "POST" },
  putRealDataStockOrder: { url: "api/real-data/stock/order", method: "PUT" },
  deleteRealDataStockOrder: {
    url: "api/real-data/stock/order",
    method: "DELETE",
  },
  getRealDataStockOrderContent: {
    url: "api/real-data/stock/order/content",
    method: "GET",
  },
  postRealDataStockOrderContent: {
    url: "api/real-data/stock/order/content",
    method: "POST",
  },

  getRealDataStockTransaction: {
    url: "api/real-data/stock/transaction",
    method: "GET",
  },
  postRealDataStockTransaction: {
    url: "api/real-data/stock/transaction",
    method: "POST",
  },
  putRealDataStockTransaction: {
    url: "api/real-data/stock/transaction",
    method: "PUT",
  },
  deleteRealDataStockTransaction: {
    url: "api/real-data/stock/transaction",
    method: "DELETE",
  },
  getRealDataStockTransactionContent: {
    url: "api/real-data/stock/transaction/content",
    method: "GET",
  },
  postRealDataStockTransactionContent: {
    url: "api/real-data/stock/transaction/content",
    method: "POST",
  },

  getRealDataStockDisplay: {
    url: "api/real-data/stock/display",
    method: "GET",
  },
  postRealDataStockDisplay: {
    url: "api/real-data/stock/display",
    method: "POST",
  },
  putRealDataStockDisplay: {
    url: "api/real-data/stock/display",
    method: "PUT",
  },
  deleteRealDataStockDisplay: {
    url: "api/real-data/stock/display",
    method: "DELETE",
  },
  getRealDataStockDisplayContent: {
    url: "api/real-data/stock/display/content",
    method: "GET",
  },
  postRealDataStockDisplayContent: {
    url: "api/real-data/stock/display/content",
    method: "POST",
  },

  getRealDataFuturesOrder: {
    url: "api/real-data/futures/order",
    method: "GET",
  },
  postRealDataFuturesOrder: {
    url: "api/real-data/futures/order",
    method: "POST",
  },
  putRealDataFuturesOrder: {
    url: "api/real-data/futures/order",
    method: "PUT",
  },
  deleteRealDataFuturesOrder: {
    url: "api/real-data/futures/order",
    method: "DELETE",
  },
  getRealDataFuturesOrderContent: {
    url: "api/real-data/futures/order/content",
    method: "GET",
  },
  postRealDataFuturesOrderContent: {
    url: "api/real-data/futures/order/content",
    method: "POST",
  },

  getRealDataFuturesTransaction: {
    url: "api/real-data/futures/transaction",
    method: "GET",
  },
  postRealDataFuturesTransaction: {
    url: "api/real-data/futures/transaction",
    method: "POST",
  },
  putRealDataFuturesTransaction: {
    url: "api/real-data/futures/transaction",
    method: "PUT",
  },
  deleteRealDataFuturesTransaction: {
    url: "api/real-data/futures/transaction",
    method: "DELETE",
  },
  getRealDataFuturesTransactionContent: {
    url: "api/real-data/futures/transaction/content",
    method: "GET",
  },
  postRealDataFuturesTransactionContent: {
    url: "api/real-data/futures/transaction/content",
    method: "POST",
  },

  getRealDataFuturesDisplay: {
    url: "api/real-data/futures/display",
    method: "GET",
  },
  postRealDataFuturesDisplay: {
    url: "api/real-data/futures/display",
    method: "POST",
  },
  putRealDataFuturesDisplay: {
    url: "api/real-data/futures/display",
    method: "PUT",
  },
  deleteRealDataFuturesDisplay: {
    url: "api/real-data/futures/display",
    method: "DELETE",
  },
  getRealDataFuturesDisplayContent: {
    url: "api/real-data/futures/display/content",
    method: "GET",
  },
  postRealDataFuturesDisplayContent: {
    url: "api/real-data/futures/display/content",
    method: "POST",
  },
  //Real data -----

  getRole: { url: "api/rbac/role", method: "GET" },
  postRole: { url: "api/rbac/role", method: "POST" },
  putRole: { url: "api/rbac/role", method: "PUT" },
  deleteRole: { url: "api/rbac/role", method: "DELETE" },
  getRolePermission: { url: "api/rbac/permission", method: "GET" },

  getInvestor: { url: "api/investor", method: "GET" },
  postInvestor: { url: "api/investor", method: "POST" },
  putInvestor: { url: "api/investor", method: "PUT" },
  deleteInvestor: { url: "api/investor", method: "DELETE" },
};
