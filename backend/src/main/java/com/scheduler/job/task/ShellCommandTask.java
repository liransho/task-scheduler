package com.scheduler.job.task;

import com.scheduler.entity.TaskType;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@Slf4j
public class ShellCommandTask implements ExecutableTask {

    @Override
    public TaskType getTaskType() {
        return TaskType.SHELL_COMMAND_TASK;
    }

    @Override
    public void execute(Map<String, String> parameters) {
        String command = parameters.get("command");
        if (command == null || command.isBlank()) {
            throw new IllegalArgumentException("Command is required for Shell Command task");
        }

        log.info("[SHELL_COMMAND_TASK] Would execute command: {}", command);
        log.info("[SHELL_COMMAND_TASK] (Command execution is disabled for security - this is a demo)");
    }
}
