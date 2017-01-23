var map;
var markers = [];
var myLocation = null;

$(document).ready(function() {

    google.maps.event.addDomListener(window, 'load', reinitMap);

});

function reinitMap() {
    var mapOptions = {
        zoom: 11,
        center: new google.maps.LatLng(34.0424899, -118.2376755), // Los Angeles

        styles: [{
            "featureType": "all", "elementType": "all", "stylers": [{"invert_lightness": true},
                {"saturation": 20}, {"lightness": 50}, {"gamma": 0.8}, {"hue": "#114499"}]
        },
            {"featureType": "all", "elementType": "geometry", "stylers": [{"visibility": "simplified"}]},
            {"featureType": "all", "elementType": "labels", "stylers": [{"visibility": "on"}]},
            {
                "featureType": "administrative", "elementType": "all", "stylers": [{"color": "#ffffff"},
                {"visibility": "simplified"}]
            }, {
                "featureType": "administrative.land_parcel",
                "elementType": "geometry.stroke",
                "stylers": [{"visibility": "simplified"}]
            },
            {"featureType": "landscape", "elementType": "all", "stylers": [{"color": "#1e212f"}]},
            {"featureType": "water", "elementType": "geometry.fill", "stylers": [{"color": "#1e212f"}]}],

        disableDefaultUI: true
    };

    var mapElement = document.getElementById('map');
    map = new google.maps.Map(mapElement, mapOptions);

    alignMap();
    goToCurrentLocation();

    $(window).resize(function() {
        alignMap();
    })

}

function alignMap() {
    var mapElement = document.getElementById('map');

    mapElement.style.paddingTop = '70px';
    mapElement.style.width = (window.innerWidth) + 'px';
    mapElement.style.height = (window.innerHeight - 138) + 'px';
}

function goToCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            goToLocation(position.coords.latitude, position.coords.longitude)
        });
    } else {
        userError("Navigator is not supported by your browser");
    }
};

function goToLocationByName(name, callback) {
    var geocoder =  new google.maps.Geocoder();
    geocoder.geocode( { 'address': name}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            var lat = results[0].geometry.location.lat();
            var lng = results[0].geometry.location.lng();

            goToLocation(lat, lng)
            callback(lat, lng);
        } else {
            userError("Can't find location '" + name + "'");
        }
    });
}

function goToLocation(lat, lng) {
    lat = parseFloat(lat);
    lng = parseFloat(lng);
    if (navigator.geolocation) {
        var pos = {
            lat: lat,
            lng: lng
        };

        map.setCenter(pos);

        if (!myLocation) {
            myLocation = new google.maps.Marker({
                position: new google.maps.LatLng(lat, lng),
                map: map,
                icon: "http://www.ugigaming.com/assets/app/images/star.png",
                title: "You're here"
            });
        }
    } else {
        userError("Navigator is not supported by your browser");
    }
}

function cleanMarkers() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
}

function addMarker(data) {
    // respoistion if already exists
    // TODO fix it
    //for (var i = 0; i < markers.length; i++) {
    //    if(markers[i].getPosition().lat() == lat && markers[i].getPosition().lng() == lng) {
    //        alert("Repos " + artist)
    //        lat = lat + 20;
    //        lng = lng + 40;
    //    }
    //}
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(data.location.lat, data.location.lng),
        map: map,
        //animation: google.maps.Animation.BOUNCE,
        icon: "https://www.serfas.com/img/icon-play.png",
        title: data.artist
    });
    markers.push(marker);
    marker.addListener('click', function() {
        play(data);
        isPausedByUser = false;
    });

}

function bouncePlayingMarker(isPlaying, name) {
    for (var i = 0; i < markers.length; i++) {
        if (isPlaying && markers[i].getTitle() == name) {
            markers[i].setAnimation(google.maps.Animation.BOUNCE);
        } else {
            markers[i].setAnimation(null);
        }
    }
}