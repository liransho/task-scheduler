import { useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { useForm, Controller } from 'react-hook-form';
import type { Task, Schedule, ScheduleType, CreateScheduleRequest } from '../types';
import {
  Button,
  Input,
  Select,
  Label,
  FormGroup,
  ErrorText,
  Modal,
} from './common';
import { ScheduleTypeSelector, DaySelector, TaskParameterFields } from './schedule';

const Form = styled.form``;

const FlexRow = styled.div`
  display: flex;
  gap: 12px;
`;

const TaskDescription = styled.p`
  margin-top: 6px;
  font-size: 13px;
  color: #64748b;
`;

const CronHelp = styled.p`
  margin-top: 6px;
  font-size: 12px;
  color: #64748b;
`;

interface ScheduleFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateScheduleRequest) => Promise<void>;
  tasks: Task[];
  editingSchedule?: Schedule | null;
}

interface FormData {
  name: string;
  taskId: string;
  scheduleType: ScheduleType;
  startTime: string;
  intervalValue: number;
  intervalUnit: string;
  daysOfWeek: string[];
  timeOfDay: string;
  cronExpression: string;
  parameters: Record<string, string>;
}

const DEFAULT_VALUES: FormData = {
  name: '',
  taskId: '',
  scheduleType: 'ONE_TIME',
  startTime: '',
  intervalValue: 5,
  intervalUnit: 'MINUTES',
  daysOfWeek: [],
  timeOfDay: '09:00',
  cronExpression: '0 0 * * * ?',
  parameters: {},
};

export const ScheduleForm: React.FC<ScheduleFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  tasks,
  editingSchedule,
}) => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ defaultValues: DEFAULT_VALUES });

  const selectedTaskId = watch('taskId');
  const scheduleType = watch('scheduleType');
  const selectedDays = watch('daysOfWeek') || [];

  const selectedTask = useMemo(
    () => tasks.find((t) => t.id === selectedTaskId),
    [tasks, selectedTaskId]
  );

  useEffect(() => {
    if (!isOpen) return;

    if (editingSchedule) {
      reset({
        name: editingSchedule.name,
        taskId: editingSchedule.taskId,
        scheduleType: editingSchedule.scheduleType,
        startTime: editingSchedule.startTime?.slice(0, 16) || '',
        intervalValue: editingSchedule.intervalValue || 5,
        intervalUnit: editingSchedule.intervalUnit || 'MINUTES',
        daysOfWeek: editingSchedule.daysOfWeek?.split(',') || [],
        timeOfDay: editingSchedule.timeOfDay || '09:00',
        cronExpression: editingSchedule.cronExpression || '0 0 * * * ?',
        parameters: editingSchedule.parameters || {},
      });
    } else {
      reset({
        ...DEFAULT_VALUES,
        taskId: tasks[0]?.id || '',
      });
    }
  }, [editingSchedule, tasks, reset, isOpen]);

  const handleFormSubmit = async (data: FormData) => {
    const request: CreateScheduleRequest = {
      name: data.name,
      taskId: data.taskId,
      scheduleType: data.scheduleType,
      parameters: data.parameters,
    };

    switch (data.scheduleType) {
      case 'ONE_TIME':
        request.startTime = data.startTime;
        break;
      case 'RECURRING':
        request.intervalValue = data.intervalValue;
        request.intervalUnit = data.intervalUnit;
        break;
      case 'WEEKLY':
        request.daysOfWeek = data.daysOfWeek.join(',');
        request.timeOfDay = data.timeOfDay;
        break;
      case 'CRON':
        request.cronExpression = data.cronExpression;
        break;
    }

    await onSubmit(request);
  };

  const modalTitle = editingSchedule ? 'Edit Schedule' : 'Create Schedule';
  const submitText = isSubmitting
    ? 'Saving...'
    : editingSchedule
    ? 'Update'
    : 'Create';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={modalTitle}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="schedule-form" disabled={isSubmitting}>
            {submitText}
          </Button>
        </>
      }
    >
      <Form id="schedule-form" onSubmit={handleSubmit(handleFormSubmit)}>
        <FormGroup>
          <Label>Schedule Name *</Label>
          <Input
            {...register('name', { required: 'Name is required' })}
            placeholder="My scheduled task"
          />
          {errors.name && <ErrorText>{errors.name.message}</ErrorText>}
        </FormGroup>

        <FormGroup>
          <Label>Task *</Label>
          <Select {...register('taskId', { required: 'Task is required' })}>
            {tasks.map((task) => (
              <option key={task.id} value={task.id}>
                {task.name}
              </option>
            ))}
          </Select>
          {selectedTask && (
            <TaskDescription>{selectedTask.description}</TaskDescription>
          )}
        </FormGroup>

        <FormGroup>
          <Label>Schedule Type</Label>
          <Controller
            name="scheduleType"
            control={control}
            render={({ field }) => (
              <ScheduleTypeSelector
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </FormGroup>

        {scheduleType === 'ONE_TIME' && (
          <FormGroup>
            <Label>Date and Time *</Label>
            <Input
              type="datetime-local"
              {...register('startTime', {
                required: 'Start time is required',
              })}
            />
            {errors.startTime && (
              <ErrorText>{errors.startTime.message}</ErrorText>
            )}
          </FormGroup>
        )}

        {scheduleType === 'RECURRING' && (
          <FlexRow>
            <FormGroup style={{ flex: 1 }}>
              <Label>Every</Label>
              <Input
                type="number"
                min={1}
                {...register('intervalValue', { valueAsNumber: true })}
              />
            </FormGroup>
            <FormGroup style={{ flex: 1 }}>
              <Label>Unit</Label>
              <Select {...register('intervalUnit')}>
                <option value="MINUTES">Minutes</option>
                <option value="HOURS">Hours</option>
                <option value="DAYS">Days</option>
              </Select>
            </FormGroup>
          </FlexRow>
        )}

        {scheduleType === 'WEEKLY' && (
          <>
            <FormGroup>
              <Label>Days of Week</Label>
              <DaySelector
                selectedDays={selectedDays}
                onChange={(days) => setValue('daysOfWeek', days)}
              />
            </FormGroup>
            <FormGroup>
              <Label>Time</Label>
              <Input type="time" {...register('timeOfDay')} />
            </FormGroup>
          </>
        )}

        {scheduleType === 'CRON' && (
          <FormGroup>
            <Label>Cron Expression *</Label>
            <Input
              {...register('cronExpression', {
                required: 'Cron expression is required',
              })}
              placeholder="0 0 12 * * ?"
            />
            <CronHelp>
              Format: second minute hour day-of-month month day-of-week
            </CronHelp>
            {errors.cronExpression && (
              <ErrorText>{errors.cronExpression.message}</ErrorText>
            )}
          </FormGroup>
        )}

        {selectedTask && (
          <TaskParameterFields
            parameters={selectedTask.parameterDefinitions}
            register={register as any}
            errors={errors as any}
          />
        )}
      </Form>
    </Modal>
  );
};
