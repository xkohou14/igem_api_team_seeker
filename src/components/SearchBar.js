import React, {Component} from "react";
import TeamItem from "./TeamItem";

class SearchBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            search: '',
            results: []
        }
    }

    componentDidMount() {
        // const headers = {
        //     "name":[{"contain":false, "value": search}, {"contain":true, "value": "team"}],
        //     "year":[{"contain":true, "value": "2020"}]
        // }
        // fetch("http://localhost:3001/teams/match",{headers})
        //     .then(response => response.json())
        //     .then(responseData => {
        //         this.setState({
        //             results: responseData.map(item => ({
        //                 title: item.title,
        //                 wiki: item.wiki,
        //                 year: item.year,
        //                 description: item.abstract,
        //             }))
        //         })
        //     })
    }

    handleOnClick() {

        // console.log(this.state.results)
        // console.log("clicked")
    }

    onInputChange(event) {
        this.setState({
            search: event.target.value.toString().toLowerCase()
                // .toString().substr(0,20)
        })
        // "name":[{"contain":false, "value": "2"}, {"contain":true, "value": "team"}],
        //     "year":[{"contain":true, "value": "2020"}]
        const query = {
            "name":[{"contain":false, "value": "2"}, {"contain":true, "value": "team"}],
            "year":[{"contain":true, "value": "2020"}]
        }
        console.log(query)
        fetch("http://localhost:3001/teams/match", {method: "POST", body: JSON.stringify({
                "name":[{"contain":false, "value": "2"}, {"contain":true, "value": "team"}],
                "year":[{"contain":true, "value": "2020"}]
            })})
            .then(response => response.json())
            .then(responseData => {
                this.setState({
                    results: responseData.map(item => ({
                        title: item.title,
                        wiki: item.wiki,
                        year: item.year,
                        description: item.abstract,
                    }))
                })
            })
    }

    render() {
        const filteredTeams = this.props.items
            .filter( item => item.toString().toLowerCase().includes(this.state.search.toLowerCase())
            );

        // This function maps TeamItem Component to every search result object
        const teamComponents = filteredTeams.map(item => {
                return (
                    <TeamItem key={item.id} item={item}/>
                )
            }
        )

        return (
            <div>
                <form>
                    <input
                        type="text"
                        value={this.state.search}
                        placeholder="Search for teams..."
                        onChange={this.onInputChange.bind(this)}/>
                    <button
                        type="submit"
                        onClick={this.handleOnClick.bind(this)}>
                        Search
                    </button>
                </form>
                <div>
                    {console.log(this.state.results)}

                    {/*{teamComponents}*/}
                </div>
            </div>
        )
    }

}

export default SearchBar