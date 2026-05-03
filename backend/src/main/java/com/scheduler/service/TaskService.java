package com.scheduler.service;

import com.scheduler.dto.TaskDTO;
import com.scheduler.mapper.ScheduleMapper;
import com.scheduler.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {
    private final TaskRepository taskRepository;
    private final ScheduleMapper scheduleMapper;

    @Transactional(readOnly = true)
    public List<TaskDTO> getAllTasks() {
        return scheduleMapper.toTaskDtoList(taskRepository.findAllWithParameters());
    }
}
