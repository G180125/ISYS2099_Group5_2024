const mysql = require("mysql2/promise");
const readline = require("readline");
const fs = require("fs").promises;

const stdin = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function promptUser() {
  return new Promise(resolve => {
    stdin.question("Enter MySQL root username: ", user => {
      resolve(user);
    });
  });
}

async function promptPassword(user) {
  return new Promise(resolve => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: true
    });

    // Override _writeToOutput to hide input
    rl._writeToOutput = function _writeToOutput(stringToWrite) {
      rl.output.write("\x1B[2K\x1B[200D" + `Enter MySQL password for "${user}": `);
    };

    // Manually display the prompt
    rl.output.write(`Enter MySQL password for "${user}": `);

    let password = '';
    rl.input.on('keypress', (char) => {
      if (char === '\r') { // Enter key pressed
        rl.output.write("\x1B[2K\x1B[200D");
        rl.close();
        resolve(password);
      } else {
        password += char;
        rl._writeToOutput('*');
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
      .then(res => {
        return res.replaceAll("DELIMITER $$", "");
      })
      .then(res => {
        return res.replaceAll("END $$", "END;");
      })
      .then(res => {
        return res.replaceAll("DELIMITER ;", "");
      });

    await connection.query(script);
    console.log(`Script executed successfully: ${scriptPath}`);
  } catch (err) {
    console.error(`Error executing script ${scriptPath}:`, err);
  }
}

(async () => {
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
        "validate_password.policy not found. Skipping policy setting.",
      );
    } else {
      await setValidationPolicy(connection);
    }

    // Execute SQL setup scripts
    let scripts;
    if (process.argv.length === 2) {
      scripts = [
        "mySQL/tables.sql",
        "mySQL/index.sql",
        "mySQL/Procedure/patient_procedures.sql",
        "mySQL/Procedure/staff_procedures.sql",
        "mySQL/app_user.sql",
        "mySQL/insert_data.sql"
      ];
    } 

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
})().then(() => {});