import { Component, OnInit} from '@angular/core';
import { RouteParams } from '@angular/router-deprecated';

import { Hero } from './hero';
import { HeroService } from './hero.service';

@Component({
	selector: 'my-hero-detail',
	templateUrl: 'app/hero-detail.component.html',
	styleUrls: ['app/hero-detail.component.css']
})
export class HeroDetailComponent implements OnInit{
	hero: Hero;


	constructor(
  			private heroService: HeroService,
  			private routeParams: RouteParams) {
	}


	ngOnInit() {
    	let id = +this.routeParams.get('id');
    	/*this.heroService.getHero(id)
      		.then(hero => this.hero = hero);*/
  	}


  	goBack() {
  			window.history.back();
	}
}