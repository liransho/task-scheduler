package com.scheduler.config;

import com.scheduler.entity.*;
import com.scheduler.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final TaskRepository taskRepository;

    @Override
    @Transactional
    public void run(String... args) {
        if (taskRepository.count() > 0) {
            log.info("Tasks already seeded, skipping...");
            return;
        }

        log.info("Seeding predefined tasks...");

        Task logTask = Task.builder()
                .name("Log Task")
                .description("Writes a message to the application log")
                .taskType(TaskType.LOG_TASK)
                .build();

        logTask.getParameterDefinitions().addAll(List.of(
                TaskParameterDefinition.builder()
                        .task(logTask)
                        .name("message")
                        .type(ParameterType.STRING)
                        .required(true)
                        .description("The message to log")
                        .build(),
                TaskParameterDefinition.builder()
                        .task(logTask)
                        .name("level")
                        .type(ParameterType.STRING)
                        .required(false)
                        .defaultValue("INFO")
                        .description("Log level (DEBUG, INFO, WARN, ERROR)")
                        .build()
        ));

        Task httpTask = Task.builder()
                .name("HTTP Request Task")
                .description("Makes an HTTP request to a specified URL")
                .taskType(TaskType.HTTP_REQUEST_TASK)
                .build();

        httpTask.getParameterDefinitions().addAll(List.of(
                TaskParameterDefinition.builder()
                        .task(httpTask)
                        .name("url")
                        .type(ParameterType.STRING)
                        .required(true)
                        .description("The URL to request")
                        .build(),
                TaskParameterDefinition.builder()
                        .task(httpTask)
                        .name("method")
                        .type(ParameterType.STRING)
                        .required(false)
                        .defaultValue("GET")
                        .description("HTTP method (GET, POST)")
                        .build()
        ));

        Task shellTask = Task.builder()
                .name("Shell Command Task")
                .description("Logs a shell command (execution disabled for security)")
                .taskType(TaskType.SHELL_COMMAND_TASK)
                .build();

        shellTask.getParameterDefinitions().add(
                TaskParameterDefinition.builder()
                        .task(shellTask)
                        .name("command")
                        .type(ParameterType.STRING)
                        .required(true)
                        .description("The shell command to execute")
                        .build()
        );

        taskRepository.saveAll(List.of(logTask, httpTask, shellTask));

        log.info("Seeded {} predefined tasks", 3);
    }
}
