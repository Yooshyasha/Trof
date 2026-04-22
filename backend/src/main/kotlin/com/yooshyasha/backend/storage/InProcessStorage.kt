package com.yooshyasha.backend.storage

import com.yooshyasha.backend.dto.entity.InProcessDTO
import io.ktor.util.collections.*
import org.springframework.stereotype.Component
import java.util.*

@Component
class InProcessStorage {
    private val storage: ConcurrentMap<UUID, InProcessDTO> = ConcurrentMap()

    fun save(taskId: UUID, data: InProcessDTO) {
        storage[taskId] = data
    }

    fun get(taskId: UUID): InProcessDTO? {
        return storage[taskId]
    }

    fun delete(taskId: UUID) {
        storage.remove(taskId)
    }
}
