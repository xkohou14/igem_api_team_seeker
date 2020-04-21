import React from "react";
import './TeamItem.css'

// Component for displaying one team item in the team search
function TeamItem(props) {
    return (
        <div className="team-item">
            <h2 className="team-item-header">
                <span>{props.item.year + " "}</span>
                {" " + props.item.title}</h2>
            <h2 className="team-item-header">
                <span className="span-name">{"Country: "}</span>
                {props.item.country}
            </h2>
            <h2 className="team-item-header">
                <span className="span-name">{"School: "}</span>
                {console.log(props.item.schoolAddress)}
                {props.item.schoolAddress !== undefined
                && schoolFormat(props.item.schoolAddress)
                }
            </h2>
            <p className="team-item-descr">{props.item.description}</p>
            <p className="team-item-wiki">{"More info: "}
                <a className="wiki-link"
                   href={"https://igem.org/Team.cgi?team_id=" + props.item.teamId}
                   target="_blank"
                   rel="noopener noreferrer">
                    {"https://igem.org/Team.cgi?team_id=" + props.item.teamId}
                </a>
            </p>
            <p className="team-item-wiki">{"Team wiki: "}
                <a className="wiki-link"
                   href={props.item.wiki}
                   target="_blank"
                   rel="noopener noreferrer">
                    {props.item.wiki}
                </a>
            </p>
            <hr/>
        </div>
    )
}

function schoolFormat(schoolAddress) {
    if(schoolAddress.includes(",")) {
        return schoolAddress.substring(0, schoolAddress.indexOf(","))
    } else if (schoolAddress.includes("http")) {
        return schoolAddress.substring(0, schoolAddress.indexOf("http"))
    } else {
        return schoolAddress
    }
}

export default TeamItem