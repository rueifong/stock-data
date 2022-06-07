import { Button, Table, Modal } from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import { api, defaultAxios } from "../../environment/api";
import errorNotification from "../../utils/errorNotification";
import { DeleteOutlined } from "@ant-design/icons";

const ADDER_CONST = 600000;

const check = (...arg) => {
  if (true) console.log(...arg);
};

const getGetRealDataApiByType = (fileType, marketType) => {
  switch (fileType) {
    case "transaction":
      return marketType === "stock"
        ? api.getRealDataStockTransaction
        : api.getRealDataFuturesTransaction;
    case "display":
      return marketType === "stock"
        ? api.getRealDataStockDisplay
        : api.getRealDataFuturesDisplay;
    default:
      return marketType === "stock"
        ? api.getRealDataStockOrder
        : api.getRealDataFuturesOrder;
  }
};

const getPostRealDataApiByType = (fileType, marketType) => {
  console.log(fileType, marketType);
  switch (fileType) {
    case "transaction":
      return marketType === "stock"
        ? api.postRealDataStockTransaction
        : api.postRealDataFuturesTransaction;
    case "display":
      return marketType === "stock"
        ? api.postRealDataStockDisplay
        : api.postRealDataFuturesDisplay;
    default:
      return marketType === "stock"
        ? api.postRealDataStockOrder
        : api.postRealDataFuturesOrder;
  }
};

const getPutRealDataApiByType = (fileType, marketType) => {
  switch (fileType) {
    case "transaction":
      return marketType === "stock"
        ? api.putRealDataStockTransaction
        : api.putRealDataFuturesTransaction;
    case "display":
      return marketType === "stock"
        ? api.putRealDataStockDisplay
        : api.putRealDataFuturesDisplay;
    default:
      return marketType === "stock"
        ? api.putRealDataStockOrder
        : api.putRealDataFuturesOrder;
  }
};

const getDeleteRealDataApiByType = (fileType, marketType) => {
  switch (fileType) {
    case "transaction":
      return marketType === "stock"
        ? api.deleteRealDataStockTransaction
        : api.deleteRealDataFuturesTransaction;
    case "display":
      return marketType === "stock"
        ? api.deleteRealDataStockDisplay
        : api.deleteRealDataFuturesDisplay;
    default:
      return marketType === "stock"
        ? api.deleteRealDataStockOrder
        : api.deleteRealDataFuturesOrder;
  }
};

const getPostRealDataContentApiByType = (fileType, marketType) => {
  switch (fileType) {
    case "transaction":
      return marketType === "stock"
        ? api.postRealDataStockTransactionContent
        : api.postRealDataFuturesTransactionContent;
    case "display":
      return marketType === "stock"
        ? api.postRealDataStockDisplayContent
        : api.postRealDataFuturesDisplayContent;
    default:
      return marketType === "stock"
        ? api.postRealDataStockOrderContent
        : api.postRealDataFuturesOrderContent;
  }
};

const getRealData = async (fileType, marketType, page) => {
  const { url, method } = getGetRealDataApiByType(fileType, marketType);
  return defaultAxios({
    url,
    method,
    params: {
      page,
    },
  });
};

const postRealData = async (id, fileType, marketType) => {
  const { url, method } = getPostRealDataApiByType(fileType, marketType);
  return defaultAxios({
    url,
    method,
    data: { id },
  });
};

const putRealData = async (id, fileType, marketType) => {
  const { url, method } = getPutRealDataApiByType(fileType, marketType);
  return defaultAxios({
    url,
    method,
    data: { id },
  });
};

const deleteRealData = async (ids, fileType, marketType) => {
  const { url, method } = getDeleteRealDataApiByType(fileType, marketType);
  return defaultAxios({
    url,
    method,
    data: ids,
  });
};

const postRealDataContent = async (id, fileType, marketType, data) => {
  const { url, method } = getPostRealDataContentApiByType(fileType, marketType);
  return defaultAxios({
    url,
    method,
    data,
    params: { id },
  });
};

