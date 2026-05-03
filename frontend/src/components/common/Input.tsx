import styled, { css } from 'styled-components';

const inputBaseStyles = css`
  width: 100%;
  padding: 12px 16px;
  font-size: 14px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  transition: all 0.2s ease;
  background: white;

  &:hover:not(:disabled):not(:focus) {
    border-color: #cbd5e1;
  }

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.12);
  }

  &::placeholder {
    color: #94a3b8;
  }

  &:disabled {
    background-color: #f8fafc;
    border-color: #f1f5f9;
    cursor: not-allowed;
    color: #94a3b8;
  }
`;

export const Input = styled.input`
  ${inputBaseStyles}
`;

export const Select = styled.select`
  ${inputBaseStyles}
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 18px;
  padding-right: 40px;
`;

export const TextArea = styled.textarea`
  ${inputBaseStyles}
  resize: vertical;
  min-height: 100px;
  line-height: 1.6;
`;

export const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 8px;
  letter-spacing: -0.01em;
`;

export const FormGroup = styled.div`
  margin-bottom: 20px;
`;

export const ErrorText = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #ef4444;
  font-size: 13px;
  font-weight: 500;
  margin-top: 6px;
`;

export const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: #3b82f6;
  border-radius: 4px;
`;

export const CheckboxLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #334155;
  padding: 8px 14px;
  border-radius: 8px;
  border: 2px solid #e2e8f0;
  transition: all 0.2s ease;
  user-select: none;

  &:hover {
    border-color: #3b82f6;
    background: rgba(59, 130, 246, 0.04);
  }

  &:has(input:checked) {
    border-color: #3b82f6;
    background: rgba(59, 130, 246, 0.08);
    color: #2563eb;
  }
`;
