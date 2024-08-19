import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-annual-performance',
  templateUrl: './annual-performance.component.html',
  styleUrls: ['./annual-performance.component.css']
})
export class AnnualPerformanceComponent implements OnInit {
  performanceForm: FormGroup;
  competenciesList: any[] = [];
  subCompetenciesList: any[] = [];
  filteredSubCompetencies: any[] = [];

  constructor(private fb: FormBuilder, private http: HttpClient,private cdr: ChangeDetectorRef) {
    this.performanceForm = this.fb.group({
      userId: ['', Validators.required],
      firstName: [{ value: '', disabled: true }],
      lastName: [{ value: '', disabled: true }],
      jobTitle: [{ value: '', disabled: true }],
      entity: [{ value: '', disabled: true }],
      department: [{ value: '', disabled: true }],
      hierarchicalManager: [{ value: '', disabled: true }],
      inPositionSince: [{ value: '', disabled: true }],
      mobility: [{ value: '', disabled: true }],
      appraisalPeriodFrom: ['', Validators.required],
      appraisalPeriodTo: ['', Validators.required],
      objectives: this.fb.array([]),
      competencies: this.fb.array([]) 
    });
  }

  ngOnInit(): void {
    this.addObjective(); // Initialize with one objective row
    this.addCompetency(); // Initialize with one competency row
    this.loadCompetencies(); // Load competencies on init
  }

  loadCompetencies(): void {
    this.http.get('http://localhost:5000/api/competencies').subscribe((data: any) => {
      this.competenciesList = data;
    }, error => {
      console.error('Error loading competencies:', error);
    });

    this.http.get('http://localhost:5000/api/subCompetencies').subscribe((data: any) => {
      this.subCompetenciesList = data;
      console.log('Loaded Sub-Competencies:', this.subCompetenciesList); // Debugging line
    }, error => {
      console.error('Error loading sub-competencies:', error);
    });
  }

  get objectives(): FormArray {
    return this.performanceForm.get('objectives') as FormArray;
  }

  get competencies(): FormArray {
    return this.performanceForm.get('competencies') as FormArray;
  }

  addObjective(): void {
    const objectiveGroup = this.fb.group({
      weight: ['', Validators.required],
      kpi: ['', Validators.required],
      target: ['', Validators.required],
      resultAchieved: ['', Validators.required],
      percentageTargetRealization: [{ value: '', disabled: true }],
      score: [{ value: '', disabled: true }],
      comments: ['']
    });

    this.objectives.push(objectiveGroup);
  }

  removeObjective(index: number): void {
    this.objectives.removeAt(index);
  }

  addCompetency(): void {
    const competencyGroup = this.fb.group({
      competency: ['', Validators.required],
      subCompetency: ['', Validators.required],  // Store the name here
      requiredLevel: ['', Validators.required],
      proficiencyLevel: ['', Validators.required],
      score: ['', Validators.required],
      comments: [''],
      developmentNeeds: ['']
    });

    this.competencies.push(competencyGroup);
  }

  removeCompetency(index: number): void {
    this.competencies.removeAt(index);
  }
  onCompetencyChange(index: number): void {
    const selectedCompetencyID = Number(this.competencies.at(index).get('competency')?.value); // Ensure it's a number
    console.log('Selected Competency ID:', selectedCompetencyID);
  
    if (selectedCompetencyID) {
      this.filteredSubCompetencies = this.subCompetenciesList.filter(sc => {
        console.log('Checking Sub-Competency:', sc);
        return sc.CompetencyID === selectedCompetencyID;
      });
      console.log('Filtered Sub-Competencies:', this.filteredSubCompetencies);
    } else {
      this.filteredSubCompetencies = [];
    }
  
    // Reset subCompetency field
    this.competencies.at(index).get('subCompetency')?.setValue('');
  
    // Trigger change detection
    this.cdr.detectChanges();
  }
  
  
  
  
  calculateScores(): void {
    this.objectives.controls.forEach((control) => {
      const formGroup = control as FormGroup;
      const target = formGroup.controls['target'].value;
      const resultAchieved = formGroup.controls['resultAchieved'].value;
      const percentage = (resultAchieved / target) * 100;
      let score;

      if (percentage < 85) {
        score = 1;
      } else if (percentage < 95) {
        score = 2;
      } else if (percentage < 105) {
        score = 3;
      } else {
        score = 4;
      }

      formGroup.patchValue({
        percentageTargetRealization: percentage.toFixed(2),
        score: score
      });
    });
  }

  fetchUserDetails(userId: number): void {
    const url = `http://127.0.0.1:5000/api/getUserDetails?UserId=${userId}`;
    this.http.get<any>(url).subscribe(response => {
      if (response) {
        const inPositionSince = this.formatDate(response.InPositionSince);

        this.performanceForm.patchValue({
          firstName: response.FirstName,
          lastName: response.LastName,
          jobTitle: response.JobTitle,
          entity: response.Entity,
          department: response.Department,
          hierarchicalManager: response.HierarchicalManager,
          inPositionSince: inPositionSince,
          mobility: response.Mobility
        });
      } else {
        console.error('User details not found', response);
      }
    }, error => {
      console.error('Error fetching user details', error);
    });
  }

  formatDate(date: string): string {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  onUserIdBlur(): void {
    const userId = this.performanceForm.get('userId')?.value;
    if (userId) {
      this.fetchUserDetails(userId);
    }
  }

  onSubmit(): void {
    if (this.performanceForm.valid) {
      this.calculateScores();
      const formData = this.performanceForm.getRawValue();
  
      // Ensure the date fields are formatted correctly
      formData.appraisalPeriodFrom = this.formatDate(formData.appraisalPeriodFrom);
      formData.appraisalPeriodTo = this.formatDate(formData.appraisalPeriodTo);
  
      console.log('Submitting form data:', formData);
  
      const url = 'http://127.0.0.1:5000/api/appraisals';
  
      this.http.post(url, formData).subscribe(response => {
          console.log('Appraisal saved', response);
      }, error => {
          console.error('Error saving appraisal', error);
          if (error.status === 400) {
              console.error('Bad Request: Check the submitted data.');
          }
      });
    } else {
      console.error('Form is invalid');
  
      // Debug which fields are invalid
      Object.keys(this.performanceForm.controls).forEach(key => {
        const control = this.performanceForm.get(key);
        if (control && control.invalid) {
          console.log(`Invalid field: ${key}`, control.errors);
        }
      });
  
      // Specifically check for invalid competencies
      this.competencies.controls.forEach((control, index) => {
        const formGroup = control as FormGroup;  // Explicitly cast control to FormGroup
        if (formGroup.invalid) {
          console.log(`Invalid competency at index ${index}`, formGroup.errors);
  
          // Debug each individual control within this competency
          Object.keys(formGroup.controls).forEach(fieldName => {
            const fieldControl = formGroup.get(fieldName);
            if (fieldControl && fieldControl.invalid) {
              console.log(`Invalid competency field: ${fieldName}`, fieldControl.errors);
            }
          });
        }
      });
    }
  }
  
  
  
  
}
