import React from 'react';
import { Spin, Card, Flex, Typography, Form, Input, Button, Alert } from 'antd';
import { Link } from "react-router-dom";
import register from "../assets/Signup.png";
import useSignup from '../hooks/useSignup';

const Signup = () => {
  const [form] = Form.useForm();
  const { loading, error, registeredUser } = useSignup();

  const handleregister = (values) => {
    registeredUser(values);
  };

  return (
    <Card className='form-container'>
      <Flex gap="large" align='center' wrap='wrap'>
        <Flex vertical flex={1}>
          <Typography.Title level={3} className='title'>
            Create an Account
          </Typography.Title>
          <Typography.Text type='secondary' className='slogan'>
            Join for exclusive access!
          </Typography.Text>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleregister}
            autoComplete="off"
          >
            <Form.Item
              label="Full Name"
              name="fullName"
              rules={[{ required: true, message: "Please input your full name!" }]}
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
                { required: true, message: "Please input your Email-Id" },
                { type: 'email', message: "The input is not a valid Email" },
                {
                  validator: (_, value) =>
                    value && value.split('@')[0].length < 3
                      ? Promise.reject("Email username must be at least 3 characters.")
                      : Promise.resolve()
                }
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
                { required: true, message: "Please input your Password" },
                {
                  validator: (_, value) => {
                    const strongPassword = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{6,}$/;
                    if (!value || strongPassword.test(value)) {
                      return Promise.resolve();
                    }
                    return Promise.reject("Password must be at least 6 characters and include uppercase, number, and special character.");
                  }
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
              dependencies={['password']}
              rules={[
                { required: true, message: "Please confirm your Password" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Passwords do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password 
                size="large" 
                placeholder="Re-enter your Password" 
                autoComplete="new-password" 
              />
            </Form.Item>

            {error && (
              <Form.Item>
                <Alert description={error} type="error" showIcon closable className="alert" />
              </Form.Item>
            )}

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                className="btn"
                loading={loading}
              >
                Create Account
              </Button>
            </Form.Item>

            <Form.Item>
              <Link to="/login">
                <Button size="large" className="btn" type="default">
                  Sign In
                </Button>
              </Link>
            </Form.Item>
          </Form>
        </Flex>

        <Flex flex={1} justify="center">
          <img src={register} alt="Register Illustration" className="authImage" />
        </Flex>
      </Flex>
    </Card>
  );
};

export default Signup;
