import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service'; // Adjust the path as necessary

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm: FormGroup;
  signupSuccess: boolean = false;
  selectedFile: File | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      role: ['employee', Validators.required],  // Default to 'employee'
      job_title: ['', Validators.required],
      entity: ['', Validators.required],
      department: ['', Validators.required],
      joining_date: ['', Validators.required],
      hierarchical_manager: ['', Validators.required],
      in_position_since: ['', Validators.required],
      mobility: ['', Validators.required],
      
    });
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  onSubmit() {
    if (this.signupForm.valid) {
      const formData = new FormData();
      formData.append('email', this.signupForm.get('email')?.value);
      formData.append('password', this.signupForm.get('password')?.value);
      formData.append('firstname', this.signupForm.get('firstname')?.value);
      formData.append('lastname', this.signupForm.get('lastname')?.value);
      formData.append('role', this.signupForm.get('role')?.value);
      formData.append('job_title', this.signupForm.get('job_title')?.value);
      formData.append('entity', this.signupForm.get('entity')?.value);
      formData.append('department', this.signupForm.get('department')?.value);
      formData.append('joining_date', this.signupForm.get('joining_date')?.value);
      formData.append('hierarchical_manager', this.signupForm.get('hierarchical_manager')?.value);
      formData.append('in_position_since', this.signupForm.get('in_position_since')?.value);
      formData.append('mobility', this.signupForm.get('mobility')?.value);
      formData.append('appraisal_period_from', this.signupForm.get('appraisal_period_from')?.value);
      formData.append('appraisal_period_to', this.signupForm.get('appraisal_period_to')?.value);

      if (this.selectedFile) {
        formData.append('profile_image', this.selectedFile);
      }

      this.authService.signup(formData).subscribe({
        next: (response) => {
          console.log('Signup successful:', response);
          this.signupSuccess = true;
          this.signupForm.reset();
          this.selectedFile = null;
        },
        error: (error) => {
          if (error.status === 409) {
            alert('A user with this email already exists. Please use a different email.');
          } else {
            console.error('Signup failed:', error);
            alert('An error occurred during signup. Please try again.');
          }
        }
      });
    }
  }
}
