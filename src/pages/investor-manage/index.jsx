import React, { useEffect, useState } from "react";
import { defaultAxios, api } from "../../environment/api";
import errorNotification from "../../utils/errorNotification";
import { Table, Button, Row, Col, Select, Modal, Typography } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import Create from "./create";
import dayjs from "dayjs";

const { confirm } = Modal;
const { Title } = Typography;
const InvestorManagement = () => {
  const [investorData, setInvestorData] = useState([]);
  const [roleData, setRoleData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalSize, setTotalSize] = useState(0);
  const [visible, setVisible] = useState(false);
  const [reset, setReset] = useState(0);
  const [editValue, setEditValue] = useState();
  const [checked, setChecked] = useState([]);

  function showDeleteConfirm(id) {
    confirm({
      title: "確定要刪除?",
      icon: <ExclamationCircleOutlined />,
      content: "刪除後將無法復原",
      okText: "確定",
      okType: "danger",
      cancelText: "取消",
      onOk() {
        defaultAxios({
          url: api.deleteInvestor.url,
          method: api.deleteInvestor.method,
          data: {
            id,
          },
        })
          .catch((err) => {
            errorNotification(err?.response?.data);
          })
          .finally(() => {
            setChecked([]);
            setReset(Math.random());
          });
      },
    });
  }

  useEffect(() => {
    defaultAxios({
      url: api.getRole.url,
      method: api.getRole.method,
    })
      .then((res) => {
        console.log(res.data);
        setRoleData(res.data.content);
      })
      .catch((err) => {
        errorNotification(err?.response?.data);
      });
  }, []);

  useEffect(() => {
    defaultAxios({
      url: api.getInvestor.url,
      method: api.getInvestor.method,
      params: {
        page: { page, pageSize },
      },
    })
      .then((res) => {
        console.log(res.data);
        setInvestorData(res.data.content);
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
        role={roleData}
      />
      <div className="flex justify-end my-5">
        <Button
          disabled={!checked.length}
          type="default"
          className="mr-4"
          onClick={() => showDeleteConfirm(checked)}
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
          新增帳戶
        </Button>
      </div>
      <Table
        rowKey="id"
        rowSelection={{
          type: "checkbox",
          ...rowSelection,
        }}
        columns={[
          {
            title: "名稱",
            dataIndex: "account",
          },
          {
            title: "憑證",
            dataIndex: "token",
          },

          {
            title: "剩餘請求次數",
            dataIndex: "restApiTime",
          },
          {
            title: "角色",
            dataIndex: "role",
            render: (data) => data.name,
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
            render: (_, record) => (
              <span>
                <Button
                  type="link"
                  shape="circle"
                  className="inline-flex justify-center items-center mr-2"
                  icon={<EditOutlined />}
                  onClick={() => {
                    setEditValue({
                      id: record.id,
                      account: record.account,
                      password: record.password,
                      restApiTime: record.restApiTime,
                      roleId: record.role.id,
                    });
                    setVisible(true);
                  }}
                />
                <Button
                  type="link"
                  shape="circle"
                  className="inline-flex justify-center items-center"
                  onClick={() => showDeleteConfirm([record.id])}
                  icon={<DeleteOutlined />}
                />
              </span>
            ),
          },
        ]}
        dataSource={investorData}
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

export default InvestorManagement;
