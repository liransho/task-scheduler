package com.scheduler.service;

import com.scheduler.dto.CreateScheduleRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.stream.Collectors;

@Service
public class CronExpressionService {

    public String generateCronExpression(CreateScheduleRequest request) {
        return switch (request.scheduleType()) {
            case ONE_TIME -> generateOneTimeCron(request.startTime());
            case RECURRING -> generateRecurringCron(request.intervalValue(), request.intervalUnit());
            case WEEKLY -> generateWeeklyCron(request.daysOfWeek(), request.timeOfDay());
            case CRON -> request.cronExpression();
        };
    }

    private String generateOneTimeCron(LocalDateTime dateTime) {
        if (dateTime == null) {
            throw new IllegalArgumentException("Start time is required for one-time schedules");
        }
        return String.format("%d %d %d %d %d ? %d",
                dateTime.getSecond(),
                dateTime.getMinute(),
                dateTime.getHour(),
                dateTime.getDayOfMonth(),
                dateTime.getMonthValue(),
                dateTime.getYear());
    }

    private String generateRecurringCron(Integer intervalValue, String intervalUnit) {
        if (intervalValue == null || intervalUnit == null) {
            throw new IllegalArgumentException("Interval value and unit are required for recurring schedules");
        }

        return switch (intervalUnit.toUpperCase()) {
            case "MINUTES" -> String.format("0 0/%d * * * ?", intervalValue);
            case "HOURS" -> String.format("0 0 0/%d * * ?", intervalValue);
            case "DAYS" -> String.format("0 0 0 1/%d * ?", intervalValue);
            default -> throw new IllegalArgumentException("Invalid interval unit: " + intervalUnit);
        };
    }

    private String generateWeeklyCron(String daysOfWeek, String timeOfDay) {
        if (daysOfWeek == null || daysOfWeek.isBlank()) {
            throw new IllegalArgumentException("Days of week are required for weekly schedules");
        }

        int hour = 9;
        int minute = 0;

        if (timeOfDay != null && !timeOfDay.isBlank()) {
            String[] parts = timeOfDay.split(":");
            hour = Integer.parseInt(parts[0]);
            minute = parts.length > 1 ? Integer.parseInt(parts[1]) : 0;
        }

        String cronDays = Arrays.stream(daysOfWeek.split(","))
                .map(String::trim)
                .map(this::convertDayToCron)
                .collect(Collectors.joining(","));

        return String.format("0 %d %d ? * %s", minute, hour, cronDays);
    }

    private String convertDayToCron(String day) {
        return switch (day.toUpperCase()) {
            case "MONDAY", "MON" -> "MON";
            case "TUESDAY", "TUE" -> "TUE";
            case "WEDNESDAY", "WED" -> "WED";
            case "THURSDAY", "THU" -> "THU";
            case "FRIDAY", "FRI" -> "FRI";
            case "SATURDAY", "SAT" -> "SAT";
            case "SUNDAY", "SUN" -> "SUN";
            default -> day.toUpperCase().substring(0, 3);
        };
    }
}
