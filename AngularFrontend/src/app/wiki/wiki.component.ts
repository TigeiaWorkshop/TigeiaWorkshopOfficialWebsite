import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-wiki',
	templateUrl: './wiki.component.html',
	styleUrls: ['./wiki.component.css']
})
export class WikiComponent implements OnInit {

	src: any;

	constructor(
		private _route: ActivatedRoute
	) {
	}

	ngOnInit(): void {
		this._route.queryParamMap.subscribe(params => {
			let src_url = String(params.get("src"));
			console.log(src_url);
			if (src_url == "<linpg>") {
				this.src = "https://raw.githubusercontent.com/TigeiaWorkshop/GirlsFrontLine-LastWish/master/README.md";
			} else {
				this.src = src_url;
			}
			console.log(this.src);
		});
	}

}
