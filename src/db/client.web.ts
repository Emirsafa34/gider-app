// src/db/client.web.ts
// Web için basit in-memory "db".
// Sayfa yenilenince sıfırlanır ama geliştirme için yeterli.

type Tx = {
  id: string;
  account_id: string;
  category_id?: string | null;
  amount: number;
  note?: string | null;
  tx_date: string;
  created_at: string;
  updated_at: string;
  category_name?: string | null;
};

let transactions: Tx[] = [];

async function execAsync(_sql: string) {
  // şimdilik şema/seed yapmıyoruz, no-op
  return;
}

async function runAsync(sql: string, params: any[] = []) {
  if (sql.startsWith("INSERT INTO transactions")) {
    const [
      id,
      account_id,
      category_id,
      amount,
      note,
      tx_date,
      created_at,
      updated_at,
    ] = params;

    transactions.unshift({
      id,
      account_id,
      category_id,
      amount,
      note,
      tx_date,
      created_at,
      updated_at,
      category_name: null,
    });
  }
}

async function getAllAsync(sql: string, params: any[] = []) {
  if (sql.includes("FROM transactions")) {
    // month filtresi varsa
    if (sql.includes("strftime('%Y-%m', t.tx_date)=?") && params[0]) {
      const month = String(params[0]);
      return transactions.filter((t) => t.tx_date.startsWith(month));
    }
    return transactions;
  }
  return [];
}

async function getFirstAsync<T extends { total: number }>(
  sql: string,
  params: any[] = []
): Promise<T | null> {
  if (
    sql.includes("FROM transactions") &&
    sql.includes("SUM") &&
    params[0]
  ) {
    const month = String(params[0]);
    const filtered = transactions.filter(
      (t) => t.amount < 0 && t.tx_date.startsWith(month)
    );
    const total = Math.abs(filtered.reduce((acc, t) => acc + t.amount, 0));
    return { total } as T;
  }
  return { total: 0 } as T;
}

// queries.ts'nin beklediği "db" interface'i
export async function getDb() {
  return {
    execAsync,
    runAsync,
    getAllAsync,
    getFirstAsync,
  };
}
