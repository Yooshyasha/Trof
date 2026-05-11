package com.yooshyasha.aiservice.storage

import io.ktor.util.collections.*
import kotlinx.coroutines.CompletableDeferred
import org.springframework.stereotype.Component
import java.util.*

@Component
class UserAnswerStorage {
    private val answersMap: ConcurrentMap<UUID, CompletableDeferred<String>> = ConcurrentMap()

    fun subscribe(taskId: UUID): CompletableDeferred<String> {
        if (answersMap.containsKey(taskId)) {
            return answersMap[taskId]!!
        }

        answersMap[taskId] = CompletableDeferred()
        return answersMap[taskId]!!
    }

    fun submitAnswer(id: UUID, data: String) {
        answersMap[id]?.complete(data)
    }

    fun remove(taskId: UUID) {
        answersMap.remove(taskId)
    }
}