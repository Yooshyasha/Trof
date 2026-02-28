package com.yooshyasha.backend.controller

import com.yooshyasha.backend.dto.controller.RequestConfirmTasks
import com.yooshyasha.backend.dto.controller.ResponseConfirm
import com.yooshyasha.backend.service.GenerationService
import dto.GenerateRequest
import dto.ResponseGetTaskStatus
import dto.ResponsePostGenerate
import org.springframework.web.bind.annotation.*
import java.util.*

@RestController
@RequestMapping("/v1/api/generation")
class GenerationController(
    private val generationService: GenerationService
) {
    @PostMapping("/")
    fun generate(@RequestBody data: GenerateRequest): ResponsePostGenerate {
        return generationService.generate(data)
    }

    @GetMapping("/{taskId}")
    fun getTask(@PathVariable taskId: UUID): ResponseGetTaskStatus {
        return generationService.getTask(taskId)
    }

    @PostMapping("/{taskId}/confirm")
    fun confirm(@PathVariable taskId: UUID, @RequestBody data: RequestConfirmTasks): ResponseConfirm {
        return generationService.confirm(taskId, data)
    }
}