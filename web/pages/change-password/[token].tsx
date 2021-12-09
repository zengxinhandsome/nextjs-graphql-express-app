import { Button, Form, Input, message } from "antd";
import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import { useRouter } from 'next/router'
import React from "react";
import { useChangePasswordMutation } from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";

const changePassword: NextPage<{ token: string }> = ({ token }) => {
  const [, changePassword] = useChangePasswordMutation();
  const router = useRouter()

  const onFinish = (values: { newPassword: string }) => {
    changePassword({ newPassword: values.newPassword, token }).then((res) => {
      const data = res.data?.changePassword;
      if (data?.code === 0) {
        message.success('修改成功');
        setTimeout(() => {
          router.push('/');
        }, 500);
      } else {
        message.error(data?.message || 'error');
      }
    });
  }

  return (
    <Form
      style={{ width: '600px', margin: '0 auto', paddingTop: '60px' }}
      name="basic"
      onFinish={onFinish}
    >
      <Form.Item
        label="新密码"
        name="newPassword"
        rules={[
          {
            required: true,
            message: 'Please input your newPassword',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          确认修改
        </Button>
      </Form.Item>
    </Form>
  )
}

changePassword.getInitialProps = ({ query }) => {
  const { token } = query;
  return { token: token as string };
}

export default withUrqlClient(createUrqlClient)(changePassword);