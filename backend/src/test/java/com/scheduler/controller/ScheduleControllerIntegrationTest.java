package com.scheduler.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.scheduler.dto.CreateScheduleRequest;
import com.scheduler.entity.ScheduleType;
import com.scheduler.entity.Task;
import com.scheduler.entity.TaskType;
import com.scheduler.repository.TaskRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class ScheduleControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private TaskRepository taskRepository;

    private Task testTask;

    @BeforeEach
    void setUp() {
        testTask = Task.builder()
                .name("Test Task")
                .description("A test task for integration tests")
                .taskType(TaskType.LOG_TASK)
                .parameterDefinitions(new ArrayList<>())
                .build();
        testTask = taskRepository.save(testTask);
    }

    @Test
    @WithMockUser(username = "admin", roles = "ADMIN")
    void getTasks_ReturnsTaskList() throws Exception {
        mockMvc.perform(get("/api/tasks"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    @WithMockUser(username = "admin", roles = "ADMIN")
    void getSchedules_ReturnsEmptyList() throws Exception {
        mockMvc.perform(get("/api/schedules"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    @WithMockUser(username = "admin", roles = "ADMIN")
    void createSchedule_Success() throws Exception {
        CreateScheduleRequest request = new CreateScheduleRequest(
                testTask.getId(),
                "Test Schedule",
                ScheduleType.RECURRING,
                null, null,
                5, "MINUTES",
                null, null,
                Map.of()
        );

        mockMvc.perform(post("/api/schedules")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Test Schedule"))
                .andExpect(jsonPath("$.scheduleType").value("RECURRING"));
    }

    @Test
    @WithMockUser(username = "admin", roles = "ADMIN")
    void createSchedule_MissingName_ReturnsBadRequest() throws Exception {
        CreateScheduleRequest request = new CreateScheduleRequest(
                testTask.getId(),
                null,
                ScheduleType.RECURRING,
                null, null,
                5, "MINUTES",
                null, null,
                null
        );

        mockMvc.perform(post("/api/schedules")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void getSchedules_Unauthenticated_ReturnsUnauthorized() throws Exception {
        mockMvc.perform(get("/api/schedules"))
                .andExpect(status().isUnauthorized());
    }
}
