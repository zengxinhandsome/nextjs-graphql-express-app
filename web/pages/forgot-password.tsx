import { Button, Form, Input, message } from 'antd';
import { NextPage } from 'next';
import { withUrqlClient } from 'next-urql';
import React from 'react';
import { useForgotPasswordMutation } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';

const ForgotPassword: NextPage = () => {
  const [{ fetching }, forgotPassword] = useForgotPasswordMutation()

  const onFinish = (values: { email: string }) => {
    forgotPassword({ email: values.email }).then(res => {
      const data = res.data?.forgotPassword;
      if (data?.code === 0) {
        message.success('重置密码的地址已发送至您的邮箱！');
      }
    });
  }

  return (
    <Form
      className="w-2/4 mx-auto pt-20"
      labelCol={{ span: 6 }}
      name="basic"
      onFinish={onFinish}
    >
      <Form.Item
        label="邮箱"
        name="email"
        rules={[
          {
            required: true,
            message: '请输入邮箱地址',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item>
        <div className="flex flex-row-reverse items-center">
          <Button type="primary" htmlType="submit" loading={fetching}>
            确认
          </Button>
        </div>
      </Form.Item>
    </Form>
  )
}

export default withUrqlClient(createUrqlClient)(ForgotPassword);
