import biobricks.BiobricksScraper
import com.github.kittinunf.fuel.core.extensions.authentication
import com.github.kittinunf.fuel.core.extensions.jsonBody
import com.github.kittinunf.fuel.core.isServerError
import com.github.kittinunf.fuel.coroutines.awaitStringResponseResult
import com.github.kittinunf.fuel.httpPost
import com.github.kittinunf.result.failure
import igemteam.IgemTeamScraper
import kotlinx.serialization.ImplicitReflectionSerializer
import kotlinx.serialization.UnstableDefault
import kotlinx.serialization.json.*
import kotlinx.serialization.stringify
import kotlin.system.exitProcess

lateinit var authToken: String
lateinit var baseUrl: String
lateinit var fileStorage: String

suspend fun main(args: Array<String>) {
    if (args.getOrNull(0) == "help"){
        println("Usage: igemScraper email password [backend server url] [save to file instead of DB (write 'file')]")
        exitProcess(0)
    }

    if (args.size < 2) throw IllegalArgumentException("Provide email and password as program arguments")

    // Parse server url from arguments
    baseUrl = args.getOrElse(2) { "http://localhost:3001" }

    // Parse to save to file or to db
    var fileStorring: String = args.getOrElse(3) { "" }
    if (fileStorring.length != 0) {fileStorage = "/" + fileStorring} else {fileStorage = ""}

    //login(args[0], args[1])

    parseIgemTeams()
    parseBiobricks()

    "$baseUrl/teams/copy_file".httpPost()
            .jsonBody("{}")
            .response { result -> println(result) }
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
    println(teams.size)

    println(teams[0].url)

    val parsedTeams = teams.asSequence().take(teams.size).map {
        IgemTeamScraper.parseTeamPage(it)
    }.forEach {
        val parsedTeamJson = Json(JsonConfiguration.Stable).stringify(it)
        println(parsedTeamJson)

        // Send to node
        "$baseUrl/teams$fileStorage".httpPost()/*.authentication().bearer(authToken)*/
            .jsonBody(parsedTeamJson)
            .also { println(it) }
            .response { result -> println(result) }
    }
}

@OptIn(ImplicitReflectionSerializer::class)
fun parseBiobricks() {
    BiobricksScraper.partListsUrls.asSequence()
        .flatMap { BiobricksScraper.parsePartList(it).asSequence() }
        /*.take(100)*/
        .map {
            BiobricksScraper.parsePart(it)
        }.forEach {
            val parsedBiobrickJson = Json(JsonConfiguration.Stable).stringify(it)
            println(parsedBiobrickJson)

            // Send to node
            "$baseUrl/biobricks$fileStorage".httpPost()/*.authentication().bearer(authToken)*/
                .jsonBody(parsedBiobrickJson)
                .also {
                    println(it)
                }
                .response { result -> println(result) }
        }
    println(BiobricksScraper.partListsUrls.size)
}