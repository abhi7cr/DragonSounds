import { Component, OnInit } from '@angular/core';

import { Hero } from './hero';
import { HeroService } from './hero.service';
import { Router } from '@angular/router-deprecated';

@Component({
  selector: 'my-dashboard',
  templateUrl: 'app/dashboard.component.html',
  styleUrls: ['app/dashboard.component.css']
})
export class DashboardComponent {
  albums: any[] = [];
  query = "";
  playlists: any[] = [];
  playlistName = '';
  showAlbums = true;
  tracks: any[] = [];
  constructor(private heroService: HeroService,
  			  private router: Router) { }
  
  parseAlbums(response: any)
  {
  		this.albums = response.json().albums.items;
  }

  parseTracks(response: any)
  {
  		this.tracks = response.json().tracks.items;
  		this.showAlbums = false;
  }

  parsePlaylists(response: any)
  {
  		this.playlists = response.json().playlists.items;
  }

  showAlbum(){
  		this.showAlbums = true;
  }

  private handleError(error: any) {
  		console.error('An error occurred', error);
  		return (error.message || error);
	}

  fetchAlbums() {
    this.heroService.getAlbums(this.query)
      .then(res => this.parseAlbums(res))
      .catch(this.handleError);
  }

  fetchPlaylists() {
    this.heroService.getPlaylists(this.playlistName)
      .then(res => this.parsePlaylists(res))
      .catch(this.handleError);
  }

  
  getTracks(album: Hero) {
  	this.heroService.getTracks(album.id)
      .then(res => this.parseTracks(res));
  }

  getTracksOfPlaylist(playlist: any) {
  	this.heroService.getTracksOfPlaylist(playlist.id)
      .then(res => this.parseTracks(res));
  }

  login(){
  	this.heroService.login();
  }
}