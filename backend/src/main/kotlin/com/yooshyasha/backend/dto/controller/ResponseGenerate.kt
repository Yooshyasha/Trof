package com.yooshyasha.backend.dto.controller

import dto.GeneratedTasksResponse
import dto.project.VikunjaTaskDTO

data class ResponseGenerate(
    val projectId: Int,
    val generatedTasks: GeneratedTasksResponse,
    val editMap: Map<Int, VikunjaTaskDTO>,  // оригинал
)
