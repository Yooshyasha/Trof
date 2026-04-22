package com.yooshyasha.backend.dto.controller

import jakarta.validation.constraints.NotBlank

data class RequestStartGenerate(
    @NotBlank val text: String,
    val projectId: Int?,
)
