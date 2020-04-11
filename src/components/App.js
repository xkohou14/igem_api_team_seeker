import React, {Component} from "react";
import './App.css'
import SearchBar from "./SearchBar";

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoaded: false,
            items: [],
            biobricks_structure : [],
            // teams_structure : []
        }
    }

    componentDidMount() {
        this.setState({isLoaded: true})

        fetch("http://localhost:3001/teams/structure", {})
            .then(response => response.json())
            .then(responseData => {
                this.setState({
                    isLoaded : true,
                    items: responseData.map(item => ({
                        title: item.name,
                        wiki: item.wiki,
                        year: item.year,
                        description: item.abstract,
                    }))
                })
                console.log("Response in App: " + JSON.stringify(responseData, ' ', 4))
            })

        // fetch("http://localhost:3001/teams/structure")
        //     .then(response => response.json())
        //     .then(responseData => {
        //         console.log("Structure : " + responseData);
        //         this.setState({
        //             ...this.state,
        //             teams_structure : responseData
        //         })
        //     });
        //
        // fetch("http://localhost:3001/biobricks/structure")
        //     .then(response => response.json())
        //     .then(responseData => {
        //         console.log("Structure : " + responseData);
        //         this.setState({
        //             ...this.state,
        //             biobricks_structure : responseData
        //         })
        //     });
    }

    clickMaster() {
        console.log("Someone clicked me.");
    }

    render() {
        if(this.state.isLoaded) {
            // console.log(this.state.items)
        }

        return (
            // const text = this.state.isLoaded ? "loading..." : null;
            <div className="App">
                <nav>
                    <h1 className="App-header">Team Seeker</h1>
                    <SearchBar
                        items={this.state.items}
                        master={this}
                        // team_structure={this.state.teams_structure}
                        // biobricks_structure={[]}
                    />
                    {/*<p>{text}</p>*/}
                </nav>
            </div>
        )
    }
}

export default App