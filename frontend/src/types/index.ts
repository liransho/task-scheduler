export type ParameterType = 'STRING' | 'NUMBER' | 'BOOLEAN';

export type TaskType = 'LOG_TASK' | 'HTTP_REQUEST_TASK' | 'SHELL_COMMAND_TASK';

export type ScheduleType = 'ONE_TIME' | 'RECURRING' | 'WEEKLY' | 'CRON';

export interface TaskParameterDefinition {
  id: string;
  name: string;
  type: ParameterType;
  required: boolean;
  defaultValue?: string;
  description?: string;
}

export interface Task {
  id: string;
  name: string;
  description: string;
  taskType: TaskType;
  parameterDefinitions: TaskParameterDefinition[];
}

export interface Schedule {
  id: string;
  taskId: string;
  taskName: string;
  name: string;
  scheduleType: ScheduleType;
  cronExpression?: string;
  startTime?: string;
  intervalValue?: number;
  intervalUnit?: string;
  daysOfWeek?: string;
  timeOfDay?: string;
  enabled: boolean;
  parameters: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateScheduleRequest {
  taskId: string;
  name: string;
  scheduleType: ScheduleType;
  cronExpression?: string;
  startTime?: string;
  intervalValue?: number;
  intervalUnit?: string;
  daysOfWeek?: string;
  timeOfDay?: string;
  parameters?: Record<string, string>;
}

export interface AuthCredentials {
  username: string;
  password: string;
}
