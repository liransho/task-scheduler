package com.scheduler.service;

import com.scheduler.dto.TaskDTO;
import com.scheduler.dto.TaskParameterDefinitionDTO;
import com.scheduler.entity.ParameterType;
import com.scheduler.entity.Task;
import com.scheduler.entity.TaskParameterDefinition;
import com.scheduler.entity.TaskType;
import com.scheduler.mapper.ScheduleMapper;
import com.scheduler.repository.TaskRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private ScheduleMapper scheduleMapper;

    private TaskService taskService;

    @BeforeEach
    void setUp() {
        taskService = new TaskService(taskRepository, scheduleMapper);
    }

    @Test
    void getAllTasks_ReturnsTaskList() {
        TaskParameterDefinition param = TaskParameterDefinition.builder()
                .id(UUID.randomUUID())
                .name("message")
                .type(ParameterType.STRING)
                .required(true)
                .description("Log message")
                .build();

        Task task = Task.builder()
                .id(UUID.randomUUID())
                .name("Log Task")
                .description("Writes a message to the log")
                .taskType(TaskType.LOG_TASK)
                .parameterDefinitions(List.of(param))
                .build();

        TaskParameterDefinitionDTO paramDto = new TaskParameterDefinitionDTO(
                param.getId(), "message", ParameterType.STRING, true, null, "Log message"
        );

        TaskDTO taskDto = new TaskDTO(
                task.getId(), "Log Task", "Writes a message to the log",
                TaskType.LOG_TASK, List.of(paramDto)
        );

        when(taskRepository.findAllWithParameters()).thenReturn(List.of(task));
        when(scheduleMapper.toTaskDtoList(List.of(task))).thenReturn(List.of(taskDto));

        List<TaskDTO> result = taskService.getAllTasks();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Log Task", result.get(0).name());
        assertEquals(1, result.get(0).parameterDefinitions().size());
        assertTrue(result.get(0).parameterDefinitions().get(0).required());
        verify(taskRepository).findAllWithParameters();
    }

    @Test
    void getAllTasks_EmptyList_ReturnsEmptyList() {
        when(taskRepository.findAllWithParameters()).thenReturn(new ArrayList<>());
        when(scheduleMapper.toTaskDtoList(new ArrayList<>())).thenReturn(new ArrayList<>());

        List<TaskDTO> result = taskService.getAllTasks();

        assertNotNull(result);
        assertTrue(result.isEmpty());
    }
}
