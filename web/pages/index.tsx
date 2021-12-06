import type { NextPage } from 'next'
import styles from '../styles/Home.module.css'
import { useLogoutMutation, useMeQuery } from '../generated/graphql'
import { useEffect } from 'react'
import { Spin, Button, message } from 'antd'
import { useRouter } from 'next/router'

const Home: NextPage = () => {
  console.log('home page');

  const router = useRouter();
  const [{ data, fetching }, getUserInfo] = useMeQuery();


  const [, logout] = useLogoutMutation();
  const response = data?.me;
  const userName = response?.data?.username || 'not login';

  const handleLogout = () => {
    logout().then(res => {
      if (res.data?.logout.code === 0) {
        message.success('退出登录成功');
        getUserInfo({ requestPolicy: 'network-only' });
      }
    })
  }

  return (
    <Spin spinning={fetching}>
      <div className={styles.wrapper}>
        <h1>
          {userName}
          <Button onClick={handleLogout}>退出登录</Button>
        </h1>
      </div>
    </Spin>
  )
}

export default Home
