import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '../http.service';
import { get_filed_category_name } from '../../utilities/lang';
import { Comment, Post, User } from "../../utilities/Models";
import { AngularEditorConfig } from "@kolkov/angular-editor";

@Component({
	selector: 'app-post',
	templateUrl: './post.component.html',
	styleUrls: ['./post.component.css']
})

export class PostComponent implements OnInit {
	PostData: Post | null = null;
	UserData: User = {} as User;
	NewReplyData: Comment = {} as Comment;
	ErrorMessage = {content: null};

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
	) {
	}

	ngOnInit(): void {
		this._route.queryParamMap.subscribe(params => {
			const _postIdTmp = params.get("id");
			if (_postIdTmp != null) {
				this._httpService.getPost(Number(_postIdTmp), true).subscribe(data => {
					this.PostData = data as Post;
				});
			}
		});
		this._httpService.getCurrentUser().subscribe(data => {
			this.UserData = data as User;
		});
	}

	getFiledCategoryName(): string {
		if (this.PostData != null) {
			return get_filed_category_name(this.PostData.field.id);
		} else {
			return "";
		}
	}

	onSubmit(): void {
		if (this.PostData != null) {
			this.NewReplyData.author = this.UserData;
			this.NewReplyData.field = this.PostData.field;
			this.NewReplyData.post = Object.assign({}, this.PostData);
			this.NewReplyData.post.comments = [];
			this.NewReplyData.post.author.comments = [];
			this._httpService.createComment(this.NewReplyData).subscribe({
				next: () => {
					if (this.PostData != null) {
						this.PostData.comments.push(this.NewReplyData);
						this.NewReplyData = {} as Comment;
					}
				},
				error: (e) => {
					this.ErrorMessage = e as any;
					console.log(e);
				},
				complete: () => console.info('complete')
			});
		}
	}
}
