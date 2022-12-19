import express from "express";
import ip from "ip";
import dotenv from "dotenv";
import cors from "cors";
import { createConnection } from "mysql";
import logs from "./utils/logger.js";

// loads environment variables
dotenv.config();

// gets the server port from the environment variables
const port = process.env.SERVER_PORT;

// creates an Express app
const app = express();

// enable CORS for all origins
app.use(cors({ origin: "*" })); // !!! origin will be replaced in production

// enable JSON body parsing
app.use(express.json());

// MySQL connection
const connection = createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: process.env.DB_CONNECTION_LIMIT,
  queueLimit: process.env.DB_QUEUE_LIMIT,
});

// returns all doctors
app.get("/doctors", (req, res) => {
  logs.info(`${req.method} ${req.originalUrl}, returning all doctors`);
  connection.query("SELECT * FROM Doctors", (error, results) => {
    if (error) {
      res.status(500).send(error.message);
    } else res.send(results);
  });
});

// returns all patients
app.get("/patients", (req, res) => {
  logs.info(`${req.method} ${req.originalUrl}, returning all patients`);
  connection.query("SELECT * FROM Patients", (error, results) => {
    if (error) {
      res.status(500).send(error.message);
    } else res.send(results);
  });
});

// returns a single doctor by id
app.get("/doctors/:id", (req, res) => {
  logs.info(
    `${req.method} ${req.originalUrl}, returning a single doctor by id`
  );
  const id = req.params.id;
  connection.query(
    "SELECT * FROM Doctors WHERE id = ?",
    [id],
    (error, results) => {
      if (error) {
        res.status(500).send(error.message);
      } else if (!results[0]) {
        res.status(404).send(`Doctor by id ${id} was not found`);
      } else {
        res.send(results[0]);
      }
    }
  );
});

// returns a single patient by id
app.get("/patients/:id", (req, res) => {
  logs.info(
    `${req.method} ${req.originalUrl}, returning a single patient by id`
  );
  const id = req.params.id;
  connection.query(
    "SELECT * FROM Patients WHERE id = ?",
    [id],
    (error, results) => {
      if (error) {
        res.status(500).send(error.message);
      } else if (!results[0]) {
        res.status(404).send(`Patient by id ${id} was not found`);
      } else {
        res.send(results[0]);
      }
    }
  );
});

// adds a new doctor
app.post("/doctors", (req, res) => {
  logs.info(`${req.method} ${req.originalUrl}, adding a new doctor`);
  const { full_name } = req.body;
  if (!full_name) {
    res.status(400).send("Missing parameter(s) in request body");
  } else {
    connection.query(
      "INSERT INTO Doctors (full_name) VALUES (?)",
      [full_name],
      (error, results) => {
        if (error) {
          res.status(500).send(error.message);
        } else
          res.send({
            ...results,
            message: "Doctor added",
            data: {
              full_name: full_name,
              id: results.insertId,
            },
          });
      }
    );
  }
});

// adds a new patient
app.post("/patients", (req, res) => {
  logs.info(`${req.method} ${req.originalUrl}, adding a new patient`);
  const { full_name, doctor_id } = req.body;
  if (!full_name || !doctor_id) {
    res.status(400).send("Missing parameter(s) in request body");
  } else {
    // checks if doctor exists
    connection.query(
      "SELECT * FROM Doctors WHERE id = ?",
      [doctor_id],
      (error, results) => {
        if (error) {
          res.status(500).send(error.message);
        } else if (!results[0]) {
          res.status(404).send(`Doctor with id ${doctor_id} not found`);
        } else {
          // add patient
          connection.query(
            "INSERT INTO Patients (full_name, doctor_id) VALUES (?, ?)",
            [full_name, doctor_id],
            (error, results) => {
              if (error) {
                res.status(500).send(error.message);
              } else {
                res.send({
                  ...results,
                  message: "Patient added",
                  data: {
                    doctor_id: doctor_id,
                    full_name: full_name,
                    id: results.insertId,
                  },
                });
              }
            }
          );
        }
      }
    );
  }
});

