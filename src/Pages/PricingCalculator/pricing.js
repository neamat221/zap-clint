export const calcParcelCost = ({ type, weight }) => {
  const w = Math.max(0, Number(weight) || 0);
  if (type === "document") {
    return { within: 60, outside: 80 };
  }
  const extraKg = w > 3 ? w - 3 : 0;
  return {
    within: 110 + extraKg * 40,
    outside: 150 + extraKg * 40 + (extraKg > 0 ? 40 : 0),
  };
};

export const priceBreakdown = ({ type, weight }) => {
  const w = Math.max(0, Number(weight) || 0);
  if (type === "document") {
    return {
      base: "৳60 (Within City) / ৳80 (Outside City)",
      note: "Flat rate for any weight.",
    };
  }
  if (w <= 3) {
    return {
      base: "৳110 (Within City) / ৳150 (Outside City)",
      note: "Flat rate up to 3kg.",
    };
  }
  const extra = w - 3;
  return {
    base: `৳110 + ${extra} × ৳40`,
    note: `Plus ৳40 extra for outside district delivery (${extra}kg over 3kg).`,
  };
};