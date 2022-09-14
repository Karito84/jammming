
import React from 'react';
import './App.css';
import SearchBar  from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';
import PlaylistList from '../PlaylistList/PlaylistList';

class App extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      searchResults:[],
      playlistName: 'My Playlist',
      playlistTracks: [],
      playlistId: null
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    this.selectPlaylist = this.selectPlaylist.bind(this);
  }
  componentDidMount() {
    Spotify.getAccessToken();
  }
  
  updatePlaylistName(name) {
    this.setState({ playlistName: name });
  }

  addTrack(track) {
    let tracks = this.state.playlistTracks;
    if (tracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    } 
    tracks.push(track);
    this.setState({ playlistTracks: tracks });
  }

  removeTrack(track) {
    let tracks = this.state.playlistTracks;
    tracks = tracks.filter(currentTrack => currentTrack.id !== track.id);
    this.setState({playlistTracks:tracks});
  }

  savePlaylist() {
    let tracks = this.state.playlistTracks;
    let tracksURIs = tracks.map(currentTrack => currentTrack.uri);
    Spotify.savePlaylist(this.state.playlistName , tracksURIs, this.state.playlistId).then(() => {
    this.setState({
      playlistName: "New Playlist Name",
      playlistTracks: [],
      playlistId: null
    });
  })  
  }

  search(searchTerm) {  
    Spotify.search(searchTerm).then(searchResults => {
      this.setState({searchResults: searchResults})
    })
  }
  // retrieves tracks and name of selected playlist, and updates state to the retrieved playlist
  selectPlaylist(id) {
    Spotify.getPlaylist(id).then(response => {
      const playlistTracks = response.tracks.items.map(item => ({
        id: item.track.id,
        name: item.track.name,
        artist: item.track.artists[0].name,
        album: item.track.album.name,
        uri: item.track.uri
      }));
      this.setState({ playlistId: id, playlistName: response.name, playlistTracks: playlistTracks })
    })
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search}/>
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
            <Playlist playlistName={this.state.playlistName}
                       playlistTracks={this.state.playlistTracks} 
                       onRemove={this.removeTrack}
                       onNameChange={this.updatePlaylistName}
                       onSave={this.savePlaylist}/>
            <PlaylistList selectPlaylist={this.selectPlaylist}/>
          </div>
        </div>
      </div>)
  }
}

export default App;