const UploadProgress = ({ file, isLoading, fileType, marketType }) => {
  const [progress, setProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState();
  const [isError, setIsError] = useState(false);
  const isFirstUpload = useRef(true);
  const restString = useRef("");

  const handleNextProgress = useCallback(() => {
    if (progress < currentFile.size) {
      const ADDER = Math.min(ADDER_CONST, currentFile.size - progress);

      const partFile = currentFile.slice(progress, progress + ADDER);
      const fileReader = new FileReader();
      fileReader.addEventListener("load", (e) => {
        const result = e.target.result.split("\n");
        result[0] = restString.current + result[0];
        restString.current = result[result.length - 1];
        result.pop();

        // insert real data content
        check(2);
        let insertArr = [];
        if (result.length < 1000) insertArr.push(result);
        else {
          let cnt = 0;
          while (cnt < result.length) {
            insertArr.push(result.slice(cnt, cnt + 1000));
            cnt += 1000;
          }
        }
        Promise.all(
          insertArr.map((arr) => {
            return postRealDataContent(
              currentFile.name,
              fileType,
              marketType,
              arr
            );
          })
        )
          .then(() => {
            setProgress(progress + ADDER);
          })
          .catch((err) => {
            errorNotification(err?.response?.data);
            setIsError(true);
          });
      });
      fileReader.readAsText(partFile);
    } else {
      putRealData(currentFile.name, fileType, marketType)
        .then(() => {
          // toggle real data status
          check(3);
        })
        .catch((err) => {
          errorNotification(err?.response?.data);
          setIsError(true);
        });
    }
  }, [currentFile, progress, fileType, marketType]);

  useEffect(() => {
    //TODO 在按一次上傳 file為何會變??
    setCurrentFile(file);
    setProgress(0);
  }, [file]);

  useEffect(() => {
    if (isLoading && currentFile && fileType) {
      if (isFirstUpload.current) {
        postRealData(currentFile.name, fileType, marketType)
          .then(() => {
            isFirstUpload.current = false;
            handleNextProgress();
            //insert real data
            check(1);
          })
          .catch((err) => {
            errorNotification(err?.response?.data);
            setIsError(true);
          });
      } else handleNextProgress();
    }
  }, [isLoading, currentFile, fileType, marketType, handleNextProgress]);

  return currentFile ? (
    <div>
      {currentFile.name}{" "}
      {isError
        ? "ERROR"
        : ((progress / currentFile.size) * 100).toFixed(2) + "%"}
    </div>
  ) : (
    <div />
  );
};

const ContentContainer = ({ fileType, marketType }) => {
  const [fileList, setFileList] = useState([]);
  const [isLoadingList, setIsLoadingList] = useState([]);
  const [realData, setRealData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalSize, setTotalSize] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleGetRealData = useCallback(() => {
    getRealData(fileType, marketType, { page, pageSize }).then(({ data }) => {
      setRealData(data.content);
      setTotalSize(data.totalSize);
      setIsLoading(false);
    });
  }, [page, pageSize, fileType, marketType]);

  useEffect(() => {
    handleGetRealData();
  }, [handleGetRealData]);

  return (
    <div>
      <input
        type="file"
        multiple
        onChange={(e) => {
          const { files } = e.target;
          const fileArray = Array.from(files);
          setFileList(fileArray);
          setIsLoadingList([...new Array(fileArray.length)].fill(false));
        }}
      />
      <Button
        type="primary"
        onClick={() => {
          setIsLoadingList(isLoadingList.map(() => true));
        }}
      >
        上傳
      </Button>
      <Button
        type="primary"
        danger
        onClick={() => {
          Modal.error({
            closable: true,
            content: "確定要刪除嗎?",
            maskClosable: true,
            okText: "確定",
            onOk: () => {
              setIsLoading(true);
              const ids = realData
                .filter((v) => v.isFinished === 0)
                .map((v) => v.id);
              deleteRealData(ids, fileType, marketType).then(() => {
                handleGetRealData();
              });
            },
          });
        }}
      >
        刪除未完成
      </Button>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {fileList.map((file, index) => {
          return (
            <UploadProgress
              key={Math.random()}
              file={file}
              isLoading={isLoadingList[index]}
              fileType={fileType}
              marketType={marketType}
            />
          );
        })}
      </div>
      <Table
        loading={isLoading}
        dataSource={realData.map((v) => {
          return {
            key: Math.random(),
            ...v,
          };
        })}
        columns={[
          {
            title: "檔名",
            dataIndex: "id",
            key: Math.random(),
          },
          {
            title: "已完成",
            dataIndex: "isFinished",
            render: (data) => {
              return data === 0 ? "否" : "是";
            },
            key: Math.random(),
          },
          {
            title: "刪除",
            dataIndex: "action",
            render: (data, { id }) => (
              <Button
                type="link"
                shape="circle"
                className="inline-flex justify-center items-center"
                onClick={() => {
                  Modal.error({
                    closable: true,
                    content: `確定要刪除${id}嗎?`,
                    maskClosable: true,
                    okText: "確定",
                    onOk: () => {
                      setIsLoading(true);
                      deleteRealData([id], fileType, marketType).then(() => {
                        handleGetRealData();
                      });
                    },
                  });
                }}
                icon={<DeleteOutlined />}
              />
            ),
          },
        ]}
        scroll={{
          y: "500px",
        }}
        pagination={{
          pageSize: pageSize,
          total: totalSize,
          onChange: (page) => {
            setPage(page);
          },
          onShowSizeChange: (cur, size) => {
            setPageSize(size);
          },
        }}
      />
    </div>
  );
};

const RealDataUpload = () => {
  return (
    <div style={{ textAlign: "center" }}>
      <span style={{ color: "red" }}>
        若"已完成"為否 請將該筆資料刪除後再重新上傳
      </span>
      {[
        { marketType: "stock", title: "證交" },
        { marketType: "futures", title: "期交" },
      ].map(({ marketType, title }) => {
        return (
          <div
            style={{ marginTop: "20px", marginBottom: "20px" }}
            key={Math.random()}
          >
            {title}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
              }}
            >
              <div>
                委託檔
                <ContentContainer fileType="order" marketType={marketType} />
              </div>
              <div>
                成交檔
                <ContentContainer
                  fileType="transaction"
                  marketType={marketType}
                />
              </div>
              <div>
                揭示檔
                <ContentContainer fileType="display" marketType={marketType} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default RealDataUpload;
