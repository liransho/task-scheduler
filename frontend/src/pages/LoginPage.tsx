import React, { useState } from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { Button, Input, Label, FormGroup, Card, CardBody, ErrorText } from '../components/common';
import { setAuthCredentials, testAuth } from '../api/client';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const LoginCard = styled(Card)`
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  text-align: center;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #64748b;
  text-align: center;
  margin-bottom: 32px;
`;

const Logo = styled.div`
  font-size: 48px;
  text-align: center;
  margin-bottom: 16px;
`;

interface LoginFormData {
  username: string;
  password: string;
}

interface LoginPageProps {
  onLogin: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      username: 'admin',
      password: 'admin',
    },
  });

  const handleLogin = async (data: LoginFormData) => {
    setError(null);
    setLoading(true);

    try {
      setAuthCredentials(data.username, data.password);
      const isValid = await testAuth();

      if (isValid) {
        localStorage.setItem('auth', btoa(`${data.username}:${data.password}`));
        onLogin();
      } else {
        setError('Invalid username or password');
      }
    } catch {
      setError('Failed to connect to the server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <LoginCard>
        <CardBody>
          <Logo>📅</Logo>
          <Title>Task Scheduler</Title>
          <Subtitle>Sign in to manage your scheduled tasks</Subtitle>

          <form onSubmit={handleSubmit(handleLogin)}>
            <FormGroup>
              <Label>Username</Label>
              <Input
                {...register('username', { required: 'Username is required' })}
                placeholder="Enter username"
                autoComplete="username"
              />
              {errors.username && <ErrorText>{errors.username.message}</ErrorText>}
            </FormGroup>

            <FormGroup>
              <Label>Password</Label>
              <Input
                {...register('password', { required: 'Password is required' })}
                type="password"
                placeholder="Enter password"
                autoComplete="current-password"
              />
              {errors.password && <ErrorText>{errors.password.message}</ErrorText>}
            </FormGroup>

            {error && (
              <ErrorText style={{ marginBottom: '16px', display: 'block' }}>
                {error}
              </ErrorText>
            )}

            <Button type="submit" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <p style={{ marginTop: '24px', fontSize: '12px', color: '#94a3b8', textAlign: 'center' }}>
            Default credentials: admin / admin
          </p>
        </CardBody>
      </LoginCard>
    </Container>
  );
};
