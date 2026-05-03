import { describe, it, expect } from 'vitest';
import type { Task, Schedule, CreateScheduleRequest, ScheduleType } from '../types';

describe('Types', () => {
  describe('Task', () => {
    it('should have correct structure', () => {
      const task: Task = {
        id: '123',
        name: 'Log Task',
        description: 'Writes a message to the log',
        taskType: 'LOG_TASK',
        parameterDefinitions: [
          {
            id: '456',
            name: 'message',
            type: 'STRING',
            required: true,
            defaultValue: 'Hello',
            description: 'The message to log',
          },
        ],
      };

      expect(task.id).toBe('123');
      expect(task.name).toBe('Log Task');
      expect(task.parameterDefinitions).toHaveLength(1);
      expect(task.parameterDefinitions[0].required).toBe(true);
    });
  });

  describe('Schedule', () => {
    it('should support all schedule types', () => {
      const scheduleTypes: ScheduleType[] = ['ONE_TIME', 'RECURRING', 'WEEKLY', 'CRON'];

      scheduleTypes.forEach((type) => {
        const schedule: Schedule = {
          id: '123',
          taskId: '456',
          taskName: 'Test Task',
          name: 'Test Schedule',
          scheduleType: type,
          enabled: true,
          parameters: {},
          createdAt: '2024-01-01T00:00:00',
          updatedAt: '2024-01-01T00:00:00',
        };

        expect(schedule.scheduleType).toBe(type);
      });
    });

    it('should support optional fields', () => {
      const schedule: Schedule = {
        id: '123',
        taskId: '456',
        taskName: 'Test Task',
        name: 'One Time Schedule',
        scheduleType: 'ONE_TIME',
        startTime: '2024-06-15T14:30:00',
        enabled: true,
        parameters: { message: 'Hello' },
        createdAt: '2024-01-01T00:00:00',
        updatedAt: '2024-01-01T00:00:00',
      };

      expect(schedule.startTime).toBe('2024-06-15T14:30:00');
      expect(schedule.cronExpression).toBeUndefined();
    });
  });

  describe('CreateScheduleRequest', () => {
    it('should create valid request for recurring schedule', () => {
      const request: CreateScheduleRequest = {
        taskId: '123',
        name: 'My Schedule',
        scheduleType: 'RECURRING',
        intervalValue: 5,
        intervalUnit: 'MINUTES',
        parameters: { message: 'Hello' },
      };

      expect(request.taskId).toBe('123');
      expect(request.intervalValue).toBe(5);
      expect(request.intervalUnit).toBe('MINUTES');
    });

    it('should create valid request for cron schedule', () => {
      const request: CreateScheduleRequest = {
        taskId: '123',
        name: 'Cron Schedule',
        scheduleType: 'CRON',
        cronExpression: '0 0 12 * * ?',
      };

      expect(request.cronExpression).toBe('0 0 12 * * ?');
    });
  });
});
