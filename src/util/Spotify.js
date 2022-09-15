const clientId = "5c91c74a19d34338ba53fa27ccdcc754";
const redirectUri = "http://karolina-jammming.surge.sh" ;

let accessToken;
let userId;

const Spotify = {
    getAccessToken() {
        if(accessToken) {
            return accessToken;
        } 
        //check for access token match
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
            
        if(accessTokenMatch && expiresInMatch) {
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);
            
            // This clears the parameters, allowing us to grab a new access token when it expires
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken;
            } else {
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
            window.location.href = accessUrl;
            }
    },

    async search(searchTerm) {
        const accessToken = Spotify.getAccessToken();
        const urlToFetch = `https://api.spotify.com/v1/search?type=track&q=${searchTerm}`;
                
        try {
            const response = await fetch(urlToFetch, { headers: {Authorization: `Bearer ${accessToken}` }});
            if(response.ok) { 
                const jsonResponse = await response.json();
                        
                if(!jsonResponse.tracks) {
                    return [];
                }
                return jsonResponse.tracks.items.map(track => ({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri
                }));
            }
        } catch (error) {
            console.log(error);
        }
                    
    },

    async getCurrentUserId() {
        if(userId) {
            return userId;
        }
        const accessToken = Spotify.getAccessToken();
        const headers = {Authorization: `Bearer ${accessToken}`};
        const url = "https://api.spotify.com/v1/me";
         try {
            const response = await fetch(url, {headers: headers});
            if(response.ok) {
                const jsonResponse = await response.json();
                userId = jsonResponse.id;
                return userId;
            }
         } catch (error) {
            console.log(error)
         }

    },
      // it saves and updates playlist name and tracks in user's account
    async savePlaylist(name, tracksURIs, id) {
        if((!name || !tracksURIs.length)) {
            return;
        }
        
        const accessToken = Spotify.getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}` };
        let currentUserId = await Spotify.getCurrentUserId();
        
        if(id) {//checks if the playlist already exists ( if it does the id will be provided from selectPlaylist method in App.js), then it will update the playlist
            
            try {
                const url = `https://api.spotify.com/v1/playlists/${id}`;
                const response = await fetch(url, {
                headers: headers,
                method: 'PUT',
                body: JSON.stringify({ name: name })
                });
            if(response.ok) {
                try {
                   const url = `https://api.spotify.com/v1/playlists/${id}/tracks`; 
               
                const response = await fetch(url, {
                    headers: headers,
                    method: 'PUT',
                    body: JSON.stringify({ uris: tracksURIs})
                    });
                                
                    if(response.ok) {
                        const jsonResponse = await response.json();
                        console.log(jsonResponse);
                    }
                    } catch (error) {
                    console.log(error);                        }
                }

            } catch (error) {
                console.log(error);
            }
        } else { // this part of the method is used when playlist didn't exist before and is being created for the first time
            
            const url = `https://api.spotify.com/v1/users/${currentUserId}/playlists`
            try {
                const response = await fetch(url, {
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify({ name: name })
                });
                if(response.ok) {
                    const jsonResponse = await response.json();
                    const playlistID = jsonResponse.id;
                    const url = `https://api.spotify.com/v1/playlists/${playlistID}/tracks`;

                try {
                    const response = await fetch(url, {
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify({ uris: tracksURIs})
                    });
                            
                    if(response.ok) {
                        const jsonResponse = await response.json();
                        console.log(jsonResponse);
                    }
                } catch (error) {
                    console.log(error);
                }
                } 
            
            } catch(error) {
            console.log(error);
            }
        }
    },

    async getUserPlaylist() {
        const currentUserId = await Spotify.getCurrentUserId();
        const headers = { Authorization: `Bearer ${accessToken}` };
        const url = `https://api.spotify.com/v1/users/${currentUserId}/playlists`;

        try {
            const response = await fetch( url, {headers: headers});
            if(response.ok) {
                const jsonResponse = await response.json();
                if(!jsonResponse.items) {
                    return [];
                }
                return jsonResponse.items.map(playlist=> ({
                    id: playlist.id,
                    name: playlist.name
                }))
            }
        } catch (error) {
            console.log(error);
        }
    },

    //this retrieves the playlist with provided playlist id, then returns a promise that will resolve to retrieved tracks, and playlist name
    async getPlaylist(id) {
        const accessToken = Spotify.getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}` };
        const url = `https://api.spotify.com/v1/playlists/${id}`;
        
        try {
            const response = await fetch(url, {headers: headers});
            if(response.ok) {
                const jsonResponse = await response.json();

                if(!jsonResponse.tracks.items) {
                    return [];
                }
                return jsonResponse;
            }
        } catch (error) {
            console.log(error);
        }
    }
    
};




export default Spotify;
