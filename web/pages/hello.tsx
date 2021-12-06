import React, { FC, useEffect } from 'react';
import { useMutation } from 'urql';

const REGISTER_MUTA = `
  mutation($username: String!, $password: String!) {
    register(options: { username: $username, password: $password }) {
      user {
        id
        username
      }

      errorList {
        field
        message
      }
    }
  }
`

const Hello: FC = () => {
  const [, register] = useMutation(REGISTER_MUTA)
  useEffect(() => {
    console.log('useEffect');
    
    register({ username: 'zengxin02', password: 'zengxin02' });
  }, []);
  return (
    <div>
      hello world
    </div>
  )
}

export default Hello;
