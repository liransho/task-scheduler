import styled from 'styled-components';
import { motion } from 'framer-motion';

export const Card = styled(motion.div)`
  background: white;
  border-radius: 16px;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.04),
    0 4px 12px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  border: 1px solid rgba(226, 232, 240, 0.8);
  transition: box-shadow 0.3s ease, transform 0.3s ease;

  &:hover {
    box-shadow:
      0 4px 6px rgba(0, 0, 0, 0.04),
      0 10px 24px rgba(0, 0, 0, 0.08);
  }
`;

export const CardHeader = styled.div`
  padding: 24px 28px;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(180deg, #ffffff 0%, #fafbfc 100%);
`;

export const CardTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.02em;
`;

export const CardBody = styled.div`
  padding: 24px;
`;
