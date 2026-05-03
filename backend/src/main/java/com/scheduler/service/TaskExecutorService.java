package com.scheduler.service;

import com.scheduler.entity.TaskType;
import com.scheduler.job.task.ExecutableTask;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class TaskExecutorService {

    private final Map<TaskType, ExecutableTask> taskMap;

    @Autowired
    public TaskExecutorService(List<ExecutableTask> tasks) {
        this.taskMap = tasks.stream()
                .collect(java.util.stream.Collectors.toMap(
                        ExecutableTask::getTaskType,
                        task -> task
                ));
    }

    public void executeTask(TaskType taskType, Map<String, String> parameters) {
        ExecutableTask task = taskMap.get(taskType);
        if (task == null) {
            throw new IllegalArgumentException("No executor found for task type: " + taskType);
        }

        log.info("Executing task: {} with parameters: {}", taskType, parameters);
        task.execute(parameters);
    }
}
