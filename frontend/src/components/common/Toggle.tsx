import React from 'react';
import styled from 'styled-components';

const ToggleWrapper = styled.label`
  position: relative;
  display: inline-block;
  width: 48px;
  height: 26px;
`;

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + span {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    box-shadow: 0 2px 8px rgba(16, 185, 129, 0.4);
  }

  &:checked + span:before {
    transform: translateX(22px);
  }

  &:focus + span {
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
  }

  &:disabled + span {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Slider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 26px;

  &:before {
    position: absolute;
    content: '';
    height: 20px;
    width: 20px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 50%;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  }

  &:hover:before {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }
`;

interface ToggleProps {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}

export const Toggle: React.FC<ToggleProps> = ({ checked, onChange, disabled }) => {
  return (
    <ToggleWrapper>
      <ToggleInput
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
      <Slider />
    </ToggleWrapper>
  );
};
