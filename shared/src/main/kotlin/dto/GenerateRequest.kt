package dto

import dto.project.VikunjaProjectDTO
import enum.TaskDepth
import org.meeuw.i18n.languages.ISO_639_1_Code

data class GenerateRequest(
    val text: String,
    val vikunjaProject: VikunjaProjectDTO?,
    val language: ISO_639_1_Code,
    val taskDepth: TaskDepth,
)
