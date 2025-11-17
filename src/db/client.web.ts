// src/db/client.web.ts
// Web için basit in-memory "db".
// Sayfa yenilenince sıfırlanır ama geliştirme için yeterli.

// --------------------------
// DEFAULT CATEGORY LIST
// --------------------------
let categories = [
  { id: "cat-market", name: "Market", type: "expense" },
  { id: "cat-yemek", name: "Yemek", type: "expense" },
  { id: "cat-maas", name: "Maaş", type: "income" },
];

// --------------------------
// BUDGETS (WEB)
// --------------------------
let budgets = [
  // örnek veri yok, kullanıcı ekleyince dolacak
  // { id: "b1", month: "2025-11", category_id: "cat-market", limit_amount: 200000 }
];

export async function listBudgets(month: string) {
  return budgets.filter((b) => b.month === month);
}

export async function setBudget(month: string, category_id: string, limit_amount: number) {
  const existing = budgets.find(
    (b) => b.month === month && b.category_id === category_id
  );

  if (existing) {
    existing.limit_amount = limit_amount;
  } else {
    budgets.push({
      id: "b-" + Math.random().toString(36).slice(2, 9),
      month,
      category_id,
      limit_amount,
    });
  }
}

// --------------------------
// TRANSACTIONS
// --------------------------
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

// --------------------------
// NO-OP SQL (WEB)
// --------------------------
async function execAsync(_sql: string) {
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

// --------------------------
// CATEGORY FUNCTIONS (WEB)
// --------------------------
export async function listCategories() {
  return categories;
}

export async function addCategory(id: string, name: string, type: string) {
  categories.push({ id, name, type });
}

export async function deleteCategory(id: string) {
  categories = categories.filter((c) => c.id !== id);
}

// --------------------------
// FINAL DB OBJECT
// --------------------------
export async function getDb() {
  return {
    // SQL-like ops
    execAsync,
    runAsync,
    getAllAsync,
    getFirstAsync,

    // category ops (WEB)
    listCategories,
    addCategory,
    deleteCategory,

    // budget ops (WEB)
    listBudgets,
    setBudget,
  };
}
