import React, { FC } from 'react';
import { useRouter } from 'next/router';
import { useMeQuery, useLogoutMutation } from '../generated/graphql';
import { Button, message, Spin } from 'antd';
import { isServer } from '../constants/common';
// import { withUrqlClient } from 'next-urql';
// import { createUrqlClient } from '../../utils/createUrqlClient';

const NavBar: FC = () => {
  const router = useRouter();
  const [{ data: userRes, fetching: fetchingUser }, getUserInfo] = useMeQuery({
    pause: isServer,
  });
  const [, logout] = useLogoutMutation();

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

  const renderBtns = () => {
    if (userInfo) {
      return (
        <div className="flex items-center">
          <Spin spinning={fetchingUser}>
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

  return <div className="h-16 bg-white flex justify-end align-middle">{renderBtns()}</div>;
};

export default NavBar;
