import { useRouter } from 'next/router';
import { Form, Input, Button, Checkbox, message } from 'antd';
import { useRegisterMutation } from '../generated/graphql';

const Register = () => {
  const router = useRouter();
  const [, register] = useRegisterMutation();
  const onFinish = (values: any) => {
    console.log('Success:', values);
    register(values).then(({ data }) => {
      const response = data?.register
      if (response?.code === 0) {
        message.success('注册成功');
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
          Register
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Register