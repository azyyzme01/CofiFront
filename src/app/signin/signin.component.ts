import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service'; // Adjust the path as necessary
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {
  signinForm: FormGroup;
  signinError: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.signinForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  get f() { return this.signinForm.controls; }  // Helper function for template access

  onSubmit() {
    if (this.signinForm.valid) {
      this.authService.signin(this.signinForm.value).subscribe({
        next: (response: any) => {
          console.log('Sign in successful', response);
          if (response.user && response.token) {
            this.authService.setToken(response.token);
            this.authService.setUser(response.user); // Assume the response contains user info
            this.router.navigate(['/menu']); // Redirect to menu
          } else {
            console.error('Response does not contain user or token:', response);
            this.signinError = 'Invalid response from server. Please try again later.';
          }
        },
        error: (error) => {
          console.error('Sign in failed', error);
          this.signinError = 'Incorrect email or password. Please try again.'; // Display error message
        }
      });
    }
  }
}
