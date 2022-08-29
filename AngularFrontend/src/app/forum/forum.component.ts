import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../http.service';
import { get_filed_category_name } from '../../utilities/lang';
import { Post, PostField, User } from "../../utilities/Models";
import { AngularEditorConfig } from "@kolkov/angular-editor";

@Component({
	selector: 'app-forum',
	templateUrl: './forum.component.html',
	styleUrls: ['./forum.component.css']
})

export class ForumComponent implements OnInit {
	UserData: User = {} as User;
	PostFieldData: PostField = {} as PostField;
	thePosts: Array<Post> = [];
	NewPostData: Post = {} as Post;
	ErrorMessage: any;
	readonly MAX_TITLE_LEN: number = 80;
	permission_status: number = -1;

	config: AngularEditorConfig = {
		editable: true,
		spellcheck: true,
		height: '15rem',
		minHeight: '5rem',
		placeholder: 'Enter text here...',
		translate: 'no',
		defaultParagraphSeparator: 'p',
		defaultFontName: 'Arial'
	};

	constructor(
		private _httpService: HttpService,
		private _route: ActivatedRoute,
		private _router: Router,
	) {
	}

	ngOnInit(): void {
		// reset data
		this.PostFieldData = {} as PostField;
		this.UserData = {} as User;
		this.NewPostData.title = "";
		this.NewPostData.content = "";
		this.permission_status = 0;
		this.ErrorMessage = {title: "", content: ""};
		// get data from server
		this._route.queryParamMap.subscribe(params => {
			const _sid = params.get("id");
			if (_sid != null) {
				const _id = Number(_sid);
				this._httpService.getPostField(_id).subscribe(data => {
					this.PostFieldData = data as PostField;
					this._httpService.getCurrentUser().subscribe(data => {
						this.UserData = data as User;
						if (this.UserData.id == null) {
							this.permission_status = 0;
						} else if (this.UserData.group >= this.PostFieldData.permission) {
							this.permission_status = 1;
						} else {
							this.permission_status = 2;
						}
					});
				});
				this._httpService.getPosts(_id).subscribe(data => {
					this.thePosts = data as Array<Post>;
					console.log(this.thePosts);
				});
			}
		});
	}

	getFiledCategoryName(): string {
		return get_filed_category_name(this.PostFieldData.id);
	}

	getImage() {
		return `url(/assets/image/blocks/icon_${this.PostFieldData.id}.jpg) no-repeat center center;`;
	}

	onSubmit(): void {
		this.NewPostData.field = this.PostFieldData;
		this.NewPostData.author = this.UserData;
		this._httpService.createPost(this.NewPostData).subscribe((data: any) => {
			if (data.status == "error") {
				this.ErrorMessage = data;
			} else {
				this._router.navigate(['/post'], {queryParams: {field: this.PostFieldData.id, post: data.id}}).then(r => console.log(r));
			}
		});
	}
}
