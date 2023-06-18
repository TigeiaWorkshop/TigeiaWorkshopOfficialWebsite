import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { ForumComponent } from './forum/forum.component';
import { PostComponent } from './post/post.component';
import { ArchiveComponent } from './archive/archive.component';
import { WikiComponent } from './wiki/wiki.component';
import { IntroductionComponent } from './introduction/introduction.component';
import { AdminComponent } from "./admin/admin.component";

const routes: Routes = [
	{path: '', component: HomeComponent},
	{path: 'login', component: LoginComponent},
	{path: 'registration', component: RegistrationComponent},
	{path: 'profile', component: ProfileComponent},
	{path: 'forum', component: ForumComponent},
	{path: 'post', component: PostComponent},
	{path: 'archive', component: ArchiveComponent},
	{path: 'wiki', component: WikiComponent},
	{path: 'introduction', component: IntroductionComponent},
	{path: 'admin', component: AdminComponent},
	{path: '**', pathMatch: 'full', redirectTo: ''},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
