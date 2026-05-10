export const todayUTC = (): Date => {
  const now = new Date();
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );
};

export const yesterdayUTC = (): Date => {
  const d = todayUTC();
  d.setUTCDate(d.getUTCDate() - 1);
  return d;
};
