import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ProfileComponent } from './profile/profile.component';
import { AnnualPerformanceComponent } from './annual-performance/annual-performance.component';





@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    SignupComponent,
    SigninComponent,
    ProfileComponent,
    AnnualPerformanceComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule ,// Add HttpClientModule here
    BrowserAnimationsModule,
    MatSnackBarModule
  ],
  providers: [AuthGuard, AuthService], // Add AuthGuard and AuthService here
  bootstrap: [AppComponent]
})
export class AppModule { }
