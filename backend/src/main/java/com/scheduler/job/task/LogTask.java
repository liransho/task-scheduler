package com.scheduler.job.task;

import com.scheduler.entity.TaskType;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@Slf4j
public class LogTask implements ExecutableTask {

    @Override
    public TaskType getTaskType() {
        return TaskType.LOG_TASK;
    }

    @Override
    public void execute(Map<String, String> parameters) {
        String message = parameters.getOrDefault("message", "No message provided");
        String level = parameters.getOrDefault("level", "INFO").toUpperCase();

        switch (level) {
            case "DEBUG" -> log.debug("[LOG_TASK] {}", message);
            case "WARN" -> log.warn("[LOG_TASK] {}", message);
            case "ERROR" -> log.error("[LOG_TASK] {}", message);
            default -> log.info("[LOG_TASK] {}", message);
        }
    }
}
