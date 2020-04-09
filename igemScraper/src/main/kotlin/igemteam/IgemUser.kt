package igemteam

@kotlinx.serialization.Serializable
class IgemUser {
    var userId: Int? = null

    var name: String? = null
    var nick: String? = null

    val link get() = userId?.let { "https://igem.org/User_Information.cgi?user_id=$it" }
}