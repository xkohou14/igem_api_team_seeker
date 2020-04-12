import React, {Component} from "react";
import TeamItem from "./TeamItem";
import './SearchBar.css';

class SearchBarTeams extends Component {
    constructor(props) {
        super(props);
        this.state = {
            search: '',
            results: [],
            selectedOption: "abstract",
            contain: true
        }
        this.tags = ["title", "year", "abstract"]
        this.master = this.props.master
        this.query = {}
        this.searchList = {searchList: []};
        this.handleOnClick = this.handleOnClick.bind(this)
        this.fetchData = this.fetchData.bind(this)
        this.addToQuery = this.addToQuery.bind(this)
    }

    handleOnClick(event) {
        event.preventDefault();
        console.log(this.query)
        this.fetchData()
    }

    handleOnClickBio(event) {
        event.preventDefault();
        this.master.clickMaster();
    }

    addToQuery (tag) {
        this.query = {}
        if (tag === "year" && this.state.search.match(/^[A-Za-z]+$/))
            return
        this.query[tag] = [{
            contain: this.state.contain,
            value: this.state.search
        }];
        this.fetchData()
        // console.log(this.query)
    }

    async checkChanged(event) {
        // await new Promise(resolve => this.setState({ selectedOption: event.target.value }, () => resolve()))
        await this.setState({
            selectedOption: event.target.value
        })
        this.addToQuery (this.state.selectedOption)
    }

    checkContainsChanged() {
        this.setState({
            contain: !this.state.contain
        })
    }

    fetchData() {
        console.log("Handling query: " + JSON.stringify(this.query, ' ', 4))
        fetch("http://localhost:3001/teams/match", {
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
                        description: item.abstract,
                        teamId: item.teamId
                    }))
                })
            })
    }

    async onInputChange(event) {
        await this.setState({
            search: event.target.value
        })
        this.addToQuery(this.state.selectedOption)
        this.fetchData()
    }

    handleAddTag() {
        const searchList = this.state.searchList;
        this.setState({
            searchList: searchList.concat(<input
                className="search"
                type="text"
                value={this.state.search}
                placeholder={"Search for teams ..."}
                onChange={this.onInputChange.bind(this)}/>)
        });
    }

    render() {
        const filteredTeams = this.state.search.length > 0 && this.state.results.length > 0 ? this.state.results : this.props.items

        // This function maps TeamItem Component to every search result object
        const teamComponents = filteredTeams.filter(item => item.title !== undefined).map(item => {
                return (
                    <TeamItem key={item.id} item={item}/>
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
                        type="radio"
                        value={element}
                        checked={this.state.selectedOption === element}
                        onChange={this.checkChanged.bind(this)}
                    />
                </div>
            )
        })

        return (
            <div>
                <h1 className="App-header">Team Seeker</h1>
                <button
                    className="btn-switch"
                    type="submit"
                    onClick={this.handleOnClickBio.bind(this)}>
                    BioBricks
                </button>
                <button
                    className="btn-search"
                    type="submit"
                    onClick={this.handleOnClick}>
                    Search
                </button>
                <form className="form">
                    <input
                        className="search"
                        type="text"
                        value={this.state.search}
                        placeholder={"Search for teams ..."}
                        onChange={this.onInputChange.bind(this)}
                    />
                    <button
                        className="btn-search"
                        type="submit"
                        onClick={this.handleAddTag.bind(this)}>
                        add tag
                    </button>
                    {/*{this.searchList.map(input => { return input*/}
                    {/*})}*/}
                </form>
                <div className="checkbox-tag">
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
                <div>
                    {teamComponents}
                </div>
            </div>
        )
    }

}

export default SearchBarTeams