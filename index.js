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
            case 'View All Roles':
                viewRoles()
                break
            case 'View All Departments':
                viewDept()
                break
            case 'Create Department':
                createDept()
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

const createEmployee = async () => {
    const department = await inquirer.prompt([
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
        type: 'input',
        name: 'roles_id',
        message: "What is this employee's role?"
    },
    {
        type: 'input',
        name: 'manager_id',
        message: "Who is this employee's manager?"
    }
 
     ])
         await db.promise().query('insert into department set ?', department)
 
         console.log('department added to database');
         setTimeout(start, 500)
 }

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

const createDept = async () => {
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