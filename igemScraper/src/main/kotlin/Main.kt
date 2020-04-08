import igemteam.IgemTeamScraper

fun main() {
    val teams = IgemTeamScraper.loadTeamList()
    println(teams)

    println(teams[0].url)

    val parsedTeam = IgemTeamScraper.parseTeamPage(teams[0])
    println(parsedTeam)

}