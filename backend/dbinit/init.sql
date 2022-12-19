CREATE DATABASE IF NOT EXISTS DoctorsPatientsDB;

USE DoctorsPatientsDB;

CREATE TABLE IF NOT EXISTS Doctors (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      full_name VARCHAR(255) NOT NULL
    )

CREATE TABLE IF NOT EXISTS Patients (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      full_name VARCHAR(255) NOT NULL,
      doctor_id BIGINT NOT NULL
    )