export function getMonthlySubscriptionCost(subscriptions) {
  return subscriptions.filter((s) => s.isActive).reduce((sum, s) => {
    if (s.recurrence === 'weekly') return sum + s.amount * (52 / 12);
    if (s.recurrence === 'yearly') return sum + s.amount / 12;
    return sum + s.amount;
  }, 0);
}

const isConfirmed = (t) => !t.status || t.status === 'confirmed';

export function getCurrentBalance(startingBalance, transactions) {
  return transactions.filter(isConfirmed).reduce(
    (bal, t) => bal + (t.type === 'income' ? t.amount : -t.amount),
    startingBalance ?? 0
  );
}

// Returns average monthly income and expenses based on span of transaction data
export function getMonthlyAverages(transactions) {
  transactions = transactions.filter(isConfirmed);
  if (!transactions.length) return { income: 0, expenses: 0 };

  const dates = transactions.map((t) => new Date(t.date)).sort((a, b) => a - b);
  const spanMs = dates[dates.length - 1] - dates[0];
  const spanMonths = Math.max(1, spanMs / (1000 * 60 * 60 * 24 * 30.44));

  const totalIncome = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpenses = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  return {
    income: totalIncome / spanMonths,
    expenses: totalExpenses / spanMonths,
  };
}

// Months of runway remaining given current balance and monthly burn
export function getRunway(currentBalance, monthlyExpenses, monthlySubscriptions) {
  const monthlyBurn = monthlyExpenses + monthlySubscriptions;
  if (monthlyBurn <= 0) return Infinity;
  if (currentBalance <= 0) return 0;
  return currentBalance / monthlyBurn;
}

// Projected balance N months from now
export function getProjectedBalance(currentBalance, monthlyNet) {
  return (n) => currentBalance + monthlyNet * n;
}
