import { Button, Form, Input, message } from 'antd';
import { withUrqlClient } from 'next-urql';
import Layout from '../components/Layout';
import { useCreatePostMutation } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';

const CreatePost = () => {
  const [, createPost] = useCreatePostMutation();
  const onFinish = (values: { title: string; text: string }) => {
    createPost({ title: values.title, text: values.text }).then(res => {
      const data = res.data?.createPost;
      if (data?.code === 0) {
        message.success('发布成功');
      }
    });
  };

  return (
    <Layout>
      <Form className="w-2/4 mx-auto pt-20" labelCol={{ span: 6 }} name="basic" onFinish={onFinish}
      >
        <Form.Item
          label="标题"
          name="title"
          rules={[
            {
              required: true,
              message: '请输入标题',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="内容"
          name="text"
          rules={[
            {
              required: true,
              message: '请输入内容',
            },
          ]}
        >
          <Input.TextArea />
        </Form.Item>

        <Form.Item>
          <div className="flex flex-row-reverse items-center">
            <Button type="primary" htmlType="submit">
              确定
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(CreatePost);