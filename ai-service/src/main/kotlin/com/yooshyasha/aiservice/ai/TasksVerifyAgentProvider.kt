package com.yooshyasha.aiservice.ai

import ai.koog.agents.core.agent.AIAgent
import ai.koog.prompt.executor.llms.MultiLLMPromptExecutor
import ai.koog.prompt.llm.LLModel
import com.yooshyasha.aiservice.ai.base.BaseAgentProvider
import com.yooshyasha.aiservice.dto.ai.VerifyTasksResult
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.stereotype.Component
import java.util.*

@Component
class TasksVerifyAgentProvider(
    @Qualifier("aiExecutor") private val aiExecutor: MultiLLMPromptExecutor,
    private val llModel: LLModel,
    private val verifySystemPrompt: String,
) : BaseAgentProvider<String, VerifyTasksResult> {
    override fun provideAgent(futureId: UUID): AIAgent<String, VerifyTasksResult> {
        return provideAgent(verifySystemPrompt, futureId)
    }

    override fun provideAgent(
        systemPrompt: String,
        futureId: UUID
    ): AIAgent<String, VerifyTasksResult> {
        // TODO
    }
}