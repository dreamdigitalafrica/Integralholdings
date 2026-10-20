// Responsive variants exist only for this batch of supplied photographs.
export function imageSources(src, sizes = "100vw") {
  if (!/-1600\.webp$/.test(src)) return {};
  return {
    srcSet: `${src.replace("-1600.webp", "-800.webp")} 800w, ${src} 1600w`,
    sizes,
    decoding: "async",
  };
}
