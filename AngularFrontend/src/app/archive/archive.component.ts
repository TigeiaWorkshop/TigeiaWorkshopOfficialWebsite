import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../http.service';

@Component({
	selector: 'app-archive',
	templateUrl: './archive.component.html',
	styleUrls: ['./archive.component.css']
})
export class ArchiveComponent implements OnInit {

	constructor(
		private _httpService: HttpService,
		private _route: ActivatedRoute,
		private _router: Router,
	) {
	}

	ngOnInit(): void {
	}

}
