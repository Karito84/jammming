import React from 'react';
import Spotify from '../../util/Spotify';
import PlaylistListItem from '../PlaylistListItem/PlaylistListItem';
import './PlaylistList.css';



class PlaylistList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            playlists: []
        };
    }
    
    componentDidMount() {
        Spotify.getUserPlaylist().then(playlists => {this.setState({playlists: playlists})});
    }
    //this causes too many calls to spotify and eventually gets error 429
    // componentDidUpdate() {
    //     Spotify.getUserPlaylist().then(playlists => {this.setState({playlists: playlists})});
    // }
    render() {
        return (
            <div className="PlaylistList">
                <h3>My Spotify Playlists</h3>
                
                {this.state.playlists.map(playlist => {
                    return <PlaylistListItem playlistName={playlist.name} key={playlist.id} id={playlist.id} selectPlaylist={this.props.selectPlaylist}/>
                })
            }
            </div>
        )
    }
}

export default PlaylistList;