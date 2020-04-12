import React, {Component} from "react";
import TeamItem from "./TeamItem";
import BioBricksItem from "./BioBricksItem";
import './SearchBar.css';

// This class creates search bar for teams or biobricks
class SearchBar extends Component {
    constructor(props) {
        super(props);
        const option = this.props.selectedTeams ? "abstract" : "content"
        this.state = {
            search: '',
            results: [],
            isTeams: true,
            selectedOption: option,
            contain: true
        }
        this.tagsBio = ["title", "content"]
        this.tagsTeams = ["title", "year", "school", "country", "abstract"]
        this.master = this.props.master
        this.query = {}
        this.fetchData = this.fetchData.bind(this)
        this.addToQuery = this.addToQuery.bind(this)
    }

    // This function handles search button click
    handleOnClick(event) {
        event.preventDefault();
        this.fetchData()
    }

    // This function handles click on switch search bar button
    async handleOnClickSwitchSearch(event) {
        event.preventDefault();
        await this.setState(prevState => ({
            isTeams: !prevState.isTeams
        }));

        this.state.isTeams ? this.setState({
            selectedOption: "abstract"
        })
        : this.setState({
            selectedOption: "content"
        })
        this.master.clickMaster();
    }

    // This function handles enter key press
    handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            this.fetchData()
        }
    }

    // This function adds parameter to POST query, where property name is "tag" variable
    addToQuery(tag) {
        this.query = {}

        // if the tag name is year and search text includes alphabet characters, don't include it to query
        if (tag === "year" && this.state.search.match(/^$|^[A-Za-z]+$/))
            return

        if (tag === "school")
            tag = "schoolAddress"

        // build query according to current text in search bar and if the contain checkbox is checked
        // name of the property is derived from name of currently checked radio button
        this.query[tag] = [{
            contain: this.state.contain,
            value: this.state.search
        }];
        // after constructing a query we send a request to API
        this.fetchData()
    }

    // This function sets new state of radio button and adds new property to query
    async checkChanged(event) {
        await this.setState({
            selectedOption: event.target.value
        })
        this.addToQuery(this.state.selectedOption)
    }

    // This function sets new state of "contains" checkbox and adds new property to query
    checkContainsChanged() {
        this.setState({
            contain: !this.state.contain
        })
        this.addToQuery(this.state.selectedOption)
    }

    // This function sets new value to property each time something to search is written
    async onInputChange(event) {
        await this.setState({
            search: event.target.value
        })
        this.addToQuery(this.state.selectedOption)
    }

    // This function build and send POST request to API with created query
    fetchData() {
        const input = this.state.isTeams ? "teams" : "biobricks"
        fetch("http://localhost:3001/" + input + "/match", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.query)
        })
            .then(response => response.json())
            .then(responseData => {
                this.setState(this.state.isTeams ? {
                        results: responseData.map(item => ({
                            title: item.title,
                            year: item.year,
                            description: item.abstract,
                            teamId: item.teamId,
                            country: item.country,
                            schoolAddress: item.schoolAddress,
                            wiki: item.wiki
                        }))
                    }
                    : {
                        results: responseData.map(item => ({
                            title: item.title,
                            year: item.year,
                            description: item.content,
                            wiki: item.url,
                        }))
                    })
            })
    }

    render() {
        // If there are no search results return default list of all items
        const itemList = this.state.search.length > 0 && this.state.results.length > 0 ? this.state.results : this.props.items

        // This function maps item Component to every search result object
        const itemComponents = itemList.filter(item => item.title !== undefined).map(item => {
                return (this.state.isTeams ?
                        <TeamItem key={item.id} item={item}/> :
                        <BioBricksItem key={item.id} item={item}/>
                )
            }
        );

        // Here is every item from "tags" maps on radio buttons and binded with their functionality
        const tags = this.state.isTeams ? this.tagsTeams : this.tagsBio
        const checks = tags.map(element => {
            return (
                <div className="radio-tag" >
                    <label >
                        {element}
                    </label>
                    <input
                        type="radio"
                        value={element}
                        checked={this.state.selectedOption === element}
                        onChange={this.checkChanged.bind(this)}
                    />
                </div>
            )
        })

        const searchTag = "Search for " + (this.state.isTeams ? "teams" : "biobricks") + " ..."

        // Here the search bar and search results are rendered
        return (
            <div>
                <h1 className="App-header">
                    {this.state.isTeams ? "Team" : "BioBricks"} Seeker
                </h1>
                <button
                    className="btn-switch"
                    type="submit"
                    onClick={this.handleOnClickSwitchSearch.bind(this)}>
                    {this.state.isTeams ? "BioBricks" : "Teams"}
                </button>
                <button
                    className="btn-search"
                    type="submit"
                    onClick={this.handleOnClick.bind(this)}>
                    Search
                </button>
                <form className="form">
                    <input
                        className="search"
                        type="text"
                        onKeyDown={this.handleKeyDown.bind(this)}
                        value={this.state.search}
                        placeholder={searchTag}
                        onChange={this.onInputChange.bind(this)}
                    />
                </form>
                <div>
                    <div className="radio-tag">
                        <label>
                            contains
                        </label>
                        <input
                            type="checkbox"
                            name="contains"
                            checked={this.state.contain}
                            onChange={this.checkContainsChanged.bind(this)}
                        />
                    </div>
                    {checks}
                </div>
                <div>
                    {itemComponents}
                </div>
            </div>
        )
    }
}

export default SearchBar