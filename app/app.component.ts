import { Component } from '@angular/core';
import {RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from '@angular/router-deprecated';

import { HeroService } from './hero.service';
import { HeroesComponent } from './heroes.component';
import { DashboardComponent } from './dashboard.component';
import { HeroDetailComponent } from './hero-detail.component';

@Component({
	selector: 'my-app',
	template: `
		<h1><span class="titleStart">{{titleStart}}</span><span class="titleEnd">{{titleEnd}}</span></h1>
 		<router-outlet></router-outlet>
		`,
	directives: [ROUTER_DIRECTIVES],
	providers: [
		ROUTER_PROVIDERS,
		HeroService
		],
	styleUrls: ['app/app.component.css']
})

@RouteConfig([
	{
  		path: '/',
  		name: 'Dashboard',
  		component: DashboardComponent,
  		useAsDefault: true
	},
	{
  		path: '/detail/:id',
 		name: 'HeroDetail',
  		component: HeroDetailComponent
	},
	{
		path: '/heroes',
		name: 'Heroes',
		component: HeroesComponent
	}
])

export class AppComponent {
	titleStart = 'Dragon';
	titleEnd = 'Sounds';
}