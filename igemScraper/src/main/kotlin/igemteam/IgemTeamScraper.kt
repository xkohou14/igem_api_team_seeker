package igemteam

import com.opencsv.bean.CsvBindByName
import com.opencsv.bean.CsvToBeanBuilder
import it.skrape.core.fetcher.Mode
import it.skrape.core.htmlDocument
import it.skrape.extract
import it.skrape.matchers.toBe
import it.skrape.selects.html5.table
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

    /**
     *  Fills detailed information to the team object from the team page
     */
    fun parseTeamPage(team: IgemTeam) = skrape {
        this.mode = Mode.DOM
        this.url =
            team.url ?: throw IllegalStateException("Cannot get team url. Check if team id is successfully parsed.")
        this.sslRelaxed = true

        extract {
            htmlDocument {
                val infoTable = findFirst("#table_info")
                val infoRows = infoTable.findAll("tr")

                val titleAbstractTable = findFirst("#table_abstract")

                team.apply {
                    kind = infoRows[3].allElements[2].text
                    teamCode = infoRows[1].allElements[2].text
                    division = infoRows[4].allElements[2].text

                    schoolAddress = infoRows[2].allElements[2].text

                    title = titleAbstractTable.findFirst("td").text
                    abstract = titleAbstractTable.findAll("tr")[1].text

//TODO parse team people

//                    primaryPi =
//                    secondaryPi =
//
//                    instructors =
//                    studentLeaders =
//                    studentMembers =
//                    advisors =
                }
            }
        }
    }
}