// updates an existing doctor
app.put("/doctors/:id", (req, res) => {
  logs.info(`${req.method} ${req.originalUrl}, updating an existing doctor`);
  const id = req.params.id;
  const { full_name } = req.body;
  if (!full_name) {
    res.status(400).send("Missing parameter(s) in request body");
  } else {
    connection.query(
      "UPDATE Doctors SET full_name = ? WHERE id = ?",
      [full_name, id],
      (error, results) => {
        if (error) {
          res.status(500).send(error.message);
        } else if (results.affectedRows === 0) {
          res.status(404).send(`Doctor by id ${id} was not found`);
        } else {
          res.send({
            ...results,
            message: `Doctor by id ${id} data updated`,
            data: {
              full_name: full_name,
              id: id,
            },
          });
        }
      }
    );
  }
});

// updates an existing patient
app.put("/patients/:id", (req, res) => {
  logs.info(`${req.method} ${req.originalUrl}, updating a patient`);
  const id = req.params.id;
  const { full_name, doctor_id } = req.body;
  if (!full_name || !doctor_id) {
    res.status(400).send("Missing parameter(s) in request body");
  } else {
    // check if doctor exists
    connection.query(
      "SELECT * FROM Doctors WHERE id = ?",
      [doctor_id],
      (error, results) => {
        if (error) {
          res.status(500).send(error.message);
        } else if (!results[0]) {
          res.status(404).send(`Doctor with id ${doctor_id} not found`);
        } else {
          // update patient
          connection.query(
            "UPDATE Patients SET full_name = ?, doctor_id = ? WHERE id = ?",
            [full_name, doctor_id, id],
            (error, results) => {
              if (error) {
                res.status(500).send(error.message);
              } else if (results.affectedRows === 0) {
                res.status(404).send(`Patient by id ${id} was not found`);
              } else {
                res.send({
                  ...results,
                  message: `Patient by id ${id} data updated`,
                  data: {
                    doctor_id: doctor_id,
                    full_name: full_name,
                    id: id,
                  },
                });
              }
            }
          );
        }
      }
    );
  }
});

// deletes a doctor by id
app.delete("/doctors/:id", (req, res) => {
  logs.info(`${req.method} ${req.originalUrl}, deleting a doctor by id`);
  const id = req.params.id;
  connection.query(
    "DELETE FROM Doctors WHERE id = ?",
    [id],
    (error, results) => {
      if (error) {
        res.status(500).send(error.message);
      } else if (results.affectedRows === 0) {
        res.status(404).send(`Doctor by id ${id} was not found`);
      } else {
        res.send({
          ...results,
          message: `Doctor by id ${id} data deleted`,
        });
      }
    }
  );
});

// deletes a patient by id
app.delete("/patients/:id", (req, res) => {
  logs.info(`${req.method} ${req.originalUrl}, deleting a patient by id`);
  const id = req.params.id;
  connection.query(
    "DELETE FROM Patients WHERE id = ?",
    [id],
    (error, results) => {
      if (error) {
        res.status(500).send(error.message);
      } else if (results.affectedRows === 0) {
        res.status(404).send(`Patient by id ${id} was not found`);
      } else {
        res.send({
          ...results,
          message: `Patient by id ${id} data deleted`,
        });
      }
    }
  );
});

// deletes all doctors
app.delete("/doctors", (req, res) => {
  logs.info(`${req.method} ${req.originalUrl}, deleting all doctors`);
  connection.query("DELETE FROM Doctors", (error, results) => {
    if (error) {
      res.status(500).send(error.message);
    } else
      res.send({
        ...results,
        message: "All doctors data deleted",
      });
  });
  // !!! should be used with caution, as this will permanently delete all doctors from the database
});

// deletes all patients
app.delete("/patients", (req, res) => {
  logs.info(`${req.method} ${req.originalUrl}, deleting all patients`);
  connection.query("DELETE FROM Patients", (error, results) => {
    if (error) {
      res.status(500).send(error.message);
    } else
      res.send({
        ...results,
        message: "All patients data deleted",
      });
  });
  // !!! should be used with caution, as this will permanently delete all patients from the database
});

app.listen(port, () =>
  // logs the server address to the console
  logs.info(`Running on: ${ip.address()}:${port}`)
);
