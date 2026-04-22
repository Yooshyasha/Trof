package com.yooshyasha.backend.dto.entity

import dto.project.VikunjaTaskDTO

data class InProcessDTO(
    val projectId: Int?,
    val tasks: List<VikunjaTaskDTO> = listOf(),
)
