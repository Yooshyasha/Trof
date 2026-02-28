package com.yooshyasha.aiservice.ai.base

import ai.koog.agents.core.agent.AIAgent

interface BaseAgentProvider<I, R> {
    fun provideAgent(): AIAgent<I, R>
}