package com.scheduler.job.task;

import com.scheduler.entity.TaskType;

import java.util.Map;

public interface ExecutableTask {
    TaskType getTaskType();
    void execute(Map<String, String> parameters);
}
