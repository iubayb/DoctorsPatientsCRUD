# DoctorsPatientsCRUD


screenshot: 
![alt text](https://i.ibb.co/X2tsQn3/Firefox-Screenshot-2022-12-19-T05-05-40-431-Z.png "screenshot")


## How to set up the project

run this on the terminal

```
git clone https://github.com/iubayb/DoctorsPatientsCRUD.git
cd DoctorsPatientsCRUD
sudo docker-compose up -d
```
the frontend can be accessed on http://localhost:4200/
the node.js api url is http://localhost:3000/

## Endpoints and payloads


####GET /doctors

Retrieves a list of all doctors.


####GET /doctors/:id

Retrieves a single doctor by id.


####GET /patients

Retrieves a list of all patients.


####GET /patients/:id

Retrieves a single patient by id.


####POST /doctors

Adds a new doctor.

Payload:
```json
{
  "full_name": "string"
}
```

####POST /patients

Adds a new patient.

Payload:
```json
{
  "full_name": "string",
  "doctor_id": "integer"
}
```

####PUT /doctors/:id

Updates an existing doctor by id.

Payload:
```json
{
  "full_name": "string"
}
```


####PUT /patients/:id

Updates an existing patient by id.

Payload:
```json
{
  "full_name": "string",
  "doctor_id": "integer"
}
```


####DELETE /doctors/:id

Deletes a doctor by id.


####DELETE /patients/:id

Deletes a patient by id.


####DELETE /doctors

Deletes all the doctors.


####DELETE /patients

Deletes a the patients.
