var TM_DISCOVERY_URL="https://app.ticketmaster.com/discovery/v2";
var TM_COMMERCE_URL="https://app.ticketmaster.com/commerce/v2";

function getEvents(keyword, distance, period, lat, lng, page, callback) {

    var request = {};

    if (keyword) {
        request.keyword = keyword;
    }

    if (period) {
        request.endDateTime = apiDateFormat(parsePeriod(period));
    }

    request.radius = distance ? distance : 100;
    request.latlong = lat && lng ? lat + ',' + lng : '34.0331907,-118.3327592'; // default is Los Angeles
    request.apikey = TM_API_KEY;
    request.startDateTime = apiDateFormat(new Date());
    request.classificationName = 'music';
    //request.size = 10;

    if (page) {
        request.page = page;
    }

    $.ajax({
        url: TM_DISCOVERY_URL + '/events.json',
        data: request,
        success: function (response) {
            if (response._embedded && response._embedded.events.length) {
                callback(response._embedded.events)
            } else {
                callback([]);
            }
        }
    });
}

function parsePeriod(period) {
    var days = 1;
    if (period.endsWith('d')) {
        days = parseInt(period.replace('d', ''));
    } else if (period.endsWith('w')) {
        days = parseInt(period.replace('w', '')) * 7;
    } else if (period.endsWith('m')) {
        days = parseInt(period.replace('m', '')) * 30;
    }

    if(!days) {
        days = 5;
    }

    var res = new Date();
    res.setDate(new Date().getDate() + days)
    return res;
}

function getPrice(eventId, callback) {
    $.ajax({
        url: TM_COMMERCE_URL + '/events/' + eventId + '/offers.json',
        data: {
            apikey: TM_API_KEY
        },
        success: function (response) {
            if (response.prices && response.prices.data.length) {
                callback(response.prices.data);
            } else {
                callback([]);
            }
        },
        error: function(xhr, textStatus, errorThrown) {
            callback([]);
        }
    });
}

function apiDateFormat(date) {
    var str = date.toISOString();
    return str.replace(/\.[0-9]{3}/, "");
}