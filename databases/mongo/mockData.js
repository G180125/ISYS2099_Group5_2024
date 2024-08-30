const fs = require("fs");
const path = require("path");
const client = require("./client");
const uploadFile = require("./uploadFile");

const dataDirName = "mock_data";
const treatmentFileTypes = [
  "Prescription",
  "Procedure",
  "Admission",
  "Discharge",
  "Preoperative",
];
const staffFileTypes = [
  "Avatar",
  "Certificate",
  "Curriculum Vitae",
  "References",
  "Legal Documents",
];

const dirNames = ["staff", "treatment"];

const getFileType = (dir) => {
  const index = Math.floor(Math.random() * 5);
  const type = dir == "staff" ? staffFileTypes[0] : treatmentFileTypes[index];
  return type;
};

const mockData = async () => {
  try {
    await client.connect();

    // read local files
    for (const dirName of dirNames) {
      console.log(">", dirName);
      const subDirPath = path.join(__dirname, dataDirName, dirName);
      const fileNames = fs.readdirSync(subDirPath);

      for (const [i, fileName] of fileNames.entries()) {
        const filePath = path.join(subDirPath, fileName);
        const fileBuf = fs.readFileSync(filePath);

        // console.log(fileName);
        const fileTarget = {
          originalname: fileName,
          buffer: fileBuf,
        };
        const metadata = {
          mysql_id: `${i + 1}`,
          type: getFileType(dirName),
        };

        await uploadFile(fileTarget, dirName, metadata);
      }
    }
  } finally {
    await client.close();
  }
};

module.exports = mockData;
