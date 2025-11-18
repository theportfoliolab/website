// src/tutorials/index.ts
// Import TSX tutorial components dynamically from this folder.
// Each file should default-export a React component, e.g. `export default function ...`
export const tutorials = import.meta.glob("./*.tsx", { import: "default" }) as Record<
    string,
    () => Promise<React.ComponentType<any>>
>