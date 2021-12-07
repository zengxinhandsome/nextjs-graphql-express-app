import React, { FC } from 'react';
import { useRouter } from 'next/router';
import { useMeQuery, useLogoutMutation } from '../../generated/graphql';
import { message, Spin } from 'antd';
import { isServer } from '../../constants/common';
// import { withUrqlClient } from 'next-urql';
// import { createUrqlClient } from '../../utils/createUrqlClient';

const NavBar: FC = () => {
  console.log('NavBar');

  const router = useRouter();
  const [{ data: userRes, fetching: fetchingUser }, getUserInfo] = useMeQuery({
    pause: isServer
  });
  const [, logout] = useLogoutMutation();

  const userInfo = userRes?.me.data;

  console.log('userInfo: ', userRes);


  const handleRegister = () => {
    router.push('/register');
  }

  const handleLogin = () => {
    router.push('/login');
  }

  const handleLogout = () => {
    logout().then(res => {
      if (res.data?.logout.code === 0) {
        message.success('退出登录成功');
        getUserInfo({ requestPolicy: 'network-only' });
      }
    })
  }

  return (
    <div className="h-16 bg-gray-500 flex flex-row-reverse items-center pr-5">
      <div></div>
      <div>
        <span className="text-white text-base cursor-pointer">
          {
            userInfo ? (
              <Spin spinning={fetchingUser}>
                <span className="mr-2 text-green-500">{userInfo?.username}</span>
                <span className="mr-2" onClick={handleLogout}>退出登录</span>
              </Spin>
            ) : (
              <>
                <span className="mr-2" onClick={handleRegister}>注册</span>
                <span onClick={handleLogin}>登录</span>
              </>
            )
          }
        </span>
      </div>
    </div>
  )
}

export default NavBar;
