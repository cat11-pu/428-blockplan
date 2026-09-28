// blockplan.js：位置落在哪级槽、容量、去掉空的外层块（基线：一律给零与空）
export function routeOf(spot, directN, perBlock) {
  return [0, -1, -1];
}

export function capacityOf(directN, perBlock) {
  return 0;
}

export function pruned(table) {
  return table;
}
