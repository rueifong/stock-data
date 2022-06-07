import React, { useEffect, useState } from "react";
import { defaultAxios, api } from "../../environment/api";
import errorNotification from "../../utils/errorNotification";
import { Table, Button, Row, Col, Select, Input, Typography } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import Create from "./create";
import dayjs from "dayjs";
import { StockSelector } from "../../component/stock-selector";
const { Search } = Input;
const { Title } = Typography;
const Case = () => {
  const [orederData, setOrderData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalSize, setTotalSize] = useState(0);
  const [visible, setVisible] = useState(false);
  const [reset, setReset] = useState(0);
  const [editValue, setEditValue] = useState();
  const [checked, setChecked] = useState([]);
  const [searchCondition, setSearchCondition] = useState({});
  useEffect(() => {
    defaultAxios({
      url: api.getContainer.url,
      method: api.getContainer.method,
      params: {
        ...searchCondition,
        page: { page, pageSize },
      },
    })
      .then((res) => {
        console.log(res.data);
        setOrderData(res.data.content);
        setTotalSize(res.data.totalSize);
      })
      .catch((err) => {
        errorNotification(err?.response?.data);
      });
  }, [page, pageSize, reset]);
  const rowSelection = {
    selectedRowKeys: checked,
    onChange: (selectedRowKeys, selectedRows) => {
      setChecked(selectedRows.map((deta) => deta.id));
    },
    preserveSelectedRowKeys: false,
  };
  return (
    <div className="px-10">
      <Create
        visible={visible}
        setVisible={setVisible}
        reset={setReset}
        defaultValue={editValue}
      />
      <Title level={5}>條件搜尋</Title>
      <Row
        className="mb-4 border border-gray-200 p-4"
        justify="space-around"
        align="bottom"
      >
        <Col span={6}>
          情境名稱
          <Input
            placeholder="輸入名稱"
            size="middle"
            onChange={(e) => {
              setSearchCondition({
                ...searchCondition,
                name: e.target.value,
              });
            }}
          />
        </Col>
        <Col span={6}>
          股票名稱
          <StockSelector
            style={{ width: "100%" }}
            onChange={(e) => {
              setSearchCondition({ ...searchCondition, stockId: e });
            }}
          />
        </Col>
        <Col span={2}>
          <Button
            onClick={() => {
              setReset(Math.random());
            }}
          >
            搜尋
          </Button>
        </Col>
      </Row>
      <div className="flex justify-end my-5">
        <Button
          disabled={!checked.length}
          type="default"
          className="mr-4"
          onClick={() => {
            defaultAxios({
              url: api.deleteContainer.url,
              method: api.deleteContainer.method,
              data: {
                id: checked,
              },
            })
              .catch((err) => {
                errorNotification(err?.response?.data);
              })
              .finally(() => {
                setChecked([]);
                setReset(Math.random());
              });
          }}
        >
          刪除勾選
        </Button>
        <Button
          type="primary"
          onClick={() => {
            setEditValue(null);
            setVisible(true);
          }}
        >
          新增情境
        </Button>
      </div>
      <Table
        rowKey={(record) => record.id}
        rowSelection={{
          type: "checkbox",
          ...rowSelection,
        }}
        columns={[
          // {
          //   title: "id",
          //   dataIndex: "id",
          //   render: (data) => <span>{data || "NULL"}</span>,
          //   sorter: (a, b) => a.id - b.id,
          // },
          {
            title: "股票 ID",
            dataIndex: "stockId",
          },
          {
            title: "情境名稱",
            dataIndex: "name",
          },
          {
            title: "創建時間",
            dataIndex: "createdTime",
            width: 200,
            render: (data) => (
              <span>{dayjs(data).format("YYYY/MM/DD HH:mm:ss")}</span>
            ),
          },
          {
            title: "更新時間",
            dataIndex: "updatedTime",
            width: 200,
            render: (data) => (
              <span>{dayjs(data).format("YYYY/MM/DD HH:mm:ss")}</span>
            ),
          },
          {
            title: "狀態",
            dataIndex: "action",
            render: (data, record) => (
              <span>
                <Button
                  type="link"
                  shape="circle"
                  className="inline-flex justify-center items-center mr-2"
                  icon={<EditOutlined />}
                  onClick={() => {
                    console.log(record, "data");
                    setEditValue({
                      id: record.id,
                      name: record.name,
                      stockId: record.stockId,
                    });
                    setVisible(true);
                  }}
                />
                <Button
                  type="link"
                  shape="circle"
                  className="inline-flex justify-center items-center"
                  onClick={() => {
                    defaultAxios({
                      url: api.deleteContainer.url,
                      method: api.deleteContainer.method,
                      data: {
                        id: [record.id],
                      },
                    })
                      .catch((err) => {
                        errorNotification(err?.response?.data);
                      })
                      .finally(() => {
                        setReset(Math.random());
                      });
                  }}
                  icon={<DeleteOutlined />}
                />
              </span>
            ),
          },
        ]}
        dataSource={orederData}
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
        sticky
      />
    </div>
  );
};

export default Case;
