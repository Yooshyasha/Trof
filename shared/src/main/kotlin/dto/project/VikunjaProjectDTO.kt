package dto.project

data class VikunjaProjectDTO(
    val id: Int,
    val name: String,
    val tasks: List<VikunjaTaskDTO>,
)