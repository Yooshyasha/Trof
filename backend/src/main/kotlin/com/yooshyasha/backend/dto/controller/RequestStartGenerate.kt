package com.yooshyasha.backend.dto.controller

data class RequestStartGenerate(
    val text: String,
    val projectId: Int?,
)
