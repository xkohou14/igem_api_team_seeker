import React from "react";
import './TeamItem.css'

// Component for displaying one team card in the main page
function TeamItem(props) {
    return (
        <div className="team-item">
            <h2 className="team-item-header">
                <span className="span">{props.item.year + " "}</span>
                {" " + props.item.title}</h2>
            <p className="team-item-descr">{props.item.description}</p>
            <p className="team-item-wiki">{"wiki: "}
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

export default TeamItem