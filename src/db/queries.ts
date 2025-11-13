// src/db/queries.ts
import { getDb } from "./client";

export async function listTransactions(month?: string) {
  const db = await getDb();

  if (month) {
    return db.getAllAsync(
      `SELECT t.*, c.name as category_name 
       FROM transactions t
       LEFT JOIN categories c ON c.id = t.category_id
       WHERE strftime('%Y-%m', t.tx_date)=?
       ORDER BY t.tx_date DESC, t.created_at DESC;`,
      [month]
    );
  }

  return db.getAllAsync(
    `SELECT t.*, c.name as category_name 
     FROM transactions t
     LEFT JOIN categories c ON c.id = t.category_id
     ORDER BY t.tx_date DESC, t.created_at DESC;`
  );
}

export type NewTransactionInput = {
  id: string;
  account_id: string;
  category_id?: string;
  amount: number;
  note?: string | null;
  tx_date: string;
  created_at: string;
  updated_at: string;
};

export async function addTransaction(input: NewTransactionInput) {
  const db = await getDb();

  await db.runAsync(
    `INSERT INTO transactions 
      (id, account_id, category_id, amount, note, tx_date, created_at, updated_at)
     VALUES (?,?,?,?,?,?,?,?);`,
    [
      input.id,
      input.account_id,
      input.category_id ?? null,
      input.amount,
      input.note ?? null,
      input.tx_date,
      input.created_at,
      input.updated_at,
    ]
  );
}

// ÖNCEKİ API'yi bozmayalım: sadece gider (pozitif) döner
export async function monthExpenseTotal(month: string) {
  const summary = await monthSummary(month);
  return summary.expense;
}

// --- YENİ KISIM: gelir / gider / net ---

export type MonthSummary = {
  income: number;  // toplam gelir (kuruş, +)
  expense: number; // toplam gider (kuruş, +)
  net: number;     // income - expense (kuruş, + veya -)
};

export async function monthSummary(month: string): Promise<MonthSummary> {
  const rows: any[] = await listTransactions(month);

  let income = 0;
  let expense = 0;

  for (const r of rows) {
    const amount = Number(r.amount) || 0;

    if (amount > 0) {
      // gelir
      income += amount;
    } else if (amount < 0) {
      // giderler veritabanında negatif tutuluyor
      expense += Math.abs(amount);
    }
  }

  const net = income - expense;

  return { income, expense, net };
}
