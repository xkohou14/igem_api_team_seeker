import React, {Component} from "react";
import TeamItem from "./TeamItem";

class SearchBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            search: '',
            biobricks : false
        };

        this.master = props.master;
        this.teams = props.team_struture;
        this.biobricks = props.biobricks_struture;

        this.handleOnClick = this.handleOnClick.bind(this);
    }

    handleOnClick(e) {
        e.preventDefault();
        console.log("clicked search button " + this.state.search);
        this.master.clickMaster();
    }

    formQuery() {

    }

    onInputChange(event) {
        this.setState({
            search: event.target.value
                // .toString().substr(0,20)
        })
    }

    render() {
        const filteredTeams = this.props.items
            //.filter( item => item.title.toLowerCase().includes(this.state.search.toLowerCase())
       // );

        // This function maps TeamItem Component to every search result object
        const teamComponents = filteredTeams.map(item => {
                return (
                    <TeamItem key={item.id} item={item}/>
                )
            }
        );

        //if (this.state.biobricks) {
        const biobricks = this.biobricks.map(el => {
                return (
                    <div className="selectName">
                        <label>{el} : </label> <input type="checkbox" name={el} checked={true}/>
                    </div>
                )
            })
        //} else {
        const teams = this.teams.map(el => {
                return (
                    <div className="selectName">
                        <label>{el} : </label> <input type="checkbox" name={el} checked={true}/>
                    </div>
                )
            })
        //}
        const checks = (() => {if(this.state.biobricks) {return biobricks} else {return teams} })();

        return (
            <div>
                <form>
                    <input
                        type="text"
                        value={this.state.search}
                        placeholder="Search for teams..."
                        onChange={this.onInputChange.bind(this)}/>
                    <div>{checks}</div>
                    <button
                        type="submit"
                        onClick={this.handleOnClick}>
                        Search
                    </button>
                </form>
                <div>
                    {teamComponents}
                </div>
            </div>
        )
    }

}

export default SearchBar