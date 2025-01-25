import sqlite3 from 'better-sqlite3';
import { join } from 'path';

const db = new sqlite3('stockmanager.db');

// Création des tables
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    barcode TEXT UNIQUE,
    category TEXT NOT NULL,
    quantity INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    parent_id INTEGER,
    FOREIGN KEY (parent_id) REFERENCES categories (id)
  );
`);

// Insertion des catégories de base
const defaultCategories = [
  { name: 'Alimentaire' },
  { name: 'Ménager' },
  { name: 'Hygiène' },
];

for (const category of defaultCategories) {
  db.prepare('INSERT OR IGNORE INTO categories (name) VALUES (?)').run(category.name);
}

export default db;
