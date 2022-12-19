import { Component, OnInit } from '@angular/core';
import { ApiService } from './api.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Doctor, Patient } from './models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'frontend';

  // define arrays for storing the list of doctors and patients
  doctors: Doctor[] = [];
  patients: Patient[] = [];

  // define FormGroup objects for each form in the template
  addDoctorForm: FormGroup;
  addPatientForm: FormGroup;

  updateDoctorForm: FormGroup;
  updatePatientForm: FormGroup;

  findDoctorForm: FormGroup;
  findPatientForm: FormGroup;

  // define properties for storing the selected doctor and patient
  selectedDoctor: Doctor | null;
  selectedPatient: Patient | null;

  // define properties for storing the found doctor and patient
  foundDoctor: Doctor | null;
  foundPatient: Patient | null;

  // inject the necessary dependencies in the constructor
  constructor(
    private apiService: ApiService,
    private formBuilder: FormBuilder
  ) {
    // initialize the addDoctorForm with a full_name field that is required
    this.addDoctorForm = this.formBuilder.group({
      full_name: ['', Validators.required],
    });

    // initialize the addPatientForm with full_name and doctor_id fields that are required
    this.addPatientForm = this.formBuilder.group({
      full_name: ['', Validators.required],
      doctor_id: ['', Validators.required],
    });

    // initialize the updateDoctorForm with a full_name field that is required
    this.updateDoctorForm = this.formBuilder.group({
      full_name: ['', Validators.required],
    });

    // initialize the updatePatientForm with full_name and doctor_id fields that are required
    this.updatePatientForm = this.formBuilder.group({
      full_name: ['', Validators.required],
      doctor_id: ['', Validators.required],
    });

    // initialize the findDoctorForm with a doctorId field that is required
    this.findDoctorForm = this.formBuilder.group({
      doctorId: ['', Validators.required],
    });

    // initialize the findPatientForm with a patientId field that is required
    this.findPatientForm = this.formBuilder.group({
      patientId: ['', Validators.required],
    });

    // initially, there is no selected doctor or patient
    this.selectedDoctor = null;
    this.selectedPatient = null;

    // initially, there is no found doctor or patient
    this.foundDoctor = null;
    this.foundPatient = null;
  }

  // get the list of doctors and patients when the component initializes
  ngOnInit() {
    this.getDoctors();
    this.getPatients();
  }

  // Retrieves a list of doctors from the API and stores it in the component's 'doctors' property
  getDoctors() {
    this.apiService.getDoctors().subscribe(
      (doctors) => {
        this.doctors = doctors;
      },
      (error) => {
        alert(error.error);
      }
    );
  }

  // Retrieves a list of patients from the API and stores it in the component's 'patients' property
  getPatients() {
    this.apiService.getPatients().subscribe(
      (patients) => {
        this.patients = patients;
      },
      (error) => {
        alert(error.error);
      }
    );
  }

  // Searches for a doctor by ID  and stores the result in the component's 'foundDoctor' property
  findDoctor() {
    // Retrieves the doctor ID from the 'findDoctorForm' form
    const doctorId = this.findDoctorForm?.get('doctorId')?.value;
    if (!doctorId) {
      alert("Invalid Doctor's id");
      return;
    }
    this.apiService.getDoctorById(doctorId).subscribe(
      (doctor) => {
        this.foundDoctor = doctor;
      },
      (error) => {
        alert(error.error);
        this.foundDoctor = null;
      }
    );
  }

  // Searches for a patient by ID  and stores the result in the component's 'foundPatient' property
  findPatient() {
    // Retrieves the patient ID from the 'findPatientForm' form
    const patientId = this.findPatientForm?.get('patientId')?.value;
    if (!patientId) {
      alert("Invalid Patient's id");
      return;
    }
    this.apiService.getPatientById(patientId).subscribe(
      (patient) => {
        this.foundPatient = patient;
      },
      (error) => {
        alert(error.error);
        this.foundPatient = null;
      }
    );
  }

  // Adds a new doctor to the database
  addDoctor() {
    // Retrieves the doctor's full name from the 'addDoctorForm' form
    const full_name = this.addDoctorForm?.get('full_name')?.value;
    this.apiService.addDoctor(full_name).subscribe(
      () => {
        // After adding the doctor, retrieve the updated list of doctors from the API
        this.getDoctors();
        // Reset the 'addDoctorForm' form
        this.addDoctorForm.reset();
      },
      (error) => {
        alert(error.error);
      }
    );
  }
  // Adds a new patient to the database
  addPatient() {
    // Retrieves the patient's full name and associated doctor ID from the 'addPatientForm' form
    const full_name = this.addPatientForm?.get('full_name')?.value;
    const doctor_id = this.addPatientForm?.get('doctor_id')?.value;
    this.apiService.addPatient(full_name, doctor_id).subscribe(
      // Upon successful addition of the patient, retrieve the updated list of patients and reset the 'addPatientForm' form
      () => {
        this.getPatients();
        this.addPatientForm.reset();
      },
      (error) => {
        alert(error.error);
      }
    );
  }

  // Updates the information of a specific doctor in the database
  updateDoctor(id: number) {
    // Retrieves the updated full name for the doctor from the 'updateDoctorForm' form
    const full_name = this.updateDoctorForm?.get('full_name')?.value;
    this.apiService.updateDoctor(id, full_name).subscribe(
      // Upon successful update, reset the 'updateDoctorForm' form, unset the 'selectedDoctor' property, and retrieve the updated list of doctors
      () => {
        this.selectedDoctor = null;
        this.updateDoctorForm.reset();
        this.getDoctors();
      },
      (error) => {
        alert(error.error);
      }
    );
  }

  // Updates the information of a specific patient in the database
  updatePatient(id: number) {
    // Retrieves the updated full name and associated doctor ID for the patient from the 'updatePatientForm' form
    const full_name = this.updatePatientForm?.get('full_name')?.value;
    const doctor_id = this.updatePatientForm?.get('doctor_id')?.value;
    this.apiService.updatePatient(id, full_name, doctor_id).subscribe(
      // Upon successful update, reset the 'updatePatientForm' form, unset the 'selectedPatient' property, and retrieve the updated list of patients
      () => {
        this.selectedPatient = null;
        this.updatePatientForm.reset();
        this.getPatients();
      },
      (error) => {
        alert(error.error);
      }
    );
  }

  // Pre-populates the 'updateDoctorForm' form with the data of the selected doctor
  showUpdateDoctorForm(doctor: Doctor) {
    this.selectedDoctor = doctor;
    this.updateDoctorForm.patchValue({
      full_name: doctor.full_name,
    });
  }

  // Pre-populates the 'updatePatientForm' form with the data of the selected patient
  showUpdatePatientForm(patient: Patient) {
    this.selectedPatient = patient;
    this.updatePatientForm.patchValue({
      full_name: patient.full_name,
      doctor_id: patient.doctor_id,
    });
  }

  // Deletes a specific doctor from the database
  deleteDoctor(id: number) {
    this.apiService.deleteDoctor(id).subscribe(
      // Upon successful deletion, retrieve the updated list of doctors
      () => {
        this.getDoctors();
      },
      (error) => {
        alert(error.error);
      }
    );
  }

  // Deletes a specific patient from the database
  deletePatient(id: number) {
    this.apiService.deletePatient(id).subscribe(
      // Upon successful deletion, retrieve the updated list of patients
      () => {
        this.getPatients();
      },
      (error) => {
        alert(error.error);
      }
    );
  }

  // Deletes all doctors from the database
  deleteAllDoctors() {
    // Display a confirmation message before proceeding with the deletion
    if (confirm('Are you sure you want to delete all doctors?')) {
      this.apiService.deleteAllDoctors().subscribe(
        // Upon successful deletion, retrieve the updated list of doctors
        () => {
          this.getDoctors();
        },
        (error) => {
          alert(error.error);
        }
      );
    }
  }

  // Deletes all patients from the database
  deleteAllPatients() {
    // Display a confirmation message before proceeding with the deletion
    if (confirm('Are you sure you want to delete all patients?')) {
      this.apiService.deleteAllPatients().subscribe(
        // Upon successful deletion, retrieve the updated list of patients
        () => {
          this.getPatients();
        },
        (error) => {
          alert(error.error);
        }
      );
    }
  }
}
