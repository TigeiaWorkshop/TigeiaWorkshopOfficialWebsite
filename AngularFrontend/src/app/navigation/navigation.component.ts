import { Component, Input, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { User } from "../../utilities/Models";

@Component({
	selector: 'app-navigation',
	templateUrl: './navigation.component.html',
	styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
	UserData: any;
	nav_items: any;
	@Input('selected_section') selected_section = '';

	constructor(
		private _httpService: HttpService
	) {
	}

	ngOnInit(): void {
		this.nav_items = [
			{name: "论坛首页", id: "home", target: ""},
			{name: "道具商城", id: "shop", target: ""},
			{name: "勋章中心", id: "medal", target: ""},
			{name: "档案馆", id: "archive", target: "archive"}
		];
		this.UserData = {} as User;
		this.getUserData();
	}

	getUserData(): void {
		this.UserData = {} as User;
		this._httpService.getCurrentUser().subscribe(data => {
			if (data != null && Object.keys(data).length > 0) {
				this.UserData = data as User;
			}
		});
	}

	logOff(): void {
		this._httpService.logoffUser();
		this.UserData = {} as User;
	}

}
