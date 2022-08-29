import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpService } from './http.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

// 第三方
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JwtModule } from "@auth0/angular-jwt";
import { AngularEditorModule } from '@kolkov/angular-editor';

// 本地app
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { NavigationComponent } from './navigation/navigation.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { ForumComponent } from './forum/forum.component';
import { PostComponent } from './post/post.component';
import { ArchiveComponent } from './archive/archive.component';
import { WikiComponent } from './wiki/wiki.component';
import { IntroductionComponent } from './introduction/introduction.component';
import { AdminComponent } from './admin/admin.component';

export function tokenGetter() {
	return localStorage.getItem("jwt_token");
}

@NgModule({
	declarations: [
		AppComponent,
		LoginComponent,
		RegistrationComponent,
		NavigationComponent,
		HomeComponent,
		ProfileComponent,
		ForumComponent,
		PostComponent,
		ArchiveComponent,
		WikiComponent,
		IntroductionComponent,
		AdminComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		HttpClientModule,
		FormsModule,
		BrowserAnimationsModule,
		JwtModule.forRoot({
			config: {
				tokenGetter: tokenGetter,
				allowedDomains: ["localhost:7061"],
				disallowedRoutes: []
			}
		}),
		AngularEditorModule
	],
	providers: [HttpService],
	bootstrap: [AppComponent]
})
export class AppModule {
}
