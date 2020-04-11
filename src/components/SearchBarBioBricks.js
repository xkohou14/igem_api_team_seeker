import React, {Component} from "react";
import BioBricksItem from "./BioBricksItem";
import './SearchBar.css';

class SearchBarBioBricks extends Component {
    constructor(props) {
        super(props);
        this.state = {
            search: '',
            results: [],
            biobricks: false,
            btnName: "BioBricks",
        }
        this.master = this.props.master;
        // this.teams = this.props.team_struture;
        // this.biobricks = this.props.biobricks_struture;

        this.handleOnClick = this.handleOnClick.bind(this);
    };

    handleOnClick(e) {
        e.preventDefault();
        console.log("clicked search button " + this.state.search);
        this.master.clickMaster();
    }

    handleOnClickBio(e) {
        e.preventDefault();
        this.master.clickMaster();
    }

    formQuery() {
    }

    onInputChange(event) {
        this.setState({
            search: event.target.value.toString().toLowerCase()
        })
        const query = {
            title: [{contain: false, value: "2"}, {contain: true, value: "team"}],
            year: [{contain: true, value: 2020}]
        }
        console.log("Handling query: " + JSON.stringify(query, ' ', 4))
        fetch("http://localhost:3001/biobricks/match", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(query)
        })
            .then(response => response.json())
            .then(responseData => {
                console.log("Response: " + JSON.stringify(responseData, ' ', 4))
                this.setState({
                    results: responseData.map(item => ({
                        title: item.name,
                        year: item.year,
                        description: item.description,
                        wiki: item.wiki,
                    }))
                })
            })
    }

    render() {
        const filteredTeams = this.state.search.length > 0 && this.state.results.length > 0 ? this.state.results : this.props.items

        // This function maps TeamItem Component to every search result object
        const bioComponents = filteredTeams.filter(item => item.title !== undefined).map(item => {
                return (
                    <BioBricksItem key={item.id} item={item}/>
                )
            }
        );

        // const biobricks = this.biobricks.map(element => {
        //     return (
        //         <div className="selectName">
        //             <label>
        //                 {element} :
        //             </label>
        //             <input
        //                 type="checkbox"
        //                 name={element}
        //                 checked={true}
        //             />
        //         </div>
        //     )
        // })

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
                    {/*<div>{biobricks}</div>*/}
                    <button
                        className="btn-search"
                        type="submit"
                        onClick={this.handleOnClick}>
                        Search
                    </button>
                </form>
                <div>
                    {bioComponents}
                </div>
            </div>
        )
    }

}

export default SearchBarBioBricks