// Tiny linear scale helper, like a stripped-down d3-scale.
export function makeLinearScale(domainMin, domainMax, rangeMin, rangeMax) {
  const dSpan = domainMax - domainMin || 1;
  const rSpan = rangeMax - rangeMin;
  return (v) => rangeMin + ((v - domainMin) / dSpan) * rSpan;
}

export function extent(values) {
  let min = Infinity;
  let max = -Infinity;
  for (const v of values) {
    if (v == null || Number.isNaN(v)) continue;
    if (v < min) min = v;
    if (v > max) max = v;
  }
  if (!Number.isFinite(min)) return [0, 1];
  return [min, max];
}
