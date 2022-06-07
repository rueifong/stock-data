import React, { useEffect } from "react";
import { Modal, Form, Input, Select } from "antd";
import { defaultAxios, api } from "../../environment/api";
import errorNotification from "../../utils/errorNotification";

const Create = ({
  visible,
  setVisible,
  defaultValue,
  reset,
  permission = [],
}) => {
  const [form] = Form.useForm();
  useEffect(() => {
    console.log(defaultValue, "de");
    if (defaultValue) {
      form.setFieldsValue(defaultValue);
    }
  }, [defaultValue]);
  return (
    <Modal
      title={defaultValue ? "修改角色" : "新增角色"}
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
          if (defaultValue) {
            defaultAxios({
              url: api.putRole.url,
              method: api.putRole.method,
              data: { ...value, id: defaultValue.id },
            })
              .catch((err) => {
                errorNotification(err?.response?.data);
              })
              .finally(() => {
                reset(Math.random());
                form.resetFields();
                setVisible(false);
              });
          } else {
            defaultAxios({
              url: api.postRole.url,
              method: api.postRole.method,
              data: value,
            })
              .catch((err) => {
                errorNotification(err?.response?.data);
              })
              .finally(() => {
                reset(Math.random());
                form.resetFields();
                setVisible(false);
              });
          }

          console.log(value);
        }}
        initialValues={{ remember: true }}
      >
        <Form.Item
          label="角色名稱"
          name="name"
          rules={[{ required: true, message: "請輸入角色" }]}
        >
          <Input placeholder="請輸入角色名稱" />
        </Form.Item>
        <Form.Item
          label="每日請求上限"
          name="totalApiTime"
          rules={[
            { required: true, message: "請輸入上限" },
            {
              validator: (_, value) => {
                if (value > 0) return Promise.resolve();
                return Promise.reject("不可小於1");
              },
            },
          ]}
        >
          <Input type="number" placeholder="請輸入數字" />
        </Form.Item>
        <Form.Item
          label="可瀏覽頁面"
          name="permissions"
          rules={[{ required: true, message: "請選擇" }]}
        >
          <Select
            mode="multiple"
            placeholder="請選擇"
            options={permission.map((val) => ({ value: val, label: val }))}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Create;
