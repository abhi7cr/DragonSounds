var express = require("express");
var requestify = require("requestify");
var request = require("request");
var bodyParser = require("body-parser");
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var util = require('util');
var path = require('path');
var fs = require('fs');
var app = express();
var stateKey = 'spotify_auth_state';
var client_id = "0bfbd70607c94e12b1e5863b2cbc9b2b";
var client_secret = "1a5c8cbfa0ff4229bc9ff3502759c242";
var scope = 'user-read-private user-read-email';
var redirect_uri = "http://localhost:8081/Dashboard";
console.log('spotify server running on 8081');
var staticRoot = __dirname + '/';
console.log(staticRoot);

app.set('port', (process.env.PORT || 8081));

app.use(function (req, res, next) {
    console.log(req.path);
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method_Override, Content-Type, Accept, spotify_auth_state, Authorization');
    if ('OPTIONS' == req.method) {
        res.status(200).end();
    }
    else {
        next();
    }
});

app.use(express.static(path.join(__dirname, 'config')));
app.use('/node_modules',express.static(path.join(__dirname, 'node_modules')));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/app', express.static(path.join(__dirname, 'app')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser());

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(app.get('port'), function() {  
    console.log('app running on port', app.get('port'));
});

app.get('/albums', function (req, res) {
    var options = { params: req.query };
    requestify.get('https://api.spotify.com/v1/search/', options)
        .then(function (response) {
        results = response.getBody();
        res.send(results);
    });
});
app.get('/tracksByAlbum/:id', function (req, res) {
    var albumId = req.params.id;
    requestify.get('https://api.spotify.com/v1/albums/' + albumId)
        .then(function (response) {
        results = response.getBody();
        res.send(results);
    });
});
app.get('/playlists', function (req, res) {
    var access_token = req.query.token;
    var options = { headers: { 'Authorization': 'Bearer ' + access_token } };
    requestify.get('https://api.spotify.com/v1/me/playlists', options)
        .then(function (response) {
        results = response.getBody();
        res.send(results);
    });
});
app.get('/tracksByPlaylist/:userId/:playlistId', function (req, res) {
    var userId = req.params.userId;
    var playlistId = req.params.playlistId;
    var access_token = req.query.token;
    var options = { headers: { 'Authorization': 'Bearer ' + access_token } };
    requestify.get('https://api.spotify.com/v1/users/' + userId + '/playlists/' + playlistId + '/tracks', options)
        .then(function (response) {
        results = response.getBody();
        console.log(response);
        res.send(results);
    });
});
app.get('/login', function (req, res) {
    var state = generateRandomString(16);
    res.cookie(stateKey, state);
    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state
        }));
});
app.get('/callback', function (req, res) {
    // your application requests refresh and access tokens
    // after checking the state parameter
    //console.log("COOKIE:" + req.cookies[stateKey] + ', STATE:' + req.query.state + ',CODE:' + req.query.code);
    var code = req.query.code || null;
    console.log("CALLBACK"+code);
   // var state = req.query.state || null;
    //var storedState = req.cookies ? req.cookies[stateKey] : null;
    // if (state === null || state !== storedState) {
    //   res.redirect('/#' +
    //     querystring.stringify({
    //       error: 'state_mismatch'
    //     }));
    // } else {
    //res.clearCookie(stateKey);
    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
            code: code,
            redirect_uri: redirect_uri,
            grant_type: 'authorization_code'
        },
        headers: {
            'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
        },
        json: true
    };
    request.post(authOptions, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var access_token = body.access_token, refresh_token = body.refresh_token;
            var options = {
                url: 'https://api.spotify.com/v1/me',
                headers: { 'Authorization': 'Bearer ' + access_token },
                json: true
            };
            // use the access token to access the Spotify Web API
            request.get(options, function (error, response, body) {
                body.access_token = access_token;
                body.refresh_token = refresh_token;
                res.send(body);
            });
        }
        else {
            res.redirect('/#' +
                querystring.stringify({
                    error: 'invalid_token'
                }));
        }
    });
    //}
});
function generateRandomString(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
//# sourceMappingURL=server.js.map