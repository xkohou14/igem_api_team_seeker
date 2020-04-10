import React, {Component} from "react";
import './App.css'
import SearchBar from "./SearchBar";

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoaded: false,
            items: []
        }
    }

    componentDidMount() {
        this.setState({isLoaded: true})

        fetch("http://localhost:3001/teams")
            .then(response => response.json())
            .then(responseData => {
                this.setState({
                    items: responseData.map(item => ({
                        title: item.title,
                        wiki: item.wiki,
                        year: item.year,
                        description: item.abstract,
                    }))
                })
            })
    }

    render() {
        if(this.state.isLoaded) {
            console.log(this.state.items)
        }

        return (
            // const text = this.state.isLoaded ? "loading..." : null;
            <div className="App">
                <nav>
                    <h1 className="App-header">Team Seeker</h1>
                    <SearchBar items={this.state.items}/>
                    {/*<p>{text}</p>*/}
                </nav>
            </div>
        )
    }
}

export default App