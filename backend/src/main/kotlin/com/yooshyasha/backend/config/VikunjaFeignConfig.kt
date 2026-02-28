package com.yooshyasha.backend.config

import feign.RequestInterceptor
import org.springframework.context.annotation.Bean
import org.springframework.stereotype.Component

@Component
class VikunjaFeignConfig(
    private val config: VikunjaConfig
) {
    @Bean
    fun requestInterceptor(): RequestInterceptor {
        return RequestInterceptor { template ->
            template.header("Authorization", config.vikunjaAuthorization())
        }
    }
}