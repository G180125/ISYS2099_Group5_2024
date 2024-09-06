const mysql = require("mysql2/promise");
const readline = require("readline");
const fs = require("fs").promises;

const stdin = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function promptUser() {
  return new Promise((resolve) => {
    stdin.question("Enter MySQL root username: ", (user) => {
      resolve(user);
    });
  });
}

async function promptPassword(user) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: true,
    });

    // Override _writeToOutput to hide input
    rl._writeToOutput = function _writeToOutput(stringToWrite) {
      rl.output.write(
        "\x1B[2K\x1B[200D" + `Enter MySQL password for "${user}": `
      );
    };

    // Manually display the prompt
    rl.output.write(`Enter MySQL password for "${user}": `);

    let password = "";
    rl.input.on("keypress", (char) => {
      if (char === "\r") {
        // Enter key pressed
        rl.output.write("\x1B[2K\x1B[200D");
        rl.close();
        resolve(password);
      } else {
        password += char;
        rl._writeToOutput("*");
      }
    });
  });
}

async function setValidationPolicy(connection) {
  try {
    await connection.query(`SET GLOBAL validate_password.policy = 0`);
    console.log("Validation policy set to 0");
  } catch (err) {
    console.error("Failed to set validation policy: ", err);
  }
}

async function executeSetupScript(connection, scriptPath) {
  try {
    let script = await fs
      .readFile(scriptPath, "utf-8")
      .then((res) => {
        return res.replaceAll("DELIMITER $$", "");
      })
      .then((res) => {
        return res.replaceAll("END $$", "END;");
      })
      .then((res) => {
        return res.replaceAll("DELIMITER ;", "");
      });

    await connection.query(script);
    console.log(`Script executed successfully: ${scriptPath}`);
  } catch (err) {
    console.error(`Error executing script ${scriptPath}:`, err);
  }
}

async function setupDb() {
  try {
    const user = await promptUser();
    const password = await promptPassword(user);

    const connection = await mysql.createConnection({
      user: user,
      host: "localhost",
      password: password,
      multipleStatements: true,
    });

    console.log("\nConnected to MySQL database as id " + connection.threadId);

    // Check if validate_password.policy exists
    const checkPolicyQuery = "SHOW VARIABLES LIKE 'validate_password.policy'";
    const [rows] = await connection.query(checkPolicyQuery);
    if (rows.length === 0) {
      console.log(
        "validate_password.policy not found. Skipping policy setting."
      );
    } else {
      await setValidationPolicy(connection);
    }

    // Execute SQL setup scripts
    let scripts;

    const pathPrefix = "databases/mysql";
    // if (process.argv.length === 2) {
    scripts = [
      `${pathPrefix}/tables.sql`,
      `${pathPrefix}/materialized_view.sql`,
      `${pathPrefix}/index.sql`,
      `${pathPrefix}/Procedure/user_procedures.sql`,
      `${pathPrefix}/Procedure/appointment_procedures.sql`,
      `${pathPrefix}/Procedure/patient_procedures.sql`,
      `${pathPrefix}/Procedure/view_report_procedures.sql`,
      `${pathPrefix}/Procedure/staff_procedures.sql`,
      `${pathPrefix}/Procedure/ticket_procedures.sql`,
      `${pathPrefix}/Procedure/ticket_procedures.sql`,
      `${pathPrefix}/insert_data.sql`,
      `${pathPrefix}/Procedure/refresh_procedures.sql`,
      `${pathPrefix}/Trigger/billing_report_trigger.sql`,
      `${pathPrefix}/Trigger/doctor_work_report_trigger.sql`,
      `${pathPrefix}/Trigger/staff_job_change_report_trigger.sql`,
      `${pathPrefix}/Trigger/treatment_report_trigger.sql`,
      `${pathPrefix}/Trigger/bussiness_logic_trigger.sql`,
      `${pathPrefix}/Trigger/doctor_free_slot_report.sql`,
      `${pathPrefix}/Trigger/patient_secure_report_trigger.sql`,
      `${pathPrefix}/Trigger/staff_secure_report_trigger.sql`,
      `${pathPrefix}/AppUser/admin_app_user.sql`,
      `${pathPrefix}/AppUser/staff_app_user.sql`,
      `${pathPrefix}/AppUser/patient_app_user.sql`,
    ];
    // }

    for (const script of scripts) {
      await executeSetupScript(connection, `${script}`);
    }

    await connection.end(); // Close the connection
    console.log(`Database initialized!`);
  } catch (err) {
    console.error("Error connecting to MySQL database: " + err.stack);
  } finally {
    stdin.close(); // Close the readline interface
  }
}

module.exports = setupDb;
