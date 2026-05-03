package com.scheduler.job;

import com.scheduler.entity.Schedule;
import com.scheduler.repository.ScheduleRepository;
import com.scheduler.service.TaskExecutorService;
import lombok.extern.slf4j.Slf4j;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
@Slf4j
public class GenericScheduledJob implements Job {

    @Autowired
    private ScheduleRepository scheduleRepository;

    @Autowired
    private TaskExecutorService taskExecutorService;

    @Override
    public void execute(JobExecutionContext context) throws JobExecutionException {
        String scheduleIdStr = context.getJobDetail().getJobDataMap().getString("scheduleId");
        UUID scheduleId = UUID.fromString(scheduleIdStr);

        log.info("Executing scheduled job for schedule: {}", scheduleId);

        try {
            Schedule schedule = scheduleRepository.findByIdWithDetails(scheduleId)
                    .orElseThrow(() -> new JobExecutionException("Schedule not found: " + scheduleId));

            if (!schedule.isEnabled()) {
                log.info("Schedule {} is disabled, skipping execution", schedule.getName());
                return;
            }

            Map<String, String> parameters = schedule.getParameters().stream()
                    .collect(Collectors.toMap(
                            p -> p.getParameterName(),
                            p -> p.getParameterValue() != null ? p.getParameterValue() : ""
                    ));

            taskExecutorService.executeTask(schedule.getTask().getTaskType(), parameters);

            log.info("Successfully executed schedule: {}", schedule.getName());

        } catch (Exception e) {
            log.error("Error executing schedule: {}", scheduleId, e);
            throw new JobExecutionException(e);
        }
    }
}
