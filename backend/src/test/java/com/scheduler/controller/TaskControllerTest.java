package com.scheduler.controller;

import com.scheduler.dto.TaskDTO;
import com.scheduler.dto.TaskParameterDefinitionDTO;
import com.scheduler.entity.ParameterType;
import com.scheduler.entity.TaskType;
import com.scheduler.service.TaskService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TaskControllerTest {

    @Mock
    private TaskService taskService;

    @InjectMocks
    private TaskController taskController;

    private TaskDTO testTask;

    @BeforeEach
    void setUp() {
        TaskParameterDefinitionDTO param = new TaskParameterDefinitionDTO(
                UUID.randomUUID(),
                "message",
                ParameterType.STRING,
                true,
                "Hello",
                "The message to log"
        );

        testTask = new TaskDTO(
                UUID.randomUUID(),
                "Log Task",
                "Writes a message to the application log",
                TaskType.LOG_TASK,
                List.of(param)
        );
    }

    @Test
    void getAllTasks_ReturnsTaskList() {
        when(taskService.getAllTasks()).thenReturn(List.of(testTask));

        ResponseEntity<List<TaskDTO>> response = taskController.getAllTasks();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size());
        assertEquals("Log Task", response.getBody().get(0).name());
        verify(taskService).getAllTasks();
    }

    @Test
    void getAllTasks_EmptyList_ReturnsEmptyList() {
        when(taskService.getAllTasks()).thenReturn(List.of());

        ResponseEntity<List<TaskDTO>> response = taskController.getAllTasks();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().isEmpty());
    }

    @Test
    void getAllTasks_WithParameterDefinitions_ReturnsCorrectSchema() {
        when(taskService.getAllTasks()).thenReturn(List.of(testTask));

        ResponseEntity<List<TaskDTO>> response = taskController.getAllTasks();

        TaskDTO task = response.getBody().get(0);
        assertEquals(1, task.parameterDefinitions().size());

        TaskParameterDefinitionDTO param = task.parameterDefinitions().get(0);
        assertEquals("message", param.name());
        assertEquals(ParameterType.STRING, param.type());
        assertTrue(param.required());
        assertEquals("Hello", param.defaultValue());
    }
}
