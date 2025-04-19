import React from 'react';
import { Card, Flex, Typography, Form, Input, Button, Alert, Spin } from 'antd';
import { Link } from 'react-router-dom';
import login from '../assets/Log.png';
import useLogin from '../hooks/useLogin';

const Login = () => {
  const { loading, error, loggeduser } = useLogin();

  const handlelogin = async (values) => {
    await loggeduser(values);
  };

  return (
    <Card className='form-container'>
      <Flex gap='large' align='center'>
        <Flex flex={1}>
          <img src={login} alt='Login Illustration' className='authImage' />
        </Flex>
        <Flex vertical flex={1}>
          <Typography.Title level={3} className='title'>
            Sign-In
          </Typography.Title>
          <Typography.Text type='secondary' className='slogan'>
            Unlock your world..
          </Typography.Text>

          <Form layout='vertical' onFinish={handlelogin} autoComplete='off'>
            <Form.Item
              label='Email'
              name='email'
              rules={[
                { required: true, message: 'Please input your Email-Id' },
                { type: 'email', message: 'The input is not valid Email' },
              ]}
            >
              <Input size='large' placeholder='Enter your Email-Id' />
            </Form.Item>

            <Form.Item
              label='Password'
              name='password'
              rules={[{ required: true, message: 'Please input your Password' }]}
            >
              <Input.Password size='large' placeholder='Enter your Password' />
            </Form.Item>

            {error && (
              <Form.Item>
                <Alert
                  description={error}
                  type='error'
                  showIcon
                  closable
                  className='alert'
                />
              </Form.Item>
            )}

            <Form.Item>
              <Button
                type={loading ? '' : 'primary'}
                htmlType='submit'
                size='large'
                className='btn'
                disabled={loading}
              >
                {loading ? <Spin /> : 'Sign-In'}
              </Button>
            </Form.Item>

            <Form.Item>
              <Link to='/'>
                <Button size='large' className='btn'>
                  Create Account
                </Button>
              </Link>
            </Form.Item>
          </Form>
        </Flex>
      </Flex>
    </Card>
  );
};

export default Login;

