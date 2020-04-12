import biobricks.BiobrickPart
import biobricks.BiobricksScraper
import com.github.kittinunf.fuel.core.await
import com.github.kittinunf.fuel.core.awaitResponse
import com.github.kittinunf.fuel.core.extensions.authentication
import com.github.kittinunf.fuel.core.extensions.jsonBody
import com.github.kittinunf.fuel.core.isServerError
import com.github.kittinunf.fuel.coroutines.awaitString
import com.github.kittinunf.fuel.coroutines.awaitStringResponse
import com.github.kittinunf.fuel.coroutines.awaitStringResponseResult
import com.github.kittinunf.fuel.coroutines.awaitStringResult
import com.github.kittinunf.fuel.httpPost
import com.github.kittinunf.result.failure
import igemteam.IgemTeamScraper
import kotlinx.serialization.ImplicitReflectionSerializer
import kotlinx.serialization.UnstableDefault
import kotlinx.serialization.json.*
import kotlinx.serialization.parse
import kotlinx.serialization.stringify

lateinit var authToken: String
lateinit var baseUrl: String

suspend fun main(args: Array<String>) {
    if (args.size < 2) throw IllegalArgumentException("Provide email and password as program arguments")

    // Parse server url from arguments
    baseUrl = args.getOrElse(2) { "http://localhost:3001" }

    login(args[0], args[1])

    parseIgemTeams()
    parseBiobricks()
}

@OptIn(UnstableDefault::class)
suspend fun login(email: String, password: String) {
    println("Attempting login...")

    val (request, response, result) = "$baseUrl/user/login".httpPost().jsonBody(
        """{
            "email": "$email",
            "password": "$password"
        }
        """
    ).awaitStringResponseResult()

    // Quit on login failure
    result.failure {
        when {
            it.response.isServerError -> throw IllegalArgumentException("Incorrect login details.")
        }
    }

    val responseJson = Json(JsonConfiguration.Default).parseJson(result.get()).jsonObject

    println("Server responded to login request with: " + responseJson["message"])
    authToken = responseJson["token"]!!.content
}

@OptIn(ImplicitReflectionSerializer::class)
fun parseIgemTeams() {
    val teams = IgemTeamScraper.loadTeamList()
    println(teams)

    println(teams[0].url)

    val parsedTeams = teams.asSequence().map {
        IgemTeamScraper.parseTeamPage(it)
    }.forEach {
        val parsedTeamJson = Json(JsonConfiguration.Stable).stringify(it)
        println(parsedTeamJson)

        // Send to node
        "$baseUrl/teams".httpPost().authentication().bearer(authToken)
            .jsonBody(parsedTeamJson)
            .also { println(it) }
            .response { result -> println(result) }
    }
}

@OptIn(ImplicitReflectionSerializer::class)
fun parseBiobricks() {
    val partsList = BiobricksScraper.parsePartList()

    partsList.asSequence().map {
        BiobricksScraper.parsePart(it)
    }.forEach {
        val parsedBiobrickJson = Json(JsonConfiguration.Stable).stringify(it)
        println(parsedBiobrickJson)

        // Send to node
        "$baseUrl/biobricks".httpPost().authentication().bearer(authToken)
            .jsonBody(parsedBiobrickJson)
            .also {
                println(it)
            }
            .response { result -> println(result) }
    }
}