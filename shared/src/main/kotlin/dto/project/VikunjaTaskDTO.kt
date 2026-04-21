package dto.project

import enum.project.VikunjaTaskStatus

data class VikunjaTaskDTO(
    val id: Int,
    val name: String,
    val description: String,
    val status: VikunjaTaskStatus,
)
