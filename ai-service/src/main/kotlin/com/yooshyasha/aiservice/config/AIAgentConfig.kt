package com.yooshyasha.aiservice.config

import ai.koog.prompt.executor.llms.SingleLLMPromptExecutor
import org.springframework.beans.factory.BeanCreationException
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class AIAgentConfig(
    @Qualifier("openAIExecutor") private val openaiAIExecutor: SingleLLMPromptExecutor?,
    @Qualifier("anthropicExecutor") private val anthropicAIExecutor: SingleLLMPromptExecutor?,
    @Qualifier("googleExecutor") private val googleAIExecutor: SingleLLMPromptExecutor?,
    @Qualifier("ollamaExecutor") private val ollamaAIExecutor: SingleLLMPromptExecutor?,
    @Qualifier("openRouterExecutor") private val openRouterAIExecutor: SingleLLMPromptExecutor?,
    @Qualifier("deepSeekExecutor") private val deepSeekAIExecutor: SingleLLMPromptExecutor?,
) {
    @Bean
    fun aiExecutor(): SingleLLMPromptExecutor {
        if (openaiAIExecutor != null) return openaiAIExecutor
        if (anthropicAIExecutor != null) return anthropicAIExecutor
        if (googleAIExecutor != null) return googleAIExecutor
        if (ollamaAIExecutor != null) return ollamaAIExecutor
        if (openRouterAIExecutor != null) return openRouterAIExecutor
        if (deepSeekAIExecutor != null) return deepSeekAIExecutor

        throw BeanCreationException("Zero available executors")
    }
}