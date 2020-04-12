import React, {Component} from "react";
import './App.css'
import SearchBar from "./SearchBar";

// This class renders whole web application
class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            teams: [],
            biobricks: [],
            isTeams: true
        }
    }

    // This function is called only once when the App class renders for the first time
    componentDidMount() {
        // fetch function sends GET request to API for all team data
        fetch("http://localhost:3001/teams", {})
            .then(response => response.json())
            .then(responseData => {
                this.setState({
                    teams: responseData.map(item => ({
                        title: item.title,
                        year: item.year,
                        description: item.abstract,
                        teamId: item.teamId,
                        country: item.country,
                        schoolAddress: item.schoolAddress,
                        wiki: item.wiki
                    }))
                })
            })

        // this fetch gets all biobricks data
        fetch("http://localhost:3001/biobricks", {})
            .then(response => response.json())
            .then(responseData => {
                this.setState({
                    isLoaded: true,
                    biobricks: responseData.map(item => ({
                        title: item.title,
                        description: item.content,
                        wiki: item.url,
                    }))
                })
            })
    }

    // This function switches between rendering search bar for teams or for biobricks
    clickMaster() {
        this.setState({
            isTeams: !this.state.isTeams
        })
    }

    render() {
        return (
            // App class renders particular search bar according to isTeams value
            <div className="App">
                {this.state.isTeams ? <SearchBar
                    items={this.state.teams}
                    master={this}
                    selectedTeams={true}
                /> : <SearchBar
                    items={this.state.biobricks}
                    master={this}
                    selectedTeams={false}
                />}

                {/*{this.state.isTeams ? <SearchBarTeams*/}
                {/*    items={this.state.teams}*/}
                {/*    master={this}*/}
                {/*/> : <SearchBarBioBricks*/}
                {/*    items={this.state.biobricks}*/}
                {/*    master={this}*/}
                {/*/>}*/}
            </div>
        )
    }
}

export default App