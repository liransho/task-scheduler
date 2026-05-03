package com.scheduler.job.task;

import com.scheduler.entity.TaskType;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Component
@Slf4j
public class HttpRequestTask implements ExecutableTask {

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public TaskType getTaskType() {
        return TaskType.HTTP_REQUEST_TASK;
    }

    @Override
    public void execute(Map<String, String> parameters) {
        String url = parameters.get("url");
        if (url == null || url.isBlank()) {
            throw new IllegalArgumentException("URL is required for HTTP Request task");
        }

        String method = parameters.getOrDefault("method", "GET").toUpperCase();

        log.info("[HTTP_REQUEST_TASK] Making {} request to: {}", method, url);

        try {
            String response = switch (method) {
                case "GET" -> restTemplate.getForObject(url, String.class);
                case "POST" -> restTemplate.postForObject(url, null, String.class);
                default -> {
                    log.warn("Unsupported method: {}, defaulting to GET", method);
                    yield restTemplate.getForObject(url, String.class);
                }
            };

            log.info("[HTTP_REQUEST_TASK] Response received, length: {} chars",
                    response != null ? response.length() : 0);

        } catch (Exception e) {
            log.error("[HTTP_REQUEST_TASK] Request failed: {}", e.getMessage());
            throw new RuntimeException("HTTP request failed", e);
        }
    }
}
