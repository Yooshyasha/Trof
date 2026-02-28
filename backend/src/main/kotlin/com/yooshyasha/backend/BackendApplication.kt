package com.yooshyasha.backend

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.cloud.openfeign.EnableFeignClients

@SpringBootApplication
@EnableFeignClients
class BackendApplication

fun main(args: Array<String>) {
    runApplication<BackendApplication>(*args)
}
