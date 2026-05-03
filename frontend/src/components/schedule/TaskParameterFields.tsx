import styled from 'styled-components';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { TaskParameterDefinition } from '../../types';
import { FormGroup, Label, Input, ErrorText } from '../common';

const Section = styled.div`
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #e2e8f0;
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 16px;
`;

const FieldDescription = styled.p`
  margin-top: 4px;
  font-size: 12px;
  color: #64748b;
`;

interface FormData {
  parameters: Record<string, string>;
  [key: string]: unknown;
}

interface TaskParameterFieldsProps {
  parameters: TaskParameterDefinition[];
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
}

export const TaskParameterFields: React.FC<TaskParameterFieldsProps> = ({
  parameters,
  register,
  errors,
}) => {
  if (parameters.length === 0) {
    return null;
  }

  return (
    <Section>
      <SectionTitle>Task Parameters</SectionTitle>
      {parameters.map((param) => (
        <FormGroup key={param.id}>
          <Label>
            {param.name}
            {param.required && ' *'}
          </Label>
          <Input
            {...register(`parameters.${param.name}`, {
              required: param.required ? `${param.name} is required` : false,
            })}
            placeholder={param.defaultValue || param.description || ''}
          />
          {param.description && (
            <FieldDescription>{param.description}</FieldDescription>
          )}
          {errors.parameters?.[param.name] && (
            <ErrorText>{errors.parameters[param.name]?.message}</ErrorText>
          )}
        </FormGroup>
      ))}
    </Section>
  );
};
