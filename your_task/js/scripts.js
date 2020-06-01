const baseURL = 'https://www.apitutor.org/spotify/simple/v1/search';

// Note: AudioPlayer is defined in audio-player.js
const audioFile = 'https://p.scdn.co/mp3-preview/bfead324ff26bdd67bb793114f7ad3a7b328a48e?cid=9697a3a271d24deea38f8b7fbfa0e13c';
const audioPlayer = AudioPlayer('.player', audioFile);

var ID = " ";

const search = (ev) => {
    const term = document.querySelector('#search').value;
    console.log('search for:', term);
    // issue three Spotify queries at once...
    getTracks(term);
    getAlbums(term);
    getArtist(term);
    if (ev) {
        ev.preventDefault();
    }
}

const getTracks = (term) => {
    const elem = document.querySelector('#tracks');
    elem.innerHTML = " "
    fetch(baseURL + '?type=track&q=' + term)
        .then((response) => {
            return response.json();
        })
        .then((response) => {
            console.log(response);
            if (response!=null){
                const tracks = response.slice(0,5);
                for (track of tracks){
                    elem.innerHTML += get_HTML_tracks(track)
            }}
            else{
                alert("No tracks found that match your search criteria.");
            }
        })
        .then(playTrackEventHandlers);
    console.log(`
        get tracks from spotify based on the search term
        "${term}" and load them into the #tracks section 
        of the DOM...`);
};

const playTrackEventHandlers =() => {
    const tracks = document.querySelectorAll(".track-item.preview");
    for (track of tracks) {
        track.onclick = audioFunction;
    }
}

const audioFunction = (ev) => {
    console.log(ev);
    const theTrack = ev.currentTarget;
    const trackToBePlayed = theTrack.getAttribute('data-preview-track');
    audioPlayer.setAudioFile(trackToBePlayed);
    audioPlayer.play();
    document.querySelector('footer .track-item').innerHTML = theTrack.innerHTML;
}

const get_HTML_tracks = (track) => {
    if (track.preview_url == null){
        let template = `<section class="track-item">
    <img src="${track.album.image_url}">
    <div class="label">
        <h3>${track.name}</h3>
        <p>
            ${track.artist.name} (no preview available)
        </p>
    </div>
</section>`
    return template;
    }
    let template = `<section class="track-item preview" data-preview-track="${track.preview_url}">
    <img src="${track.album.image_url}">
    <i class="fas play-track fa-play" aria-hidden="true"></i>
    <div class="label">
        <h3>${track.name}</h3>
        <p>
            ${track.artist.name}
        </p>
    </div>
</section>`
    return template;
}

const getAlbums = (term) => {
    const elem = document.querySelector('#albums');
    elem.innerHTML = " "
    fetch(baseURL + '?type=album&q=' + term)
        .then((response) => {
            return response.json();
        })
        .then((response) => {
            console.log(response);
            const albums = response;
            if (albums != null) {
                for (album of albums) {
                    elem.innerHTML += get_Albums_list(album)
                }}
            else {
                alert("No albums were returned.");
            }   
        })
    console.log(`
        get albums from spotify based on the search term
        "${term}" and load them into the #albums section 
        of the DOM...`);
};

const get_Albums_list = (album) =>{
    let template = `<section class="album-card" id="${album.id}">
                <div>
                    <img src="${album.image_url}">
                    <h3>${album.name}</h3>
                    <div class="footer">
                        <a href="${album.spotify_url}" target="_blank">
                            view on spotify
                        </a>
                    </div>
                </div>
            </section>`
    return template;
}

const getArtist = (term) => {
    const elem = document.querySelector('#artist');
    elem.innerHTML = " "
    fetch(baseURL + '?type=artist&q=' + term)
        .then((response) => {
            return response.json();
        })
        .then((response) => {
            console.log(response);
            if (response[0] != null){
                let template = `<section class="artist-card" id="${response[0].id}">
                    <div>
                        <img src="${response[0].image_url}">
                        <h3>${response[0].name}</h3>
                        <div class="footer">
                            <a href="${response[0].spotify_url}" target="_blank">
                                view on spotify
                            </a>
                        </div>
                    </div>
                </section>`
                elem.innerHTML += template;
                ID = response[0].id;
            }
            else {
                alert("No artists were returned.");
            }
        })
        .then(topFiveEventHandler);

    console.log(`
        get artists from spotify based on the search term
        "${term}" and load the first artist into the #artist section 
        of the DOM...`);
    
};

const topFiveEventHandler = () => {
    artistSongs = document.querySelector('#artist');
    artistSongs.onclick = artistFunction;
}

const artistFunction = (ev) => {
    const elem = document.querySelector('#tracks');
    elem.innerHTML = " "
    console.log("click");
    console.log(ev);
    const theSongs = ev.currentTarget;
    console.log(ID);
    fetch('https://www.apitutor.org/spotify/v1/artists/'+ ID + '/top-tracks?country=us')
        .then((response) => {
            return response.json();
        })
        .then ((response) => {
            if (response!=null){
                const tracks = response.tracks.slice(0,5);
                for (spotify_track of tracks){
                    console.log(spotify_track);
                    const track = {
                        album: {
                            image_url: spotify_track.album.images[0].url
                        },
                        name: spotify_track.name,
                        preview_url: spotify_track.preview_url,
                        artist: {
                            name: spotify_track.artists[0].name
                        }
                    }
                    elem.innerHTML += get_HTML_tracks(track)
            }}
            else{
                alert("No tracks found.");
            }
        }) 
        .then(playTrackEventHandlers);
}




document.querySelector('#search').onkeyup = (ev) => {
    // Number 13 is the "Enter" key on the keyboard
    console.log(ev.keyCode);
    if (ev.keyCode === 13) {
        ev.preventDefault();
        search();
    }
};



