package biobricks

import it.skrape.core.fetcher.Mode
import it.skrape.core.htmlDocument
import it.skrape.extract
import it.skrape.selects.eachAttribute
import it.skrape.selects.text
import it.skrape.skrape


object BiobricksScraper {

    private const val CONSTITUTIVE_URL = "http://parts.igem.org/Promoters/Catalog/Constitutive"

    /**
     *  Loads and parses the csv with teams provided by iGEM
     */
    fun parsePartList() = skrape {
        this.mode = Mode.DOM
        this.url = CONSTITUTIVE_URL
        this.timeout = 15000

        extract {
            htmlDocument {
                // Get url and name from every part link
                findAll(".part_link").map {
                    BiobrickPart().apply {
                        url = it.attribute("href")
                        title = it.text
                    }
                }
            }
        }
    }

    /**
     *  Fills detailed information to the team object from the team page
     */
    fun parsePart(biobrick: BiobrickPart) = skrape {
//        this.mode = Mode.DOM
        this.timeout = 15000
        this.url = biobrick.url ?: throw IllegalArgumentException("Missing biobrick url")

        extract {
            htmlDocument {
                // Get all text in paragraph elements
                biobrick.apply { content = findAll("p").text }
            }
        }
    }
}