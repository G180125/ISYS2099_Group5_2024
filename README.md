# ISYS2099 Database Application - Group Project - Group 5 - 2024

## Project Overview
This project is part of the ISYS2099 course, where Group 5 has developed a comprehensive hospital management system. The system integrates multiple databases and technologies to manage hospital operations, including patient management, staff management, and appointment scheduling.

## Project Structure

```bash
./
├── .env
├── .gitignore
├── package-lock.json
├── package.json
├── app
└── mySQL
```

**Explanation of Directories and Files**:

- **`.env`**: 
- **`.gitignore`**: Specifies intentionally untracked files to ignore by Git.
- **`package-lock.json`**: 
- **`package.json`**: Contains metadata relevant to the project and manages dependencies.
- **`app`**: 
- **`mySQL`**: This NodeJS project folder contains the setup script (NodeJS), utilities SQL scripts, and sample data for the local MySQL database instance. See Installation - Database - MySQL below for more detail.

## Technology Stack

- **Database**:
  ![MySQL](https://img.shields.io/badge/MySQL-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white)
  ![MongoDB](https://img.shields.io/badge/MongoDB-%2347A248.svg?style=for-the-badge&logo=mongodb&logoColor=white)

- **Backend**: 
  ![NodeJS](https://img.shields.io/badge/Node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
  ![Express](https://img.shields.io/badge/Express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
  ![Mongoose](https://img.shields.io/badge/Mongoose-%23880000.svg?style=for-the-badge&logo=mongoose&logoColor=white)

- **Frontend**: 
  ![VueJS](https://img.shields.io/badge/Vue.js-%2335495e.svg?style=for-the-badge&logo=vuedotjs&logoColor=%234FC08D)

## Scripts

```bash
node mySQL/init-db.js
```
Initialize the MySQL database. You have to input your root account username and password in the terminal.
```bash
node app/app.js
```
Starts the backend API server.
```bash
npm run start
```
Runs both the database initialization and the API server.
  
**Note**: *Run `npm run start` only once. This command resets the database, which will result in the loss of all existing data.*

## Contributors

| Name                  | Email                      | Score |
|-----------------------|----------------------------|-------|
| Dat Pham Xuan         | s3927188@rmit.edu.vn       | 5     |
| Long Nguyen Vi Phi    | s3904632@rmit.edu.vn       | 5     |
| Huan Nguyen Dang      | s3927467@rmit.edu.vn       | 5     |
| Nhan Truong Vo Thien  | s3929215@rmit.edu.vn       | 5     |
| Pavel Potemkin        | s3963284@rmit.edu.vn       | 5     |

## Video Demo:

## License

