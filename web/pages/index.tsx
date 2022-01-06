import type { NextPage } from 'next';
import { withUrqlClient } from 'next-urql';
import NavBar from '../components/Navbar';
import { usePostsQuery } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';
import { Card, List, Spin } from 'antd';

const Home: NextPage = () => {
  const [{ data: postsRes, fetching: fetchingPosts }] = usePostsQuery({
    variables: {
      limit: 50,
    },
  });

  const posts = postsRes?.posts.data?.posts || [];

  return (
    <div className="bg-gray-100">
      <NavBar />

      <Card className="w-4/5 m-auto mt-5">
        <Spin spinning={fetchingPosts}>
          <List
            itemLayout="horizontal"
            dataSource={posts}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta title={<a>{item.title}</a>} description={item.textSnippet} />
              </List.Item>
            )}
          />
        </Spin>
      </Card>
    </div>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Home);
