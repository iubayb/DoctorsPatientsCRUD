import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

const API_URL = 'http://localhost:3000';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  getDoctors(): Observable<any> {
    return this.http
      .get(`${API_URL}/doctors`)
      .pipe(catchError((error) => throwError(error)));
  }

  getPatients(): Observable<any> {
    return this.http
      .get(`${API_URL}/patients`)
      .pipe(catchError((error) => throwError(error)));
  }

  getDoctorById(id: number): Observable<any> {
    return this.http
      .get(`${API_URL}/doctors/${id}`)
      .pipe(catchError((error) => throwError(error)));
  }

  getPatientById(id: number): Observable<any> {
    return this.http
      .get(`${API_URL}/patients/${id}`)
      .pipe(catchError((error) => throwError(error)));
  }

  addDoctor(fullName: string): Observable<any> {
    return this.http
      .post(`${API_URL}/doctors`, { full_name: fullName })
      .pipe(catchError((error) => throwError(error)));
  }

  addPatient(fullName: string, doctorId: number): Observable<any> {
    return this.http
      .post(`${API_URL}/patients`, {
        full_name: fullName,
        doctor_id: doctorId,
      })
      .pipe(catchError((error) => throwError(error)));
  }

  updateDoctor(id: number, fullName: string): Observable<any> {
    return this.http
      .put(`${API_URL}/doctors/${id}`, { full_name: fullName })
      .pipe(catchError((error) => throwError(error)));
  }

  updatePatient(
    id: number,
    fullName: string,
    doctorId: number
  ): Observable<any> {
    return this.http
      .put(`${API_URL}/patients/${id}`, {
        full_name: fullName,
        doctor_id: doctorId,
      })
      .pipe(catchError((error) => throwError(error)));
  }

  deleteDoctor(id: number): Observable<any> {
    return this.http
      .delete(`${API_URL}/doctors/${id}`)
      .pipe(catchError((error) => throwError(error)));
  }

  deletePatient(id: number): Observable<any> {
    return this.http
      .delete(`${API_URL}/patients/${id}`)
      .pipe(catchError((error) => throwError(error)));
  }

  deleteAllDoctors(): Observable<any> {
    return this.http
      .delete(`${API_URL}/doctors`)
      .pipe(catchError((error) => throwError(error)));
  }

  deleteAllPatients(): Observable<any> {
    return this.http
      .delete(`${API_URL}/patients`)
      .pipe(catchError((error) => throwError(error)));
  }
}
