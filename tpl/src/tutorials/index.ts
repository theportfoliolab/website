// src/tutorials/index.ts
export const tutorials = import.meta.glob("./*.md", { as: "raw" }) as Record<
    string,
    () => Promise<string>
>