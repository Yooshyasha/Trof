package com.yooshyasha.aiservice.ai.tools

import ai.koog.agents.core.tools.annotations.Tool
import ai.koog.agents.core.tools.reflect.ToolSet
import com.yooshyasha.aiservice.storage.AIQuestionStorage
import com.yooshyasha.aiservice.storage.FutureStatusStorage
import com.yooshyasha.aiservice.storage.UserAnswerStorage
import enum.TaskStatus
import kotlinx.coroutines.withTimeout
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component
import java.util.*
import java.util.concurrent.CancellationException
import kotlin.time.Duration.Companion.minutes

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

            val deferred = userAnswerStorage.subscribe(futureId)

            return withTimeout(5.minutes) {
                deferred.await()
            }
        } catch (e: CancellationException) {
            throw e
        } catch (e: Exception) {
            logger.error("Ошибка во время выполнения require user input ($futureId, $message)", e)
            return "Ошибка во время выполнения инструмента: ${e.message}"
        } finally {
            userAnswerStorage.remove(futureId)
            aiQuestionStorage.remove(futureId)
            futureStatusStorage.save(futureId, TaskStatus.ACTIVE)
        }
    }
}