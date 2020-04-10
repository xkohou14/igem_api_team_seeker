import React from "react";

// Component for displaying one team card in the main page
function TeamItem(props) {
    return (
        <div className="team-item">
            <h1>{props.item.title}</h1>
            <p>{props.item.description}</p>
            <p>year: {props.item.year}</p>
            <p>wiki: {props.item.wiki}</p>
            <hr/>
        </div>
    )
}

export default TeamItem