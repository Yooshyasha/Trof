package com.yooshyasha.aiservice.storage

import io.ktor.util.collections.*
import org.springframework.stereotype.Component
import java.util.*

@Component
class UserAnswerStorage {
    private val answersMap: ConcurrentMap<UUID, String> = ConcurrentMap()

    fun save(id: UUID, data: String) {
        answersMap[id] = data
    }

    fun getAnswer(taskId: UUID) = answersMap[taskId]

    fun remove(taskId: UUID) {
        answersMap.remove(taskId)
    }
}