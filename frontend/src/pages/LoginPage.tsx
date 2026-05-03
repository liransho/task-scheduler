import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { FiCalendar, FiLock, FiUser, FiAlertCircle } from 'react-icons/fi';
import { Button, Input, Label, FormGroup, Card, CardBody, ErrorText } from '../components/common';
import { setAuthCredentials, testAuth } from '../api/client';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle at 30% 30%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
                radial-gradient(circle at 70% 70%, rgba(139, 92, 246, 0.1) 0%, transparent 50%);
    animation: pulse 15s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
`;

const LoginCard = styled(motion(Card))`
  width: 100%;
  max-width: 420px;
  position: relative;
  z-index: 1;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
`;

const LogoContainer = styled(motion.div)`
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
`;

const LogoIcon = styled.div`
  width: 72px;
  height: 72px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.4);
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 800;
  color: #0f172a;
  text-align: center;
  margin-bottom: 8px;
  letter-spacing: -0.03em;
`;

const Subtitle = styled.p`
  font-size: 15px;
  color: #64748b;
  text-align: center;
  margin-bottom: 32px;
`;

const InputWrapper = styled.div`
  position: relative;
`;

const InputIcon = styled.span`
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  display: flex;
  align-items: center;
`;

const StyledInput = styled(Input)`
  padding-left: 44px;
`;

const ErrorAlert = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 10px;
  margin-bottom: 20px;
  color: #dc2626;
  font-size: 14px;
  font-weight: 500;
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 24px 0;
  gap: 16px;
  color: #94a3b8;
  font-size: 13px;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #e2e8f0;
  }
`;

const HintText = styled.p`
  font-size: 13px;
  color: #94a3b8;
  text-align: center;
  background: #f8fafc;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px dashed #e2e8f0;

  strong {
    color: #64748b;
  }
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
      <LoginCard
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <CardBody style={{ padding: 36 }}>
          <LogoContainer
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <LogoIcon>
              <FiCalendar size={32} color="white" />
            </LogoIcon>
          </LogoContainer>

          <Title>Task Scheduler</Title>
          <Subtitle>Sign in to manage your scheduled tasks</Subtitle>

          <form onSubmit={handleSubmit(handleLogin)}>
            {error && (
              <ErrorAlert
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <FiAlertCircle size={18} />
                {error}
              </ErrorAlert>
            )}

            <FormGroup>
              <Label>Username</Label>
              <InputWrapper>
                <InputIcon>
                  <FiUser size={18} />
                </InputIcon>
                <StyledInput
                  {...register('username', { required: 'Username is required' })}
                  placeholder="Enter username"
                  autoComplete="username"
                />
              </InputWrapper>
              {errors.username && <ErrorText>{errors.username.message}</ErrorText>}
            </FormGroup>

            <FormGroup>
              <Label>Password</Label>
              <InputWrapper>
                <InputIcon>
                  <FiLock size={18} />
                </InputIcon>
                <StyledInput
                  {...register('password', { required: 'Password is required' })}
                  type="password"
                  placeholder="Enter password"
                  autoComplete="current-password"
                />
              </InputWrapper>
              {errors.password && <ErrorText>{errors.password.message}</ErrorText>}
            </FormGroup>

            <Button type="submit" style={{ width: '100%', marginTop: 8 }} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <Divider>Demo Access</Divider>

          <HintText>
            Use <strong>admin</strong> / <strong>admin</strong> to sign in
          </HintText>
        </CardBody>
      </LoginCard>
    </Container>
  );
};
