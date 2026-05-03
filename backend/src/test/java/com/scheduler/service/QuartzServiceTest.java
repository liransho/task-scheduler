package com.scheduler.service;

import com.scheduler.entity.Schedule;
import com.scheduler.entity.ScheduleType;
import com.scheduler.entity.Task;
import com.scheduler.entity.TaskType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.quartz.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class QuartzServiceTest {

    @Mock
    private Scheduler scheduler;

    private QuartzService quartzService;
    private Schedule testSchedule;
    private Task testTask;

    @BeforeEach
    void setUp() {
        quartzService = new QuartzService(scheduler);

        testTask = Task.builder()
                .id(UUID.randomUUID())
                .name("Test Task")
                .taskType(TaskType.LOG_TASK)
                .build();

        testSchedule = Schedule.builder()
                .id(UUID.randomUUID())
                .task(testTask)
                .name("Test Schedule")
                .scheduleType(ScheduleType.RECURRING)
                .cronExpression("0 0/5 * * * ?")
                .enabled(true)
                .parameters(new ArrayList<>())
                .build();
    }

    @Test
    void scheduleJob_NewJob_CreatesJobAndTrigger() throws SchedulerException {
        when(scheduler.checkExists(any(JobKey.class))).thenReturn(false);
        when(scheduler.scheduleJob(any(JobDetail.class), any(Trigger.class))).thenReturn(null);

        assertDoesNotThrow(() -> quartzService.scheduleJob(testSchedule));

        verify(scheduler).scheduleJob(any(JobDetail.class), any(Trigger.class));
    }

    @Test
    void scheduleJob_ExistingJob_DeletesAndRecreates() throws SchedulerException {
        when(scheduler.checkExists(any(JobKey.class))).thenReturn(true);
        when(scheduler.deleteJob(any(JobKey.class))).thenReturn(true);
        when(scheduler.scheduleJob(any(JobDetail.class), any(Trigger.class))).thenReturn(null);

        assertDoesNotThrow(() -> quartzService.scheduleJob(testSchedule));

        verify(scheduler).deleteJob(any(JobKey.class));
        verify(scheduler).scheduleJob(any(JobDetail.class), any(Trigger.class));
    }

    @Test
    void scheduleJob_OneTimeSchedule_CreatesSimpleTrigger() throws SchedulerException {
        testSchedule.setScheduleType(ScheduleType.ONE_TIME);
        testSchedule.setStartTime(LocalDateTime.now().plusDays(1));

        when(scheduler.checkExists(any(JobKey.class))).thenReturn(false);
        when(scheduler.scheduleJob(any(JobDetail.class), any(Trigger.class))).thenReturn(null);

        assertDoesNotThrow(() -> quartzService.scheduleJob(testSchedule));

        verify(scheduler).scheduleJob(any(JobDetail.class), any(Trigger.class));
    }

    @Test
    void scheduleJob_SchedulerException_ThrowsRuntimeException() throws SchedulerException {
        when(scheduler.checkExists(any(JobKey.class))).thenThrow(new SchedulerException("Test error"));

        assertThrows(RuntimeException.class, () -> quartzService.scheduleJob(testSchedule));
    }

    @Test
    void deleteJob_ExistingJob_DeletesSuccessfully() throws SchedulerException {
        when(scheduler.checkExists(any(JobKey.class))).thenReturn(true);
        when(scheduler.deleteJob(any(JobKey.class))).thenReturn(true);

        assertDoesNotThrow(() -> quartzService.deleteJob(testSchedule));

        verify(scheduler).deleteJob(any(JobKey.class));
    }

    @Test
    void deleteJob_NonExistingJob_DoesNothing() throws SchedulerException {
        when(scheduler.checkExists(any(JobKey.class))).thenReturn(false);

        assertDoesNotThrow(() -> quartzService.deleteJob(testSchedule));

        verify(scheduler, never()).deleteJob(any(JobKey.class));
    }

    @Test
    void pauseJob_ExistingJob_PausesSuccessfully() throws SchedulerException {
        when(scheduler.checkExists(any(JobKey.class))).thenReturn(true);
        doNothing().when(scheduler).pauseJob(any(JobKey.class));

        assertDoesNotThrow(() -> quartzService.pauseJob(testSchedule));

        verify(scheduler).pauseJob(any(JobKey.class));
    }

    @Test
    void resumeJob_ExistingJob_ResumesSuccessfully() throws SchedulerException {
        when(scheduler.checkExists(any(JobKey.class))).thenReturn(true);
        doNothing().when(scheduler).resumeJob(any(JobKey.class));

        assertDoesNotThrow(() -> quartzService.resumeJob(testSchedule));

        verify(scheduler).resumeJob(any(JobKey.class));
    }

    @Test
    void rescheduleJob_ExistingTrigger_Reschedules() throws SchedulerException {
        when(scheduler.checkExists(any(TriggerKey.class))).thenReturn(true);
        when(scheduler.rescheduleJob(any(TriggerKey.class), any(Trigger.class))).thenReturn(null);

        assertDoesNotThrow(() -> quartzService.rescheduleJob(testSchedule));

        verify(scheduler).rescheduleJob(any(TriggerKey.class), any(Trigger.class));
    }

    @Test
    void rescheduleJob_NoExistingTrigger_CreatesNew() throws SchedulerException {
        when(scheduler.checkExists(any(TriggerKey.class))).thenReturn(false);
        when(scheduler.checkExists(any(JobKey.class))).thenReturn(false);
        when(scheduler.scheduleJob(any(JobDetail.class), any(Trigger.class))).thenReturn(null);

        assertDoesNotThrow(() -> quartzService.rescheduleJob(testSchedule));

        verify(scheduler).scheduleJob(any(JobDetail.class), any(Trigger.class));
    }
}
