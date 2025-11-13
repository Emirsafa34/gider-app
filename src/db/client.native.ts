// src/db/client.ts
import * as SQLite from "expo-sqlite";
import { SCHEMA_SQL } from "./schema";

let db: SQLite.SQLiteDatabase | null = null;

export async function getDb() {
  if (db) return db;

  // tek db instance
  db = await SQLite.openDatabaseAsync("gider.sqlite");

  await db.execAsync("PRAGMA journal_mode = WAL;");
  await migrate(db);
  await seed(db);

  return db;
}

async function migrate(db: SQLite.SQLiteDatabase) {
  const statements = SCHEMA_SQL.split(";")
    .map((s) => s.trim())
    .filter(Boolean);

  for (const st of statements) {
    await db.execAsync(st + ";");
  }
}

async function seed(db: SQLite.SQLiteDatabase) {
  // varsayılan hesap
  await db.execAsync(`
    INSERT OR IGNORE INTO accounts (id, name, currency, initial_balance)
    VALUES ('acc-default', 'Nakit', 'TRY', 0);
  `);

  // birkaç kategori
  await db.execAsync(`
    INSERT OR IGNORE INTO categories (id, name, type, icon)
    VALUES 
      ('cat-market', 'Market', 'expense', 'cart'),
      ('cat-yemek', 'Yemek', 'expense', 'utensils'),
      ('cat-maas', 'Maaş', 'income', 'wallet');
  `);
}
