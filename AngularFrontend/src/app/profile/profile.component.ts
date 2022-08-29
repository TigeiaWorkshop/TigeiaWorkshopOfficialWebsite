import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '../http.service';
import { get_use_group_name } from '../../utilities/lang';
import { User } from "../../utilities/Models";

@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {

	@ViewChild("fileUpload", {static: false}) fileUpload!: ElementRef;
	files: any[] = [];
	UserData: User = {} as User;
	UserGroupName: string = "";
	UserDaysBeingMember: number = 0;
	CurrentUserData: User = {} as User;
	private file_size_limit_in_mb: number = 10;
	private file_size_limit_in_b: number = this.file_size_limit_in_mb * 1024 * 2024;

	constructor(
		private _route: ActivatedRoute,
		private _httpService: HttpService,
	) {
	}

	ngOnInit(): void {
		this._route.queryParamMap.subscribe(params => {
			const _id = params.get("id");
			if (_id != null) {
				this._httpService.getUser(Number(_id)).subscribe(data => {
					this.UserData = data as User;
					this.UserGroupName = get_use_group_name(this.UserData.group);
					let date1: Date = new Date();
					let date2: Date = new Date(this.UserData.createdAt);
					this.UserDaysBeingMember = Math.ceil((date1.getTime() - date2.getTime()) / (1000 * 60 * 60 * 24));
				});
			}
		});
		this._httpService.getCurrentUser().subscribe(data => {
			this.CurrentUserData = data as User;
		});

	}

	onClick(): void {
		const fileUpload = this.fileUpload.nativeElement;
		fileUpload.onchange = () => {
			for (let index = 0; index < fileUpload.files.length; index++) {
				let items = {data: fileUpload.files[index], inProgress: false, progress: 0};
				this.files.push(items);
			}
			this.fileUpload.nativeElement.value = '';
			this.files.forEach(file => {
				if (file != null) {
					if (file.data.size <= this.file_size_limit_in_b) {
						this._httpService.upload_file(1, file);
						alert(`头像上传成功!`);
					} else {
						alert(`头像图片大小不可以超过${this.file_size_limit_in_mb}MB!`);
					}
				}
			});
		};
		fileUpload.click();
	}
}
