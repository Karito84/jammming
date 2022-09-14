import React from "react";
import "./PlaylistListItem.css"

class PlaylistListItem extends React.Component{
    constructor(props){
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.props.selectPlaylist(this.props.id);
    }
    render() {
        return (
        <div className="ListItem-information" onClick={this.handleClick}> 
            <p>{this.props.playlistName}</p>

        </div>
        )
    }
}

export default PlaylistListItem;