import React, {Component} from "react";
import BioBricksItem from "./BioBricksItem";
import './SearchBar.css';

class SearchBarBioBricks extends Component {
    constructor(props) {
        super(props);
        this.state = {
            search: '',
            results: [],
            title: true,
            content: true,
            contain: true
        }
        this.tags = ["title", "content"]
        this.master = this.props.master
        this.query = {}
        this.handleOnClick = this.handleOnClick.bind(this)
        this.fetchData = this.fetchData.bind(this)
    }

    handleOnClick(e) {
        e.preventDefault();
        // console.log("clicked search button " + this.state.search);
        console.log(this.query)
        this.fetchData()
    }

    handleOnClickBio(event) {
        event.preventDefault();
        this.master.clickMaster();
    }

    checkChanged(event) {
        if (event.target.checked) {
            this.query[event.target.name] = [{
                contain: this.state.contain,
                value: this.state.search
            }];
            console.log(this.query)
        }
    }

    checkContainsChanged() {
        this.setState({
            contain: !this.state.contain
        })
    }

    fetchData() {
        console.log("Handling query: " + JSON.stringify(this.query, ' ', 4))
        fetch("http://localhost:3001/biobricks/match", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.query)
        })
            .then(response => response.json())
            .then(responseData => {
                console.log("Response: " + JSON.stringify(responseData, ' ', 4))
                this.setState({
                    results: responseData.map(item => ({
                        title: item.title,
                        year: item.year,
                        description: item.content,
                        wiki: item.url,
                    }))
                })
            })
    }

    onInputChange(event) {
        this.setState({
            search: event.target.value.toString().toLowerCase()
        })
        this.fetchData()
    }

    render() {
        const filteredTeams = this.state.search.length > 0 && this.state.results.length > 0 ? this.state.results : this.props.items
        // console.log(this.state.search.length > 0 && this.state.results.length > 0 ? "res:" + this.state.results : "it:" + this.props.items)

        // This function maps TeamItem Component to every search result object
        const bioComponents = filteredTeams.filter(item => item.title !== undefined).map(item => {
                return (
                    <BioBricksItem key={item.id} item={item}/>
                )
            }
        );

        const checks = this.tags.map(element => {
            return (
                <div className="checkbox-tag">
                    <label>
                        {element}
                    </label>
                    <input
                        type="checkbox"
                        name={element}
                        defaultChecked={true}
                        checked={this.state.element}
                        onChange={this.checkChanged.bind(this)}
                    />
                </div>
            )
        })

        return (
            <div>
                <h1 className="App-header">BioBricks Seeker</h1>
                <button
                    className="btn-search"
                    type="submit"
                    onClick={this.handleOnClickBio.bind(this)}>
                    Teams
                </button>
                <form className="form">
                    <input
                        className="search"
                        type="text"
                        value={this.state.search}
                        placeholder={"Search for BioBricks ..."}
                        onChange={this.onInputChange.bind(this)}/>
                    <button
                        className="btn-search"
                        type="submit"
                        onClick={this.handleOnClick}>
                        Search
                    </button>
                    <div>
                        <div className="checkbox-tag">
                            <label>
                                contains
                            </label>
                            <input
                                type="checkbox"
                                name="contains"
                                defaultChecked={true}
                                checked={this.state.contain}
                                onChange={this.checkContainsChanged.bind(this)}
                            />
                        </div>
                        {checks}
                    </div>
                </form>
                <div>
                    {bioComponents}
                </div>
            </div>
        )
    }
}

export default SearchBarBioBricks