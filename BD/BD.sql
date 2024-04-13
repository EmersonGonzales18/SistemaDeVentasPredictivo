CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE,
  first_name TEXT,
  last_name TEXT,
  age INTEGER,
  gender BOOLEAN,
  password TEXT,
  photo TEXT,
  address TEXT,
  role INTEGER
);


INSERT INTO users (name,first_name,last_name,age,gender, password,photo, address,role) VALUES
  ('User1@gmail.com','Nombre1','Apellido1',1,1, '123','user.jpg','add1', 1),
  ('adler.20093@gmail.com','Nombre2','Apellido2',1,1, '123','user.jpg','add2', 2),
  ('User3@gmail.com','Nombre3','Apellido3',1,1, '123','user.jpg','add3', 1);

CREATE TABLE sales (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date DATE,
  total REAL,
  user_id INTEGER,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  price REAL,
  stock INTEGER,
  sales INTEGER DEFAULT 0,
  total REAL DEFAULT 0
);

INSERT INTO products (name, price, stock) VALUES
  ('Product1', 10, 9),
  ('Product2', 20, 200),
  ('Product3', 30, 150);

CREATE TABLE sales_details (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sale_id INTEGER,
  product_id INTEGER,
  quantity INTEGER,
  FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);




/*
-- Crear trigger para verificar el stock al insertar en sales_details
CREATE TRIGGER check_stock_insert
AFTER INSERT ON sales_details
FOR EACH ROW
BEGIN
  -- Verificar si hay suficiente stock
  SELECT CASE
    WHEN NEW.quantity <= (SELECT stock FROM products WHERE id = NEW.product_id) THEN
      -- Stock suficiente, no se hace nada
      NULL
    ELSE
      -- Stock insuficiente, lanzar un error
      RAISE(ABORT, 'Insufficient stock')
  END;
END;
*/

-- Crear trigger para actualizar el stock al insertar en sales_details
CREATE TRIGGER update_stock_insert
AFTER INSERT ON sales_details
FOR EACH ROW
BEGIN
  -- Actualizar el stock restando la cantidad vendida
  UPDATE products
  SET stock = stock - NEW.quantity ,sales = sales + NEW.quantity , total =total+price* NEW.quantity
  WHERE id = NEW.product_id;
END;


INSERT INTO sales (date, total, user_id) VALUES
  ('2023-07-01', 10.0, 1);

INSERT INTO sales_details (sale_id, product_id, quantity) VALUES
  (1, 1, 1);


CREATE TABLE alert(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  icon INTEGER DEFAULT 1,
  user_id INTEGER,
  title TEXT,
  descripcion TEXT ,
  date DATE DEFAULT "12/12/12",
  FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);


CREATE TABLE alert_user(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  alert_id INTEGER,
  ok BOOLEAN DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
  FOREIGN KEY (alert_id) REFERENCES alert(id) ON DELETE CASCADE
);


CREATE TRIGGER generate_alert_user
AFTER INSERT ON alert
FOR EACH ROW
BEGIN
  INSERT INTO alert_user (user_id, alert_id)
  SELECT id, NEW.id
  FROM users
  WHERE role = 2;
END;


UPDATE alert_user SET ok=1 WHERE id=1;

CREATE TRIGGER check_stock_update
AFTER UPDATE ON products
FOR EACH ROW
WHEN NEW.stock < 20
BEGIN
  -- Insertar una nueva alerta para el usuario con id=1
  INSERT INTO alert (user_id, title, descripcion, date)
  VALUES (1, 'Stock bajo', 'El producto ' || NEW.name || ' tiene un stock bajo (' || NEW.stock || ' unidades)', datetime('now'));
END;

