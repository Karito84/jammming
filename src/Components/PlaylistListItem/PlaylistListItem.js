import React from "react";
import "./PlaylistListItem.css"

class PlaylistListItem extends React.Component{
    

    render() {
        return (
        <div className="ListItem-information"> 
            <p>{this.props.playlistName}</p>

        </div>
        )
    }
}

export default PlaylistListItem;