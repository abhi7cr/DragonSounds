import { Injectable } from '@angular/core';
import { Headers, Http, Jsonp } from '@angular/http';
//import { HERO } from './hero';
//import { HEROES } from './mock-heroes';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class HeroService {
	code = '';
	state = '';
	constructor (private http: Http, private jsonp: Jsonp) {
	this.jsonp = jsonp
		if(window.location.search.indexOf('code') === 1){
			this.code = window.location.search.split('&')[0].substring(1).split('=')[1];
    		this.state = window.location.search.split('&')[1].split('=')[1];
    		this.getToken();
    	}
	}

	spotifySearchUrl = 'https://api.spotify.com/v1/search?';
	spotifyAlbumUrl = 'https://api.spotify.com/v1/albums/';
	spotifyPlaylistUrl = 'https://api.spotify.com/v1/playlists/';
	client_id = "0bfbd70607c94e12b1e5863b2cbc9b2b";
	client_secret = "1a5c8cbfa0ff4229bc9ff3502759c242";
	scope = 'user-read-private user-read-email';
	redirect_uri = "http://localhost:3000/dashboard"
	form = {}
	
  
    //getToken();

	private handleError(error: any) {
  		console.error('An error occurred', error);
  		return Promise.reject(error.message || error);
	}

	private parseResponse(response: any) {
			return response;
	}

	getAlbums(query: string) {
		  return this.http.get(this.spotifySearchUrl+'q='+query+'&type=album')
		  				.toPromise()
		  				.then(this.parseResponse)
		  				.catch(this.handleError)
	}
	getTracks(id: number) {
 	 return this.http.get(this.spotifyAlbumUrl+id)
		  				.toPromise()
		  				.then(response=>this.parseResponse(response))
		  				.catch(this.handleError)
	}
	getPlaylists(query: string) {
		  return this.http.get(this.spotifySearchUrl+'q='+query+'&type=playlist')
		  				.toPromise()
		  				.then(this.parseResponse)
		  				.catch(this.handleError)
	}
	getTracksOfPlaylist(id: number) {
 	 return this.http.get(this.spotifyPlaylistUrl+id)
		  				.toPromise()
		  				.then(response=>this.parseResponse(response))
		  				.catch(this.handleError)
	}

	generateRandomString (length: number) {
            var text = '';
            var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

            for (var i = 0; i < length; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            return text;
        }


	login(){
		window.location.href = 'https://accounts.spotify.com/authorize?response_type=code'
							+'&client_id='+this.client_id+'&scope='+this.scope+
							'&redirect_uri='+this.redirect_uri+'&state='+this.generateRandomString(16);
	}

	getToken(){
		let _headers = new Headers();
		//_headers.append('Authorization', 'Basic ' + (new NodeBuffer(this.client_id + ':' + 
		// this.client_secret).toString('base64'));
      	_headers.append('Content-Type', 'application/json; charset=utf-8');
      	_headers.append('Accept', 'application/json');

     this.form = {
        code: this.code,
        redirect_uri: this.redirect_uri,
        grant_type: 'authorization_code',
        withCredentials: true,
        json: true
      }
		return this.http.get('http://localhost:3000/callback?code='+this.code)
		  				.toPromise()
		  				.then(response=>this.parseResponse(response))
		  				.catch(this.handleError)
		
	}


}