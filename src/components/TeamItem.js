import React from "react";
import './TeamItem.css'

// Component for displaying one team card in the team search
function TeamItem(props) {
    return (
        <div className="team-item">
            <h2 className="team-item-header">
                <span className="span">{props.item.year + " "}</span>
                {" " + props.item.title}</h2>
            <p className="team-item-descr">{props.item.description}</p>
            <p className="team-item-wiki">{"wiki: "}
                <a className="wiki-link"
                   href={"https://igem.org/Team.cgi?team_id=" + props.item.teamId}
                   target="_blank"
                   rel="noopener noreferrer">
                    {"https://igem.org/Team.cgi?team_id=" + props.item.teamId}
                </a>
            </p>
            <hr/>
        </div>
    )
}

export default TeamItem