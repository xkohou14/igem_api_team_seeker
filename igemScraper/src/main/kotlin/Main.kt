import com.github.kittinunf.fuel.core.extensions.jsonBody
import com.github.kittinunf.fuel.httpPost
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

    val parsedTeams = teams.asSequence().take(5).map {
        IgemTeamScraper.parseTeamPage(it)
    }.forEach {
        val parsedTeamJson = Json(JsonConfiguration.Stable).stringify(it)
        println(parsedTeamJson)

        // Send to node
        "http://localhost:3001/teams".httpPost().jsonBody(parsedTeamJson)
            .also { println(it) }
            .response { result -> }
    }

}