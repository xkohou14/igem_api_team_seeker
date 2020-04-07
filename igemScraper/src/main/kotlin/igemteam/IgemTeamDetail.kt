package igemteam

class IgemTeamDetail: IgemTeam() {
    var kind: String? = null
    var teamCode: String? = null
    var division: String? = null

    var schoolAddress: String? = null

    var title: String? = null
    var abstract: String? = null

    var primaryPi: IgemUser? = null
    var secondaryPi: IgemUser? = null

    var instructors: List<IgemUser> = emptyList()
    var studentLeaders: List<IgemUser> = emptyList()
    var studentMembers: List<IgemUser> = emptyList()
    var advisors: List<IgemUser> = emptyList()
}