CREATE TABLE daily_miscale (
    id INTEGER,
    name TEXT,
    timestamp TEXT,
    date TEXT,
    weight REAL,
    impedance REAL,
    fat REAL,
    visceral REAL,
    water REAL,
    muscle REAL,
    bmi REAL,
    protein REAL,
    lbm REAL,
    poi REAL,
    PRIMARY KEY (id, date)
);
