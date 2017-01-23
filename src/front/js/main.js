var GOOGLE_MAPS_API_KEY="XXX"
var TM_API_KEY="XXX"

$(document).ready(function() {

    $("img.with-hover-image").hover(function() {
        $(this).attr('src', $(this).attr('hover'))
    }, function() {
        $(this).attr('src', $(this).attr('normal'))
    });

    $("#like").click(function(){
        //localStorage.setItem("favourites", []);
        var favs = localStorage.getItem("favourites");
        if (!favs) {
            favs = [];
        } else {
            favs = JSON.parse(favs);
        }
        var artist = nowPlaying.artist;
        var idx = favs.indexOf(artist);
        if (idx > 0) {
            favs.splice(idx, 1);
            $("#like").attr("src", "static/images/heart-empty.png");
        } else {
            favs.push(artist);
            $("#like").attr("src", "static/images/heart-full.png");
        }
        localStorage.setItem("favourites", JSON.stringify(favs));
    });

    // play
    $("#go").on('click', function() {
        getTracks(0);
    });

    // controls
    $("#my_location").on('click', function() {
        userWarning("Going home");
        $("#location").val("los angeels"); // just hard code for now
        goToCurrentLocation();
    });
});

function getTracks(page) {
    var location = $('#location').val();
    goToLocationByName(location, function(lat, lng) {
        var keyword = $('#keyword').val();
        var distance = $('#distance').val();
        var period = $('#period').val();

        getEvents(keyword, distance, period, lat, lng, page, function(events) {
            cleanMarkers();
            cleanPlayList();
            if(!events.length) {
                userWarning("No events found");
            } else {
                for(var i in events) {
                    var event = events[i];

                    function withPrice(event, isLast) {

                        var lat = event._embedded.venues[0].location.latitude;
                        var lng = event._embedded.venues[0].location.longitude;

                        var artist = event.name;
                        if (event._embedded.attractions) {
                            artist = event._embedded.attractions[0].name;
                        }
                        var venue =  event._embedded.venues[0];
                        var addr = venue.address.line1 + ", " + venue.city.name;
                        var date = event.dates.start.localDate;

                        getPrice(event.id, function(prices){

                            var data = {
                                artist: artist,
                                addr: addr,
                                date: date,
                                url: event.url,
                                eventid: event.id,
                                location: {
                                    lat: parseFloat(lat),
                                    lng: parseFloat(lng)
                                }
                            };

                            if (prices.length) {
                                data.lowPrice = prices[0].attributes.value + " " + prices[0].attributes.currency;
                            }

                            addMarker(data);
                            addToPlaylist(data);

                            if (isLast) {
                                runPlaylist(0, 1);
                            }
                        });
                    }

                    console.log(i + " " + (events.length - 1));
                    withPrice(event, i == events.length - 1);
                }

            }
        });
    });
}

function userError(error) {
    //alert(error);
}

function userWarning(warn) {

    console.log(warn);

    var msg = $("<div></div>").html(warn);
    $("#info").append(msg);

    $("#info").stop().animate({
        'marginRight': '300px'
    });

    setTimeout(function(){
        $("#info").stop().animate({
            'marginRight': '-300px'
        });
        $(msg).remove();
    }, 3000);
}

