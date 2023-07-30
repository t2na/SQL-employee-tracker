const inquirer = require('inquirer');
const fs = require('fs');
const db = require('./config/connection');

const start = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'startMenu',
            message: 'What would you like to do?',
            choices: ['View All Employees', 'View All Roles', 'View All Departments', 'Create Department', 'Exit']
        },
    ]).then(answers => {
      
        switch(answers.startMenu) {
            case 'View All Employees':
                viewEmployee()
                break
            case 'Add Employee':
                addEmployee()
                break
            case 'View All Roles':
                viewRoles()
                break
            case 'View All Departments':
                viewDept()
                break
            case 'Add Department':
                addDept()
                break


                default:
                    console.log('goodbye');
                    process.exit();
        }
    })
}

const viewEmployee = async () => {
  
 const [data] = await db.promise().query('select * from employee')
   console.table(data)

   setTimeout(start, 2000)
};

const addEmployee = async () => {

   const [roles] = await db.promise().query('SELECT * FROM roles')
    const roleChoices = roles.map(role => role.title);

    const [employees] = await db.promise().query('SELECT * FROM employee')
   const employeeChoices = employees.map(employee => `${employee.first_name} ${employee.last_name}`);
   employeeChoices.push('None');
    
    const employee = await inquirer.prompt([
     {
         type: 'input',
         name: 'first_name',
         message: 'What is the first name of this employee?'
     },
     {
        type: 'input',
        name: 'last_name',
        message: 'What is the last name of this employee?'
    },
    {
        type: 'list',
        name: 'role',
        message: "What is this employee's role?",
        choices: roleChoices
    },
    {
        // need to figure out how to add managers to equation
        type: 'list',
        name: 'manager_id',
        message: "Who is this employee's manager?",
        choices: employeeChoices
    }
 
     ])

     const role = roles.find(role => role.title === employee.role);
     employee.roles_id = role.id;
 
     // If the user did not select 'None' for the manager, find the manager's id
     if (employee.manager !== 'None') {
         const manager = employees.find(manager => `${manager.first_name} ${manager.last_name}` === employee.manager);
         employee.manager_id = manager.id;
     }
 
     // Remove the 'role' and 'manager' properties as they are not needed in the database
     delete employee.role;
     delete employee.manager;
 
     await db.promise().query('insert into employee set ?', employee)
 
     console.log('employee added to database');
     setTimeout(start, 500)
 };

const viewRoles = async () => {
   
 const [data] = await db.promise().query('select * from roles')
   console.table(data)

   setTimeout(start, 2000)
};

const viewDept = async () => {

 const [data] = await db.promise().query('select * from department')
   console.table(data)

   setTimeout(start, 2000)
};

const addDept = async () => {
   const department = await inquirer.prompt([
    {
        type: 'input',
        name: 'name',
        message: 'What is the name of the new Department?'
    }

    ])
        await db.promise().query('insert into department set ?', department)

        console.log('department added to database');
        setTimeout(start, 500)
}

start();