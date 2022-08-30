const clientId = "5c91c74a19d34338ba53fa27ccdcc754";
const redirectUri = "http://localhost:3000/";

let accessToken;

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
      
    async savePlaylist(name, tracksURIs) {
        if((!name || !tracksURIs.length)) {
            return;
        }
        const accessToken = Spotify.getAccessToken();
        const headers = {Authorization: `Bearer ${accessToken}`};
        let userId;
        try {
            const response = await fetch("https://api.spotify.com/v1/me", {headers: headers})
            if(response.ok) {
                const jsonResponse = await response.json();
                userId = jsonResponse.id;
                const url = `https://api.spotify.com/v1/users/${userId}/playlists`
            
                try{
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
                            // Commented out as I dont think that I have to do something with this response
                            //  if(response.ok) {
                            //      const jsonResponse = await response.json();
                            //     console.log(jsonResponse);
                            // }
                        } catch (error) {
                            console.log(error);
                        }
                    } 
            
                } catch(error) {
                console.log(error);
                }
            }  
        } catch(error) {
            console.log(error);
        }
    } 
};




export default Spotify;
