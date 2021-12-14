import { useRouter } from 'next/router';
import { Form, Input, Button, Checkbox, message } from 'antd';
import { useRegisterMutation } from '../generated/graphql';
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../utils/createUrqlClient';

const Register = () => {
  const router = useRouter();
  const [, register] = useRegisterMutation();
  const onFinish = (values: any) => {
    register(values).then((registerRes) => {
      const data = registerRes.data?.register;
      if (data?.code === 0) {
        message.success('注册成功');
        router.push('/');
      }
    });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      style={{ width: '600px', margin: '0 auto', paddingTop: '60px' }}
      name="basic"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        label="Username"
        name="username"
        rules={[
          {
            required: true,
            message: 'Please input your username!',
            validator: (rule, value, callback) => {
              if (value.includes('@')) {
                callback('用户名不能包含 @')
              } else {
                callback();
              }
            }
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        rules={[
          {
            required: true,
            message: 'Please input your email!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[
          {
            required: true,
            message: 'Please input your password!',
          },
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Register
        </Button>
      </Form.Item>
    </Form>
  );
};

export default withUrqlClient(createUrqlClient)(Register);