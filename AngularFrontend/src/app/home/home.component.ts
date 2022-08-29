import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { Post, PostField } from "../../utilities/Models";

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
	FrontCovers: Array<Post> = [];
	PostFields: Array<PostField> = [];

	constructor(
		private _httpService: HttpService,
	) {
	}

	ngOnInit(): void {
		this._httpService.getPostFields().subscribe(data => {
			this.PostFields = data as Array<PostField>;
			this.PostFields.sort((a: PostField, b: PostField) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
			this.PostFields.forEach(value => {
					this._httpService.getPostsNum(value.id).subscribe(data => {
						value.count = Number(data);
						if (value.count > 0) {
							this._httpService.getLatestPosts(value.id).subscribe(data => {
								value.latestPost = data as Post;
							});
						}
					});
				}
			);
		});
	}

	getBoxTextPos(index: number): string {
		if (index % 3 == 0) {
			return "carousel-caption text-start";
		} else if (index % 3 == 1) {
			return "carousel-caption";
		} else {
			return "carousel-caption text-end";
		}
	}

	getBoxButtonText(index: number): string {
		if (index % 3 == 0) {
			return "查看详情";
		} else if (index % 3 == 1) {
			return "获取详情";
		} else {
			return "查看公告";
		}
	}

	ifActive(index: number): string {
		if (index == 0) {
			return "active";
		} else {
			return "";
		}
	}
}
