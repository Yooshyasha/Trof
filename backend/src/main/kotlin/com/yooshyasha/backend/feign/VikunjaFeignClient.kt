package com.yooshyasha.backend.feign

import com.yooshyasha.backend.config.VikunjaFeignConfig
import com.yooshyasha.backend.dto.api.ProjectRequest
import com.yooshyasha.backend.dto.api.ProjectResponse
import com.yooshyasha.backend.dto.api.TaskRequest
import com.yooshyasha.backend.dto.api.TaskResponse
import org.springframework.cloud.openfeign.FeignClient
import org.springframework.http.MediaType
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestHeader

@FeignClient(
    name = "vikunjaClient",
    url = "\${vikunja.url}",
    configuration = [VikunjaFeignConfig::class]
)
interface VikunjaClient {
    @PostMapping("/projects", consumes = [MediaType.APPLICATION_JSON_VALUE])
    fun createProject(
        @RequestHeader("Authorization") auth: String,
        @RequestBody request: ProjectRequest
    ): ProjectResponse

    @PostMapping("/tasks", consumes = [MediaType.APPLICATION_JSON_VALUE])
    fun createTask(
        @RequestHeader("Authorization") auth: String,
        @RequestBody request: TaskRequest
    ): TaskResponse
}