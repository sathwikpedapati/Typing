import React from 'react';
import { Spin, Card, Flex, Typography, Form, Input, Button, Alert } from 'antd';
import{Link} from "react-router-dom";
import register from "../assets/Signup.png"
import useSignup from '../hooks/useSignup';

const Signup = () => {
  const { loading, error, registeredUser }=useSignup();
  const handleregister = (values) => {
    registeredUser(values);
  };

  return (
    <Card className='form-container'>
        <Flex  gap="large" align='center'>
      <Flex vertical flex={1}>
        <Typography.Title level={3} className='title'>
          Create an Account
        </Typography.Title>
        <Typography.Text type='secondary' className='slogan'>
          Join for exclusive access!
        </Typography.Text>
        <Form layout="vertical" onFinish={handleregister} autoComplete="off">
        <Form.Item
  label="Full Name"
  name="name"
  rules={[
    {
      required: true,
      message: "Please input your full name!",
    },
  ]}
>
  <Input 
    size="large" 
    placeholder="Enter your full name" 
    autoComplete="name" 
  />
</Form.Item>

<Form.Item
  label="Email"
  name="email"
  rules={[
    {
      required: true,
      message: "Please input your Email-Id",
    },
    {
      type: 'email',
      message: "The input is not valid Email",
    },
  ]}
>
  <Input 
    size="large" 
    placeholder="Enter your Email-Id" 
    autoComplete="username" 
  />
</Form.Item>

          <Form.Item
  label="Password"
  name="password"
  rules={[
    {
      required: true,
      message: "Please input your Password",
    }
  ]}
>
  <Input.Password 
    size="large" 
    placeholder="Enter your Password" 
    autoComplete="new-password" 
  />
</Form.Item>

<Form.Item
  label="Confirm Password"
  name="confirmPassword"
  rules={[
    {
      required: true,
      message: "Please input your Confirm Password",
    }
  ]}
>
  <Input.Password 
    size="large" 
    placeholder="Re-Enter your Password" 
    autoComplete="new-password"
  />
</Form.Item>
          <Form.Item>
            {
                error&& <Alert description={error} type='error' showIcon closable className='alert'/>
            }
          </Form.Item>
          <Form.Item>
            <Button type={`${loading?"":"primary"}`}
              htmlType='submit' size='large' className='btn'>
               {loading ? <Spin /> : "Create Account"}
            </Button>
          </Form.Item>
          <Form.Item>
            <Link  to="/login">
            <Button size='large' className='btn'>
               Sign In
            </Button>
            </Link>
          </Form.Item>
        </Form>
      </Flex>
      <Flex flex={1} >
      <img src={register} alt="Register Illustration" className='authImage' />
      </Flex>
      </Flex>
    </Card>
  );
};

export default Signup;
