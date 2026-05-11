package com.yooshyasha.aiservice.ai.tools

import ai.koog.agents.core.tools.annotations.Tool
import ai.koog.agents.core.tools.reflect.ToolSet
import com.yooshyasha.aiservice.storage.AIQuestionStorage
import com.yooshyasha.aiservice.storage.FutureStatusStorage
import com.yooshyasha.aiservice.storage.UserAnswerStorage
import enum.TaskStatus
import kotlinx.coroutines.delay
import kotlinx.coroutines.withTimeout
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component
import java.util.*
import kotlin.time.Duration.Companion.minutes
import kotlin.time.Duration.Companion.seconds

@Component
class UserInputToolSet(
    private val futureStatusStorage: FutureStatusStorage,
    private val aiQuestionStorage: AIQuestionStorage,
    private val userAnswerStorage: UserAnswerStorage,
) : ToolSet {
    private val logger = LoggerFactory.getLogger(UserInputToolSet::class.java)

    @Tool
    suspend fun requireUserInput(futureId: UUID, message: String): String {
        try {
            futureStatusStorage.save(futureId, TaskStatus.QUESTION)
            aiQuestionStorage.save(futureId, message)

            var answer: String?

            return withTimeout(5.minutes) {
                do {
                    delay(1.seconds)  //
                    answer = userAnswerStorage.getAnswer(futureId)
                } while (answer == null)

                return@withTimeout answer
            }
        } catch (e: Exception) {
            logger.error("Ошибка во время выполнения require user input ($futureId, $message)", e)
            return "Ошибка во время выполнения инструмента: ${e.message}"
        }
    }
}