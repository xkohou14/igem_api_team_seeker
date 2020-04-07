package igemteam

import com.opencsv.bean.CsvBindByName
import com.opencsv.bean.CsvToBeanBuilder
import it.skrape.core.htmlDocument
import it.skrape.extract
import it.skrape.matchers.toBe
import it.skrape.skrape
import java.io.InputStreamReader
import java.net.URL
import java.time.LocalDateTime


object IgemTeamScraper {

    private const val CSV_DATA_URL = "https://igem.org/Team_List.cgi?year=all&team_list_download=1&show_all=0"

    /**
     *  Loads and parses the csv with teams provided by iGEM
     */
    fun loadTeamList(): List<IgemTeam> {
        val csvUrl = URL(CSV_DATA_URL)
        val csvStream = InputStreamReader(csvUrl.openStream())

        val teams = CsvToBeanBuilder<IgemTeam>(csvStream).withType(
            IgemTeam::class.java
        ).build().parse()
        return teams
    }

    fun parseTeamPage(team: IgemTeam) = skrape {
        this.url = team.url ?: throw IllegalStateException("Cannot get team url. Check if team id is successfully parsed.")
        this.sslRelaxed = true

        extract {
            htmlDocument {
                val infoTable = findFirst("tbody")
                val infoRows = infoTable.findAll("*")

                IgemTeamDetail().apply {
                    kind = infoRows[3].findAll("td")[1].text
//                    teamCode =
//                    division =
//
//                    schoolAddress =
//
//                    title =
//                    abstract =
//
//                    primaryPi =
//                    secondaryPi =
//
//                    instructors =
//                    studentLeaders =
//                    studentMembers =
//                    advisors =

//                    title = findFirst("[itemprop=headline]").text,
//                    symbol = findFirstOrNull("[sasource=mc_about]")?.attribute("href")
//                        ?.let { it.substring(1 + it.indexOfLast { it == '/' }) },
//                    author = findFirst("a[rel=author] [itemprop=name]").text,
//                    text = findFirst("#bullets_ul").text,
//                    id = "0",
//                    date = LocalDateTime.from(dateFormat.parse(findFirst("[itemprop=\"datePublished\"]").attribute("content"))),
//                    fullArticleUrl = url
                }
            }
        }
    }
}