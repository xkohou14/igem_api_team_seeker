import React, {Component} from "react";
import './App.css'
import SearchBarTeams from "./SearchBarTeams";
import SearchBarBioBricks from "./SearchBarBioBricks";

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoaded: false,
            teams : [],
            biobricks : [],
            isTeams: true
        }
    }

    componentDidMount() {
        this.setState({isLoaded: true})

        fetch("http://localhost:3001/teams", {})
            .then(response => response.json())
            .then(responseData => {
                this.setState({
                    isLoaded : true,
                    teams: responseData.map(item => ({
                        title: item.title,
                        year: item.year,
                        description: item.abstract,
                        teamId: item.teamId
                    }))
                })
                // console.log("Response in Teams: " + JSON.stringify(responseData, ' ', 4))
            })

        fetch("http://localhost:3001/biobricks", {})
            .then(response => response.json())
            .then(responseData => {
                this.setState({
                    isLoaded : true,
                    biobricks: responseData.map(item => ({
                        title: item.title,
                        description: item.content,
                        wiki: item.url,
                    }))
                })
                // console.log("Response in bio: " + JSON.stringify(responseData, ' ', 4))
            })
    }

    clickMaster() {
        this.setState({
            isTeams: !this.state.isTeams
        })
    }

    render() {
        return (
            // const text = this.state.isLoaded ? "loading..." : null;

            // Here we return searchbar according to isTeams value
            <div className="App">
                    {this.state.isTeams ? <SearchBarTeams
                        items={this.state.teams}
                        master={this}
                    /> : <SearchBarBioBricks
                        items={this.state.biobricks}
                        master={this}
                    />}

                    {/*<p>{text}</p>*/}
            </div>
        )
    }
}

export default App