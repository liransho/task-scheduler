package com.scheduler.config;

import com.scheduler.entity.Schedule;
import com.scheduler.repository.ScheduleRepository;
import com.scheduler.service.QuartzService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class SchedulerStartupListener {

    private final ScheduleRepository scheduleRepository;
    private final QuartzService quartzService;

    @EventListener(ApplicationReadyEvent.class)
    @Transactional(readOnly = true)
    public void onApplicationReady() {
        log.info("Syncing existing schedules with Quartz...");

        List<Schedule> enabledSchedules = scheduleRepository.findByEnabledTrue();

        for (Schedule schedule : enabledSchedules) {
            try {
                quartzService.scheduleJob(schedule);
            } catch (Exception e) {
                log.error("Failed to schedule job: {}", schedule.getName(), e);
            }
        }

        log.info("Synced {} schedules with Quartz", enabledSchedules.size());
    }
}
