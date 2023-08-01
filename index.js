const inquirer = require('inquirer');
const fs = require('fs');
const db = require('./config/connection');

const start = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'startMenu',
            message: 'What would you like to do?',
            choices: ['View Employees', 'Add Employee', 'Update Employee', 'View Roles', 'Add Role', 'View Departments', 'Add Department', 'Exit']
        },
    ]).then(answers => {
      
        switch(answers.startMenu) {
            case 'View Employees':
                viewEmployee()
                break
            case 'Add Employee':
                addEmployee()
                break
            case 'Update Employee':
                updateEmployee()
                break
            case 'View Roles':
                viewRoles()
                break
            case 'Add Role':
                addRole()
                break
            case 'View Departments':
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
  
 const [data] = await db.promise().query("select employee.id, employee.first_name, employee.last_name, roles.title, department.name as department, roles.salary, concat(manager.first_name, ' ', manager.last_name) as manager from employee left join roles on employee.roles_id = roles.id left join department on roles.department_id = department.id left join employee manager on manager.id = employee.manager_id")
   console.table(data)

   setTimeout(start, 2000)
};

const addEmployee = async () => {

   const [roles] = await db.promise().query('SELECT * FROM roles')
    const roleChoices = roles.map(role => ({name: role.title, value: role.id}));

    const [employees] = await db.promise().query('SELECT * FROM employee')
   const employeeChoices = employees.map(employee => ({name: `${employee.first_name} ${employee.last_name}`, value: employee.id}));
   employeeChoices.push({name:'None', value: null});
    
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
        name: 'roles_id',
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

    //  const role = roles.find(role => role.title === employee.role);
    //  employee.roles_id = role.id;
 
     // If the user did not select 'None' for the manager, find the manager's id
    //  if (employee.manager !== 'None') {
    //      const manager = employees.find(manager => `${manager.first_name} ${manager.last_name}` === employee.manager);
    //      employee.manager_id = manager.id;
    //  }
 
     // Remove the 'role' and 'manager' properties as they are not needed in the database
    //  delete employee.role;
    //  delete employee.manager;
 
     await db.promise().query('insert into employee set ?', employee)
 
     console.log('employee added to database');
     setTimeout(start, 500)
 };

 const updateEmployee = async () => {
    const [employees] = await db.promise().query('SELECT * FROM employee');
    const employeeChoices = employees.map(employee => ({name: `${employee.first_name} ${employee.last_name}`, value: employee.id}));

    const selectedEmployee = await inquirer.prompt([
        {
            type: 'list',
            name: 'employee_id',
            message: 'Which employee would you like to update?',
            choices: employeeChoices
        }
    ]);

    const propertiesToUpdate = ['First Name', 'Last Name', 'Role', 'Manager'];
    for (let property of propertiesToUpdate) {
        const updateProperty = await inquirer.prompt({
            type: 'confirm',
            name: 'update',
            message: `Do you want to change their ${property}?`,
        });

        if (updateProperty.update) {
            let new_value;
            switch (property) {
                case 'First Name':
                case 'Last Name':
                    new_value = await inquirer.prompt({
                        type: 'input',
                        name: property.toLowerCase().replace(' ', '_'),
                        message: `What is the new ${property.toLowerCase()}?`,
                    });
                    break;
                case 'Role':
                    const [roles] = await db.promise().query('SELECT * FROM roles')
                    const roleChoices = roles.map(role => ({name: role.title, value: role.id}));
                    new_value = await inquirer.prompt({
                        type: 'list',
                        name: 'roles_id',
                        message: `What is the new ${property.toLowerCase()}?`,
                        choices: roleChoices
                    });
                    break;
                case 'Manager':
                    new_value = await inquirer.prompt({
                        type: 'list',
                        name: 'manager_id',
                        message: `Who is the new ${property.toLowerCase()}?`,
                        choices: employeeChoices
                    });
                    break;
            }
            // replace spaces in property name to match column name in DB
            let property_db = property.toLowerCase().replace(' ', '_');
            if (property_db === 'role') {
                property_db = 'roles_id';
            } else if (property_db === 'manager') {
                property_db = 'manager_id';
            }
            await db.promise().query(`UPDATE employee SET ${property_db} = ? WHERE id = ?`, [new_value[property_db], selectedEmployee.employee_id]);
            console.log(`Employee's ${property} has been updated.`);
        }
    }

    setTimeout(start, 500);
}



const viewRoles = async () => {
   
 const [data] = await db.promise().query('select roles.id, roles.title, roles.salary, department.name as department from roles left join department on roles.department_id = department.id')
   console.table(data);

   setTimeout(start, 2000)
};

const addRole = async () => {

    const [departments] = await db.promise().query('SELECT * FROM department')
    const deptChoices = departments.map(department => ({name: department.name, value: department.id}));

    const role = await inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'What is the title of the new role?'
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is the salary of the new role?',
            validate: function(value) {
            var valid = !isNaN(parseFloat(value));
            return valid || 'Please enter a number';
            },
            filter: Number
        },
        {
            type: 'list',
            name: 'department_id',
            message: 'Which department does this role belong to?',
            choices: deptChoices
        }
    ])
        await db.promise().query('insert into roles set ?', role)

        console.log('role added to database');
        setTimeout(start, 500)
}

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
