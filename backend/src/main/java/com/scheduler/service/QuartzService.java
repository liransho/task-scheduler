package com.scheduler.service;

import com.scheduler.entity.Schedule;
import com.scheduler.entity.ScheduleType;
import com.scheduler.job.GenericScheduledJob;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.quartz.*;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
@RequiredArgsConstructor
@Slf4j
public class QuartzService {
    private final Scheduler scheduler;

    public void scheduleJob(Schedule schedule) {
        try {
            JobKey jobKey = getJobKey(schedule);
            TriggerKey triggerKey = getTriggerKey(schedule);

            if (scheduler.checkExists(jobKey)) {
                scheduler.deleteJob(jobKey);
            }

            JobDetail jobDetail = JobBuilder.newJob(GenericScheduledJob.class)
                    .withIdentity(jobKey)
                    .usingJobData("scheduleId", schedule.getId().toString())
                    .storeDurably()
                    .build();

            Trigger trigger = buildTrigger(schedule, triggerKey);

            scheduler.scheduleJob(jobDetail, trigger);
            log.info("Scheduled job: {} with cron: {}", schedule.getName(), schedule.getCronExpression());

        } catch (SchedulerException e) {
            log.error("Failed to schedule job: {}", schedule.getName(), e);
            throw new RuntimeException("Failed to schedule job", e);
        }
    }

    public void rescheduleJob(Schedule schedule) {
        try {
            TriggerKey triggerKey = getTriggerKey(schedule);

            if (scheduler.checkExists(triggerKey)) {
                Trigger newTrigger = buildTrigger(schedule, triggerKey);
                scheduler.rescheduleJob(triggerKey, newTrigger);
                log.info("Rescheduled job: {}", schedule.getName());
            } else {
                scheduleJob(schedule);
            }
        } catch (SchedulerException e) {
            log.error("Failed to reschedule job: {}", schedule.getName(), e);
            throw new RuntimeException("Failed to reschedule job", e);
        }
    }

    public void deleteJob(Schedule schedule) {
        try {
            JobKey jobKey = getJobKey(schedule);
            if (scheduler.checkExists(jobKey)) {
                scheduler.deleteJob(jobKey);
                log.info("Deleted job: {}", schedule.getName());
            }
        } catch (SchedulerException e) {
            log.error("Failed to delete job: {}", schedule.getName(), e);
            throw new RuntimeException("Failed to delete job", e);
        }
    }

    public void pauseJob(Schedule schedule) {
        try {
            JobKey jobKey = getJobKey(schedule);
            if (scheduler.checkExists(jobKey)) {
                scheduler.pauseJob(jobKey);
                log.info("Paused job: {}", schedule.getName());
            }
        } catch (SchedulerException e) {
            log.error("Failed to pause job: {}", schedule.getName(), e);
            throw new RuntimeException("Failed to pause job", e);
        }
    }

    public void resumeJob(Schedule schedule) {
        try {
            JobKey jobKey = getJobKey(schedule);
            if (scheduler.checkExists(jobKey)) {
                scheduler.resumeJob(jobKey);
                log.info("Resumed job: {}", schedule.getName());
            }
        } catch (SchedulerException e) {
            log.error("Failed to resume job: {}", schedule.getName(), e);
            throw new RuntimeException("Failed to resume job", e);
        }
    }

    private Trigger buildTrigger(Schedule schedule, TriggerKey triggerKey) {
        if (schedule.getScheduleType() == ScheduleType.ONE_TIME) {
            return TriggerBuilder.newTrigger()
                    .withIdentity(triggerKey)
                    .startAt(Date.from(schedule.getStartTime().atZone(java.time.ZoneId.systemDefault()).toInstant()))
                    .build();
        }

        return TriggerBuilder.newTrigger()
                .withIdentity(triggerKey)
                .withSchedule(CronScheduleBuilder.cronSchedule(schedule.getCronExpression())
                        .withMisfireHandlingInstructionFireAndProceed())
                .build();
    }

    private JobKey getJobKey(Schedule schedule) {
        return JobKey.jobKey("job-" + schedule.getId(), "schedules");
    }

    private TriggerKey getTriggerKey(Schedule schedule) {
        return TriggerKey.triggerKey("trigger-" + schedule.getId(), "schedules");
    }
}
