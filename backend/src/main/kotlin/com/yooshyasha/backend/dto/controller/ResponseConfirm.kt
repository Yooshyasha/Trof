package com.yooshyasha.backend.dto.controller

import dto.GeneratedTasksResponse

data class ResponseConfirm(
    val success: Boolean,
    val tasks: GeneratedTasksResponse,
)
