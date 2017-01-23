#### What is that?

TNSurround is combination of Google Maps, Spotify & Ticketmaster API. It allows you explore music of artists that gonna play around you soon.
Project was made for hackathon in 1 day and not optimized/refactored, so please do not judge that code, because a lot of coffee and sleepless hours were spent to make that thing work

#### How to use 
Enter keyword (e.g. rap, jazz), location (e.g. London), distance in miles and period since today in format:

* 1d - 1 day
* 1w - 1 week
* 1m - 1 month

Hit explore button and enjoy the music

#### Start locally

In order to start locally you need 2 keys. Google maps api key and Ticketmaster api key. They should be palced at the top of 'src/front/js/main.js' (GOOGLE_MAPS_API_KEY, TM_API_KEY)

Google maps api key - https://developers.google.com/maps/documentation/javascript/get-api-key
Ticketmaster api key - http://developer.ticketmaster.com/products-and-docs/apis/getting-started/

Then do:
```
git clone git@github.com:maxsakharov/tm-surround.git && cd tm-surround
npm install
./node_modules/webpack-dev-server/bin/webpack-dev-server.js --port 8090 --open
```

