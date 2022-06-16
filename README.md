# stock-data

Stock Data - 接取資料

## 使用說明

### Step1

先至根目錄底下執行 `npm install` 指令，將 node_modules 的 package 都下載下來

### Step2

執行 `npm start` 之後，就可以在 `localhost:3000` 查看網站

## 在伺服器上的建置說明

使用 `npm run build` 可以 build 出靜態檔，就可以放置在伺服器上；如果是使用 GCP 服務，會需要用到 `gcloud init` 跟 `gcloud app deploy` 等相關指令。
