import React from "react";
import { Modal, Form, Input } from "antd";
import { defaultAxios, api } from "../../environment/api";
import errorNotification from "../../utils/errorNotification";
import { notification } from "antd";

const Create = ({ visible, setVisible }) => {
  const [form] = Form.useForm();

  return (
    <Modal
      title="註冊"
      visible={visible}
      onOk={() => {
        form.submit();
      }}
      onCancel={() => {
        form.resetFields();
        setVisible(false);
      }}
      okText="確認"
      cancelText="取消"
    >
      <Form
        name="basic"
        layout="vertical"
        form={form}
        onFinish={(value) => {
          defaultAxios({
            url: api.postInvestor.url,
            method: api.postInvestor.method,
            data: value,
          })
            .then(() => {
              notification.success({
                message: "認證信進已寄出",
                description: "請至信箱開通該帳號",
              });
            })
            .catch((err) => {
              errorNotification(err?.response?.data);
            })
            .finally(() => {
              form.resetFields();
              setVisible(false);
            });
        }}
        initialValues={{ remember: true }}
      >
        <Form.Item
          label="帳戶名稱"
          name="account"
          rules={[{ required: true, message: "請輸入帳戶名稱" }]}
        >
          <Input placeholder="請輸入帳戶名稱" />
        </Form.Item>
        <Form.Item
          label="密碼"
          name="password"
          rules={[{ required: true, message: "請輸入密碼" }]}
        >
          <Input placeholder="請輸入密碼" />
        </Form.Item>
        <Form.Item
          label="電子郵件"
          name="mail"
          rules={[{ required: true, message: "請輸入電子郵件" }]}
        >
          <Input placeholder="請輸入電子郵件" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Create;
