const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');
require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});


connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to database as id');
  questionLoop();

});

function questionLoop() {
  const questions = [
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role',
        'Exit'
      ],
    }
  ]


inquirer
  .prompt(questions).then((answers) => {
    manager(answers.action); // Pass the selected action to the manager function
    console.log(answers);

  })
  function manager(manageList) {
  
    switch (manageList) {
      case 'View all departments':
        viewAllDepartments();
        break;
      case 'View all roles':
        viewAllRoles();
        break;
      case 'View all employees':
        viewAllEmployees();
        break;
      case 'Add a department':
        addDepartment();
        break;
      case 'Add a role':
        addRole();
        break;
      case 'Add an employee':
        addEmployee();
        break;
      case 'Update an employee role':
        updateEmployeeRole();
        break;
      case 'Exit':
        connection.end();
        break;
        default:
      console.log('Invalid action');
      questionLoop(); 
    }
  }
}

  function viewAllDepartments() {
    connection.query('SELECT * FROM departments', (err, res) => {
      if (err) throw err;
  
      console.table(res);
  
      questionLoop(); 

    });
  }

  function viewAllRoles() {
    connection.query(`
      SELECT roles.title AS "Job Title", roles.id AS "Role ID", departments.department_name AS "Department", roles.salary AS "Salary"
      FROM roles
      INNER JOIN departments ON roles.department_id = departments.id
    `, (err, res) => {
      if (err) throw err;
      console.table(res);
      questionLoop();
    });
  }

  function viewAllEmployees() {
    const sql = `
      SELECT e.id, e.first_name AS "First Name", e.last_name AS "Last Name", 
        roles.title AS "Job Title", departments.department_name AS "Department", roles.salary AS "Salary", 
        CONCAT(m.first_name, ' ', m.last_name) AS "Manager"
      FROM employees e
      INNER JOIN roles ON e.role_id = roles.id
      INNER JOIN departments ON roles.department_id = departments.id
      LEFT JOIN employees m ON e.manager_id = m.id
    `;
    connection.query(sql, (err, results) => {
      if (err) throw err;
      console.table(results);
      questionLoop();
    });
  }
