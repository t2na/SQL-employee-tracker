insert into department (name)
values ("Sales"),
("Marketing"),
("Engineering"),
("Legal"),
("IT");

insert into roles (title, salary, department_id)
values ("CEO", 500000, 1),
("CMO", 400000, 2),
("CTO", 400000, 3),
("CIO", 400000, 5),
("CRO", 400000, 1),
("VP of Sales", 350000, 1),
("Head of Marketing", 350000, 2),
("VP of Engineering", 350000, 3),
("Lawyer", 350000, 4),
("Director of IT", 350000, 5);

insert into employee (first_name, last_name, roles_id, manager_id)
values 
("John", "Smith", 1, NULL),
("Sarah", "Johnson", 2, 1),
("Michael", "Martinez", 3, 1),
("Emma", "Thompson", 4, 1),
("Brian", "Anderson", 5, 1),
("Olivia", "Turner", 6, 5),
("David", "Robinson", 7, 2),
("Ava", "Garcia", 8, 3),
("Anthony", "Rodriguez", 9, 1),
("Isabella", "Williams", 10, 4);

-- just hard code the seed data for the id's