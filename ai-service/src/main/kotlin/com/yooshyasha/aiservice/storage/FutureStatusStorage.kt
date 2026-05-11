package com.yooshyasha.aiservice.storage

import enum.TaskStatus
import io.ktor.util.collections.*
import org.springframework.stereotype.Component
import java.util.*

@Component
class FutureStatusStorage {
    private val statusMap: ConcurrentMap<UUID, TaskStatus> = ConcurrentMap()

    fun save(id: UUID, data: TaskStatus) {
        statusMap[id] = data
    }

    fun getStatus(taskId: UUID) = statusMap[taskId]

    fun remove(taskId: UUID) {
        statusMap.remove(taskId)
    }
}