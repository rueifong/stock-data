import Q1Chart from "../src/pages/q1-chart";
import Case from "../src/pages/case";
import FrequentData from "../src/pages/frequent-data";
import RealDataUpload from "../src/pages/real-data-upload";
import Simulator from "../src/pages/simulator";
import OrderTable from "../src/pages/table/order-table";
import PriceTable from "../src/pages/table/price-table";
import QuickOrder from "../src/pages/quick-order";
import ReplayChart from "../src/pages/replay";
import Stock from "../src/pages/stock";
import RoleManagement from "../src/pages/role-manage";
import InvestorManagement from "../src/pages/investor-manage";

const AUTH_MAPPING_DATA = {
  stock: Stock,
  "investor-management": InvestorManagement,
  "role-management": RoleManagement,
  "Q1-chart": Q1Chart,
  "replay-chart": ReplayChart,
  case: Case,
  simulator: Simulator,
  "quick-order": QuickOrder,
  "order-table": OrderTable,
  "price-table": PriceTable,
  "real-data-upload": RealDataUpload,
  "frequent-data": FrequentData,
};

const LINK_MAPPING_DATA = {
  stock: "股票管理",
  "investor-management": "帳戶管理",
  "role-management": "角色管理",
  "Q1-chart": "Q1 圖表",
  "replay-chart": "重播紀錄",
  case: "情境管理",
  simulator: "模擬下單",
  "quick-order": "閃電下單",
  "order-table": "委託紀錄表單",
  "price-table": "成交紀錄表單",
  "real-data-upload": "上傳真實資料",
  "frequent-data": "高頻資料",
};

export { AUTH_MAPPING_DATA, LINK_MAPPING_DATA };
