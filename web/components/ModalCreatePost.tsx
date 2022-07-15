import { Form, Input, message, Modal } from 'antd';
import React, { FC } from 'react';
import { useCreatePostMutation } from '../generated/graphql';

interface IProps {
  visible: boolean;
  closeModal: () => void;
}

const ModalCreatePost: FC<IProps> = ({ visible, closeModal }) => {
  const [{ data, fetching }, createPost] = useCreatePostMutation();
  const handleOk = () => {};

  const onFinish = (values: { title: string; text: string }) => {
    createPost(values).then(() => {
      message.success('发表成功');
      closeModal();
    });
  };
  return (
    <Modal
      visible={visible}
      width={500}
      onCancel={closeModal}
      title="写文章"
      onOk={() => handleOk()}
      okButtonProps={{
        form: 'post-form',
        htmlType: 'submit',
        loading: fetching,
      }}
    >
      <Form
        name="post-form"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
        onFinish={onFinish}
        initialValues={{
          title: '',
          text: '',
        }}
        autoComplete="off"
      >
        <div className="ant-form-margin-12">
          <Form.Item label="标题" name="title" rules={[{ required: true, message: '请输入标题' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="内容" name="text" rules={[{ required: true, message: '请输入内容' }]}>
            <Input.TextArea />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default ModalCreatePost;
