package com.scheduler.service;

import com.scheduler.dto.CreateScheduleRequest;
import com.scheduler.entity.ScheduleType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

class CronExpressionServiceTest {

    private CronExpressionService cronExpressionService;

    @BeforeEach
    void setUp() {
        cronExpressionService = new CronExpressionService();
    }

    @Test
    void generateCronExpression_OneTime_Success() {
        LocalDateTime dateTime = LocalDateTime.of(2024, 6, 15, 14, 30, 0);
        CreateScheduleRequest request = new CreateScheduleRequest(
                null, "Test", ScheduleType.ONE_TIME,
                null, dateTime, null, null, null, null, null
        );

        String cron = cronExpressionService.generateCronExpression(request);

        assertEquals("0 30 14 15 6 ? 2024", cron);
    }

    @Test
    void generateCronExpression_RecurringMinutes_Success() {
        CreateScheduleRequest request = new CreateScheduleRequest(
                null, "Test", ScheduleType.RECURRING,
                null, null, 15, "MINUTES", null, null, null
        );

        String cron = cronExpressionService.generateCronExpression(request);

        assertEquals("0 0/15 * * * ?", cron);
    }

    @Test
    void generateCronExpression_RecurringHours_Success() {
        CreateScheduleRequest request = new CreateScheduleRequest(
                null, "Test", ScheduleType.RECURRING,
                null, null, 2, "HOURS", null, null, null
        );

        String cron = cronExpressionService.generateCronExpression(request);

        assertEquals("0 0 0/2 * * ?", cron);
    }

    @Test
    void generateCronExpression_Weekly_Success() {
        CreateScheduleRequest request = new CreateScheduleRequest(
                null, "Test", ScheduleType.WEEKLY,
                null, null, null, null, "MON,WED,FRI", "10:30", null
        );

        String cron = cronExpressionService.generateCronExpression(request);

        assertEquals("0 30 10 ? * MON,WED,FRI", cron);
    }

    @Test
    void generateCronExpression_Cron_ReturnsAsIs() {
        String customCron = "0 0 12 * * ?";
        CreateScheduleRequest request = new CreateScheduleRequest(
                null, "Test", ScheduleType.CRON,
                customCron, null, null, null, null, null, null
        );

        String cron = cronExpressionService.generateCronExpression(request);

        assertEquals(customCron, cron);
    }

    @Test
    void generateCronExpression_OneTime_NullStartTime_ThrowsException() {
        CreateScheduleRequest request = new CreateScheduleRequest(
                null, "Test", ScheduleType.ONE_TIME,
                null, null, null, null, null, null, null
        );

        assertThrows(IllegalArgumentException.class, () ->
                cronExpressionService.generateCronExpression(request));
    }

    @Test
    void generateCronExpression_Recurring_InvalidUnit_ThrowsException() {
        CreateScheduleRequest request = new CreateScheduleRequest(
                null, "Test", ScheduleType.RECURRING,
                null, null, 5, "WEEKS", null, null, null
        );

        assertThrows(IllegalArgumentException.class, () ->
                cronExpressionService.generateCronExpression(request));
    }
}
