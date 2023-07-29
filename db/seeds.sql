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

insert into employee (first_name, last_name, roles_id)
values ("John", "Smith", 1),
("Sarah", "Johnson", 2),
("Michael", "Martinez", 3),
("Emma", "Thompson", 4),
("Brian", "Anderson", 5),
("Olivia", "Turner", 6),
("David", "Robinson", 7),
("Ava", "Garcia", 8),
("Anthony", "Rodriguez", 9),
("Isabella", "Williams", 10);

-- just hard code the seed data for the id's