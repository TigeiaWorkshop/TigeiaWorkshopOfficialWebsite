import { Component, OnInit } from '@angular/core';
import { HttpService } from "../http.service";
import { HttpClient } from "@angular/common/http";
import { PostField } from "../../utilities/Models";

@Component({
	selector: 'app-admin',
	templateUrl: './admin.component.html',
	styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

	constructor(
		private _httpService: HttpService,
		private _http: HttpClient,
	) {
	}

	addPostFields() {
		const postFieldsArr: Array<string> = [
			"维护公告", "节日活动", "综合通知", "封禁告示", "综合讨论", "1服-绝对萌领域玩家交流区", "2服-黎明战线玩家交流区", "少女前线-遗愿玩家交流区", "教程分享", "游戏问题反馈",
			"玩家举报", "开发者面对面", "勋章申请", "论坛建议", "管理员操作记录"
		];

		for (let i = 0; i < postFieldsArr.length; i++) {
			console.log(postFieldsArr[i]);
			this._httpService.createPostField({
				"id": i + 1,
				"name": postFieldsArr[i],
				"image": `/assets/image/blocks/icon_${i}.jpg`
			} as PostField).subscribe((data: any) => console.log(data));
		}
	}

	ngOnInit(): void {
		this._httpService.getPostFields().subscribe(data => {
			if (Object.keys(data).length <= 0) {
				this.addPostFields();
			}
		});
	}

}
