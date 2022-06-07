import React, { useState, useEffect } from "react";
import { Table, Button, Space, Form, Input, DatePicker } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import CreateAndEdit from "./modal";
import { api, defaultAxios } from "../../environment/api";
import errorNotification from "../../utils/errorNotification";
import dayjs from "dayjs";

const TYPE_MAPPING = ["現股", "ETF", "權證"];

const Stock = () => {
  const [data, setData] = useState([]);
  const [totalSize, setTotalSize] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchCondition, setSearchCondition] = useState({});
  const [selectStock, setSelectStock] = useState([]);
  const [visible, setVisible] = useState(false);
  const [reloadData, setReloadData] = useState(0);
  const [editData, setEditData] = useState();
  function deleteAxios(id) {
    defaultAxios({
      url: api.deleteStock.url,
      method: api.deleteStock.method,
      data: {
        id,
      },
    })
      .then(() => {
        setReloadData(Math.random());
        setSelectStock([]);
      })
      .catch((err) => {
        errorNotification(err?.response?.data);
      });
  }
  useEffect(() => {
    defaultAxios({
      url: api.getStock.url,
      method: api.getStock.method,
      params: {
        page: { page: page, pageSize: pageSize },
        ...searchCondition,
      },
    })
      .then((res) => {
        setData(res.data.content);
        setTotalSize(res.data.totalSize);
      })
      .catch((err) => {
        errorNotification(err?.response?.data);
      });
  }, [page, pageSize, searchCondition, reloadData]);
  useEffect(() => {
    if (!visible) {
      setEditData(null);
    }
  }, [visible]);
  return (
    <div className="p-4">
      <CreateAndEdit
        initVal={editData}
        isVisible={visible}
        setIsVisible={setVisible}
        reload={setReloadData}
      />
      <Form
        layout="vertical"
        className="grid grid-cols-3 gap-x-4"
        onFinish={(value) => {
          if (value.createdTime) {
            setSearchCondition({
              ...value,
              createdTime: {
                min: value.createdTime[0],
                max: value.createdTime[1],
              },
            });
          } else setSearchCondition(value);
        }}
      >
        <Form.Item label="ID" name="id">
          <Input />
        </Form.Item>
        <Form.Item label="收盤價格" name="closedPrice">
          <Input.Group className="grid grid-cols-11 gap-x-4">
            <Form.Item name={["closedPrice", "min"]} noStyle>
              <Input
                type="number"
                min={0}
                className="col-span-5"
                placeholder="Minimum"
              />
            </Form.Item>
            <span className="p-0 col-span-1 text-center">~</span>
            <Form.Item name={["closedPrice", "max"]} noStyle>
              <Input
                type="number"
                min={0}
                className="col-span-5"
                placeholder="Maximum"
              />
            </Form.Item>
          </Input.Group>
        </Form.Item>
        <Form.Item label="漲跌幅" name="priceLimit">
          <Input.Group className="grid grid-cols-11 gap-x-4">
            <Form.Item name={["priceLimit", "min"]} noStyle>
              <Input
                type="number"
                min={0}
                className="col-span-5"
                placeholder="Minimum"
              />
            </Form.Item>
            <span className="p-0 col-span-1 text-center">~</span>
            <Form.Item name={["priceLimit", "max"]} noStyle>
              <Input
                type="number"
                min={0}
                className="col-span-5"
                placeholder="Maximum"
              />
            </Form.Item>
          </Input.Group>
        </Form.Item>
        <Form.Item label="最近價格" name="currentPrice">
          <Input.Group className="grid grid-cols-11 gap-x-4">
            <Form.Item name={["currentPrice", "min"]} noStyle>
              <Input
                type="number"
                min={0}
                className="col-span-5"
                placeholder="Minimum"
              />
            </Form.Item>
            <span className="p-0 col-span-1 text-center">~</span>
            <Form.Item name={["currentPrice", "max"]} noStyle>
              <Input
                type="number"
                min={0}
                className="col-span-5"
                placeholder="Maximum"
              />
            </Form.Item>
          </Input.Group>
        </Form.Item>
        <Form.Item label="建立時間" name="createdTime">
          <DatePicker.RangePicker className="w-full" />
        </Form.Item>
        <Form.Item label=" ">
          <div className="grid grid-cols-2 justify-end gap-4">
            <Button type="primary" htmlType="submit">
              搜尋
            </Button>
            <Button htmlType="reset">清空</Button>
          </div>
        </Form.Item>
      </Form>
      <Space size="small" className="mb-4">
        <Button type="primary" onClick={() => setVisible(true)}>
          新增股票
        </Button>
        <Button
          type="primary"
          danger
          disabled={!selectStock.length}
          onClick={() => deleteAxios(selectStock)}
        >
          刪除所選股票
        </Button>
      </Space>
      <Table
        dataSource={data}
        rowKey="id"
        columns={[
          {
            title: "ID",
            dataIndex: "id",
          },
          {
            title: "最近價格",
            dataIndex: "currentPrice",
          },
          {
            title: "收盤價格",
            dataIndex: "closedPrice",
          },
          {
            title: "漲跌幅(%)",
            dataIndex: "priceLimit",
          },
          {
            title: "類別",
            dataIndex: "type",
            render: (data) => <span>{TYPE_MAPPING[data]}</span>,
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
            title: "建立時間",
            dataIndex: "createdTime",
            width: 200,
            render: (data) => (
              <span>{dayjs(data).format("YYYY/MM/DD HH:mm:ss")}</span>
            ),
          },
          {
            title: "修改 / 刪除",
            render: (data, record) => (
              <Space size="small">
                <Button
                  type="text"
                  shape="circle"
                  icon={<EditOutlined />}
                  onClick={() => {
                    setEditData(record);
                    setVisible(true);
                  }}
                />
                <Button
                  type="text"
                  shape="circle"
                  icon={<DeleteOutlined />}
                  onClick={() => {
                    deleteAxios([data.id]);
                  }}
                />
              </Space>
            ),
          },
        ]}
        rowSelection={{
          onChange: (key) => {
            setSelectStock(key);
          },
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

export default Stock;
