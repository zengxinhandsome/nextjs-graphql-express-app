import type { NextPage } from 'next';
import { withUrqlClient } from 'next-urql';
import NavBar from '../components/Navbar';
import { usePostsQuery } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { Avatar, Card, List, Spin } from 'antd';
import React from 'react';

const Home: NextPage = () => {
  const [{ data: postsRes, fetching: fetchingPosts }] = usePostsQuery({
    variables: {
      limit: 50,
    },
  });

  const posts = postsRes?.posts.data?.posts || [];

  return (
    <div className="bg-gray-100 h-full">
      <NavBar />

      <Card className="w-4/5 m-auto mt-5">
        <Spin spinning={fetchingPosts}>
          <List
            itemLayout="horizontal"
            dataSource={posts}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Avatar src="https://p9-passport.byteacctimg.com/img/mosaic-legacy/3795/3044413937~120x256.image" />
                  }
                  title={<a className="text-sm">{item.creator.username}</a>}
                  description={item.title}
                />
                {item.textSnippet}
              </List.Item>
            )}
          />
        </Spin>
      </Card>
    </div>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Home);
