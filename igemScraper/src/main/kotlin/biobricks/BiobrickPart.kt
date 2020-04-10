package biobricks

import kotlinx.serialization.Serializable

@Serializable
class BiobrickPart {
    var title: String? = null
    var content: String? = null
    var url: String? = null
}