import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  users: any[] = [];
  editForm: FormGroup;
  selectedUser: any;
  user: any;

  constructor(private authService: AuthService, private fb: FormBuilder, private router: Router) {
    this.editForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      jobTitle: ['', Validators.required],
      entity: ['', Validators.required],
      department: ['', Validators.required],
      joiningDate: ['', Validators.required],
      hierarchicalManager: ['', Validators.required],
      inPositionSince: ['', Validators.required],
      mobility: ['', Validators.required],
      
      profileImage: [null]
    });
  }

  ngOnInit(): void {
    this.user = this.authService.getUser(); // Assuming getUser() returns user details including role

    if (this.user.role !== 'admin') {
      this.router.navigate(['/menu']); // Redirect non-admin users to the menu
    }

    this.authService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (error) => {
        console.error('Error fetching users', error);
      }
    });
  }

  editUser(user: any) {
    this.selectedUser = user;
    this.editForm.patchValue({
      email: user.Email,
      firstname: user.FirstName,
      lastname: user.LastName,
      jobTitle: user.JobTitle,
      entity: user.Entity,
      department: user.Department,
      joiningDate: user.JoiningDate,
      hierarchicalManager: user.HierarchicalManager,
      inPositionSince: user.InPositionSince,
      mobility: user.Mobility,
      
      profileImage: null
    });
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.editForm.patchValue({ profileImage: file });
    }
  }

  updateUser() {
    if (this.editForm.valid) {
      const formData = new FormData();
      formData.append('email', this.editForm.get('email')?.value);
      formData.append('firstname', this.editForm.get('firstname')?.value);
      formData.append('lastname', this.editForm.get('lastname')?.value);
      formData.append('jobTitle', this.editForm.get('jobTitle')?.value);
      formData.append('entity', this.editForm.get('entity')?.value);
      formData.append('department', this.editForm.get('department')?.value);
      formData.append('joiningDate', this.editForm.get('joiningDate')?.value);
      formData.append('hierarchicalManager', this.editForm.get('hierarchicalManager')?.value);
      formData.append('inPositionSince', this.editForm.get('inPositionSince')?.value);
      formData.append('mobility', this.editForm.get('mobility')?.value);
     

      const file = this.editForm.get('profileImage')?.value;
      if (file) {
        formData.append('profile_image', file);
      }

      this.authService.updateUser(this.selectedUser.UserId, formData).subscribe({
        next: (response) => {
          this.selectedUser.Email = this.editForm.get('email')?.value;
          this.selectedUser.FirstName = this.editForm.get('firstname')?.value;
          this.selectedUser.LastName = this.editForm.get('lastname')?.value;
          this.selectedUser.JobTitle = this.editForm.get('jobTitle')?.value;
          this.selectedUser.Entity = this.editForm.get('entity')?.value;
          this.selectedUser.Department = this.editForm.get('department')?.value;
          this.selectedUser.JoiningDate = this.editForm.get('joiningDate')?.value;
          this.selectedUser.HierarchicalManager = this.editForm.get('hierarchicalManager')?.value;
          this.selectedUser.InPositionSince = this.editForm.get('inPositionSince')?.value;
          this.selectedUser.Mobility = this.editForm.get('mobility')?.value;
        

          if (file) {
            this.selectedUser.ProfileImageUrl = response.profileImageUrl;
          }

          alert('User updated successfully');
          this.selectedUser = null; // Hide the edit form
        },
        error: (error) => {
          console.error('Error updating user', error);
          alert('Error updating user');
        }
      });
    }
  }

  cancelEdit() {
    this.selectedUser = null;
  }

  deleteUser(userId: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.authService.deleteUser(userId).subscribe({
        next: (response) => {
          this.users = this.users.filter(user => user.UserId !== userId);
          alert('User deleted successfully');
        },
        error: (error) => {
          console.error('Error deleting user', error);
          alert('Error deleting user');
        }
      });
    }
  }

  logout() {
    this.authService.logout();
  }

  navigateToSignup() {
    this.router.navigate(['/signup']);
  }
}
