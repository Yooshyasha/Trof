package com.yooshyasha.aiservice.config

import ai.koog.prompt.executor.llms.MultiLLMPromptExecutor
import ai.koog.prompt.llm.LLModel
import kotlinx.coroutines.runBlocking
import org.springframework.beans.factory.BeanCreationException
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.core.io.ResourceLoader

@Configuration
class AIAgentConfig(
    @Qualifier("multiLLMPromptExecutor") private val multiLLMPromptExecutor: MultiLLMPromptExecutor,
    @Value($$"${ai.model.id}") private val aiModelId: String,
    private val resourceLoader: ResourceLoader,
) {
    // Обертка обусловлена возможностью дальшейшей модификации
    @Bean
    fun aiExecutor(): MultiLLMPromptExecutor {
        return multiLLMPromptExecutor
    }

    @Bean
    fun llModel(): LLModel = runBlocking {
        val availableModels = multiLLMPromptExecutor.models()
        val model = availableModels.firstOrNull { it.id == aiModelId }

        if (model == null) {
            throw BeanCreationException("Ai model id not found, available: $availableModels")
        }

        return@runBlocking model
    }

    @Bean
    fun defaultSystemPrompt(): String =
        resourceLoader
            .getResource("classpath:default_system_prompt.txt")
            .inputStream
            .bufferedReader()
            .readText()

    @Bean
    fun editMarkSystemPrompt(): String =
        resourceLoader
            .getResource("classpath:edit_mark_system_prompt.txt")
            .inputStream
            .bufferedReader()
            .readText()

}