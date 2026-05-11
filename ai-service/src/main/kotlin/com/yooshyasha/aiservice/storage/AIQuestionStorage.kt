package com.yooshyasha.aiservice.storage

import com.yooshyasha.aiservice.exceptions.ai.UserInputAlreadyRequired
import io.ktor.util.collections.*
import org.springframework.stereotype.Component
import java.util.*

@Component
class AIQuestionStorage {
    private val questionsMap: ConcurrentMap<UUID, String> = ConcurrentMap()

    fun save(id: UUID, data: String) {
        if (questionsMap.containsKey(id)) {
            throw UserInputAlreadyRequired()
        }

        questionsMap[id] = data
    }

    fun getQuestion(taskId: UUID) = questionsMap[taskId]

    fun remove(taskId: UUID) {
        questionsMap.remove(taskId)
    }
}