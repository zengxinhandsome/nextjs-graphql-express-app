import React, { FC, useState } from 'react';
import { useRouter } from 'next/router';
import { useMeQuery, useLogoutMutation } from '../generated/graphql';
import { Button, message, Spin, Avatar, Modal } from 'antd';
import { isServer } from '../constants/common';
// import { withUrqlClient } from 'next-urql';
// import { createUrqlClient } from '../../utils/createUrqlClient';
import ModalCreatePost from './ModalCreatePost';

const NavBar: FC = () => {
  const router = useRouter();
  const [{ data: userRes, fetching: fetchingUser }, getUserInfo] = useMeQuery({
    pause: isServer,
  });
  const [, logout] = useLogoutMutation();
  const [visible, setVisible] = useState<boolean>(false);

  const userInfo = userRes?.me.data;

  const handleRegister = () => {
    router.push('/register');
  };

  const handleLogin = () => {
    router.push('/login');
  };

  const handleLogout = () => {
    logout().then(res => {
      if (res.data?.logout.code === 0) {
        message.success('退出登录成功');
        getUserInfo({ requestPolicy: 'network-only' });
      }
    });
  };

  const handleCreatePost = () => {
    setVisible(true);
  };

  const renderBtns = () => {
    if (userInfo) {
      return (
        <div className="flex items-center">
          <Button type="link" onClick={handleCreatePost}>
            写文章
          </Button>
          <Spin spinning={fetchingUser}>
            <Avatar
              className="mr-3"
              src="https://p9-passport.byteacctimg.com/img/mosaic-legacy/3795/3044413937~120x256.image"
            />
            <span className="mr-2 text-green-500">{userInfo?.username}</span>
            <Button type="link" onClick={handleLogout}>
              退出登录
            </Button>
          </Spin>
        </div>
      );
    } else {
      return (
        <div className="flex items-center">
          <Button className="mr-5" type="primary" ghost onClick={handleRegister}>
            注册
          </Button>
          <Button className="mr-5" type="primary" ghost onClick={handleLogin}>
            登录
          </Button>
        </div>
      );
    }
  };

  return (
    <>
      <div className="h-16 bg-white flex justify-end align-middle">{renderBtns()}</div>
      <ModalCreatePost visible={visible} closeModal={() => setVisible(false)} />
    </>
  );
};

export default NavBar;
