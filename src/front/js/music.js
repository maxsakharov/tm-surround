var SPOTIFY_URL = "https://api.spotify.com/v1";
var nowPlaying = {};
var audio = new Audio();

var isPausedByUser = false;
var playlist = [];
var currentPage = 0;
// structure of now track

$(document).ready(function() {

    $("#play_button").on('click', function() {
        var isPlaying = $('#is_playing').val() == 'true';
        isPlaying ? pause() : play(nowPlaying);
        isPausedByUser = isPlaying;
    });

    $("#prev_button").on('click', function() {
        runPlaylist(nowPlaying.id - 1, -1);
    });

    $("#next_button").on('click', function() {
        runPlaylist(nowPlaying.id + 1, 1);
    });
});

var checkPlaying = function(wasStopped) {
    var stopped = audio.ended || audio.paused;
    if(!wasStopped && stopped) {
        tooglePlayButton(false);
        onAudioEnd()
    }
    setTimeout(function(){
        checkPlaying(stopped);
    }, 300);
};

checkPlaying();

function onAudioEnd() {
    if (!isPausedByUser && nowPlaying) {
        runPlaylist(nowPlaying.id + 1, 1);
    }
}

function cleanPlayList() {
    playlist = [];
}

function addToPlaylist(data) {
    data.id = playlist.length;
    playlist.push(data);
}

function runPlaylist(start, direction) {
    if (!playlist.length) {
        return;
    }

    if (start < 0 && currentPage == 0) {
        pause();
        return;
    }

    if (start >= playlist.length || start < 0 ) {
        currentPage = currentPage + direction;
        if (currentPage < 0) {
            currentPage == 0;
        }
        getTracks(currentPage);
        return;
    }

    userWarning("Playing: " + (start + 1) + ". " + playlist[start].artist);

    play(playlist[start], function(playing) {
        if (!playing) {
            console.log("Playing next track. Because current failed. Moving to " + (start + direction));
            runPlaylist(start + direction, direction);
        }
    });
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function play(what, callback) {
    tryMatchArtist(what.artist, function(id) {
        if(!id && callback) {
            callback(false);
            return;
        }
        $.ajax({
            url: SPOTIFY_URL + '/artists/' + id + '/top-tracks',
            data: {
                country: 'US'
            },
            success: function (response) {
                if (response.tracks.length) {
                    var idx = getRandomInt(0, response.tracks.length - 1);
                    var track = response.tracks[idx];

                    audio.src = track.preview_url;
                    audio.play();

                    nowPlaying = what;

                    $('#artist').html(track.artists[0].name);
                    $('#song').html(track.name);
                    $('#album').html(track.album.name);

                    tooglePlayButton(true, what);

                    if(callback) {
                        callback(true);
                    }
                } else {
                    userWarning("Nothing found by request " + what.artist);
                    callback(false);
                }
            }
        });
    });
}

function tryMatchArtist(sentence, callback) {
    // direct match
    getArtist(sentence, function(artist) {
        if(artist) {
            callback(artist);
            return;
        }

        // try find special symbols
        var words = sentence.split(" ");

        var res = "";
        for(var i in words) {
            var word = words[i];
            res += " " + word;
            if(word.endsWith("-") || word.endsWith(":") ||
                word.endsWith("/") || word.endsWith(",")) {
                res = res.slice(0, -1);
                break;
            } else if (word == "-" || word == "/" ||
                       word == "." || word == ":" ||
                       word.endsWith(",") ||
                       word[0] === word[0].toLowerCase()) {
                break;
            }
        }

        res = res.trim();

        getArtist(res, function(artist) {
            if(artist) {
                callback(artist);
                return;
            }

            // try find by first 2 words
            getArtist(words[0] + " " + words[1], function(artist) {
                if(!artist) {
                    console.error("Can't find artist by name '" + sentence + "'")
                    callback(null);
                } else {
                    callback(artist);
                }
            });
        });

    });
}

function getArtist(name, callback) {
    $.ajax({
        url: SPOTIFY_URL + '/search',
        data: {
            q: name,
            type: 'artist'
        },
        success: function (response) {
            if (response.artists.items.length) {
                callback(response.artists.items[0].id);
            } else {
                callback(null);
            }
        }
    });
}

function pause() {
    audio.pause();
    tooglePlayButton(false);
}

function tooglePlayButton(isPlaying) {
    if (isPlaying) {
        $('#play_button').attr('src', 'static/images/pause.png')
            .attr('normal', 'static/images/pause.png')
            .attr('hover', 'static/images/pause.png');

        $('#equalizers').find('img').show();
        $('#song_title').show();

        var linkText = " | " + nowPlaying.date + " | " + nowPlaying.addr;
        if (nowPlaying.lowPrice) {
            linkText += " | Starting at " + nowPlaying.lowPrice;
            $('#price').html(nowPlaying.lowPrice);
        } else {
            $('#price').html("");
        }
        $('#event_link_content').html(linkText);
        $('a.eventLink').attr('href', nowPlaying.url);
        $('a.eventLink').show();


        goToLocation(nowPlaying.location.lat, nowPlaying.location.lng);

        var fav = localStorage.getItem("favourites");

        if(fav && fav.length > 0)
        if (fav.indexOf(nowPlaying.artist) > 0) {
            $("#like").attr("src", "static/images/heart-full.png");
        } else {
            $("#like").attr("src", "static/images/heart-empty.png");
        }
    } else {
        $('#play_button').attr('src', 'static/images/play.png')
            .attr('normal', 'static/images/play.png')
            .attr('hover', 'static/images/play-hover.png');

        $('#equalizers').find('img').hide();
    }
    $('#is_playing').val(isPlaying);
    bouncePlayingMarker(isPlaying, nowPlaying.artist);
}