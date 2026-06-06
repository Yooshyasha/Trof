package com.yooshyasha.backend.dto.controller

import enum.TaskDepth
import jakarta.validation.constraints.NotBlank
import org.meeuw.i18n.languages.ISO_639_1_Code

data class RequestStartGenerate(
    @NotBlank val text: String,
    val projectId: Int?,
    val language: ISO_639_1_Code,
    val taskDepth: TaskDepth,
)
