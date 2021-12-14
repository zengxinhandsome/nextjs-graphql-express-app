import type { NextPage } from 'next'
import { withUrqlClient } from 'next-urql'
import NavBar from '../components/Navbar'
import { usePostsQuery } from '../generated/graphql'
import { createUrqlClient } from '../utils/createUrqlClient'

const Home: NextPage = () => {
  const [{ data: postsRes, fetching: fetchingPosts }] = usePostsQuery();

  const posts = postsRes?.posts.data || [];

  return (
    <>
      <NavBar />
      {
        fetchingPosts ? 'loading' : (
          posts.map(p => <div key={p.id}>{p.title}</div>)
        )
      }
    </>
  )
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Home);
