
export const StationMap: Record<string, number> = {
  "Bern": 1,
  "Zurich": 2,
  "Lausanne": 3,
  "Geneva": 4,
  "Basel": 5,
};

export const ProductTypeMap: Record<string, number> = {
  "single": 1,
  "day-pass": 2,
  "supersaver": 3,
};

export const ClassMap: Record<string, number> = {
  "1": 1,
  "2": 2,
};

export function stationToField(name: string): bigint {
  if (!(name in StationMap)) {
    throw new Error(`Unknown station: ${name}`);
  }
  return BigInt(StationMap[name]);
}

export function dateToField(dateStr: string): bigint {
  // e.g. convert "2025-01-12" → unix timestamp day
  return BigInt(Math.floor(new Date(dateStr).getTime() / 1000));
}

