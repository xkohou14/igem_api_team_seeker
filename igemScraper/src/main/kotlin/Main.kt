import igemteam.IgemTeamScraper
import kotlinx.serialization.ImplicitReflectionSerializer
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.JsonConfiguration
import kotlinx.serialization.stringify

@OptIn(ImplicitReflectionSerializer::class)
fun main() {
    val teams = IgemTeamScraper.loadTeamList()
    println(teams)

    println(teams[0].url)

    val parsedTeam = IgemTeamScraper.parseTeamPage(teams[0])
    println(parsedTeam)


    val parsedTeamJson = Json(JsonConfiguration.Stable).stringify(parsedTeam)
    println(parsedTeamJson)
}