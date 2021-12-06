import { useRouter } from 'next/router';
import { Form, Input, Button, Checkbox, message } from 'antd';
import { useLoginMutation } from '../generated/graphql';

const Login = () => {
  const router = useRouter();
  const [, login] = useLoginMutation();
  const onFinish = (values: any) => {
    console.log('Success:', values);
    login(values).then(({ data }) => {
      const response = data?.login
      if (response?.code === 0) {
        message.success('登录成功');
        router.push('/');
        return;
      }
      message.error(response?.message);
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
          Login
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Login