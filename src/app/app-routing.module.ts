import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { MenuComponent } from './menu/menu.component';
import { ProfileComponent } from './profile/profile.component';
import { AnnualPerformanceComponent } from './annual-performance/annual-performance.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: 'signin', component: SigninComponent },
  { path: 'annual-performance', component: AnnualPerformanceComponent },

  { path: 'signup', component: SignupComponent, canActivate: [AuthGuard] }, // Protect the signup route
  { path: 'menu', component: MenuComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] }, // Add the ProfileComponent route
  { path: '', redirectTo: '/signin', pathMatch: 'full' }, // Redirect to sign in by default
  { path: '**', redirectTo: '/signin' } // Redirect any unknown path to sign in
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
