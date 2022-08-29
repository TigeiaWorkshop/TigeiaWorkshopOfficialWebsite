import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { HttpClient } from '@angular/common/http';
import { RegistrationValidation } from "../../utilities/Validations";
import { TokenService } from "../token.service";

@Component({
	selector: 'app-registration',
	templateUrl: './registration.component.html',
	styleUrls: ['./registration.component.css']
})

export class RegistrationComponent implements OnInit {
	RegistrationData: Record<string, string> = {
		"name": "", "email": "", "birthday": "", "password": "", "password_confirm": "", "captcha": "", "registerIp": ""
	};
	ErrorMessage: Record<string, string> = {
		"name": "", "email": "", "birthday": "", "password": "", "password_confirm": "", "captcha": ""
	};

	constructor(
		private _httpService: HttpService,
		private _http: HttpClient,
		private _token: TokenService
	) {
	}

	ngOnInit(): void {
		this._httpService.ensureNotLoginAlready();
	}

	onSubmit(): void {
		// reset error message
		for (const key in this.ErrorMessage) {
			this.ErrorMessage[key] = "";
		}
		this._httpService.getIpInfo().subscribe((res: any) => {
			this.RegistrationData['registerIp'] = res.ip;
			if (this.RegistrationData['registerIp'] != null && this.RegistrationData['registerIp'] != "") {
				const errors: Map<string, string> = RegistrationValidation.check(this.RegistrationData);
				if (errors.size > 0) {
					errors.forEach((value: string, key: string) => {
						this.ErrorMessage[key] = value;
					});
				} else {
					this._httpService.registerUser(this.RegistrationData).subscribe((data: any) => {
						this._token.set(data.token);
						this._httpService.gotoHomePage();
						// reset registration ngmodel
						for (const key in this.RegistrationData) {
							this.RegistrationData[key] = "";
						}
					});
				}
			}
		});
	}
}
