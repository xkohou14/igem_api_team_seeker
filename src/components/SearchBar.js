import React, {Component} from "react";
import TeamItem from "./TeamItem";

class SearchBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            search: ''
        }
    }

    handleOnClick() {
        console.log("clicked")
    }

    onInputChange(event) {
        this.setState({
            search: event.target.value
                // .toString().substr(0,20)
        })
    }

    render() {
        const filteredTeams = this.props.items
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
                    {teamComponents}
                </div>
            </div>
        )
    }

}

export default SearchBar