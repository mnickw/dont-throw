# Usage
Return defined error instead of throwing/catching. Npm package? Bro, it's a 22-lines file, just copy it.

```ts
import { Result, ok, err, defineError } from "./errors";

export const NegativeIndexError = defineError(
    "NegativeIndexError",
    ({ index }: { index: number }) => `Index must be non-negative, got ${index}`
);
export type GetItemsError = InstanceType<typeof NegativeIndexError> | ... other errors;

function getItem(xs: number[], index: number): Result<number, GetItemsError> {
    if (index < 0) {
        return err(new NegativeIndexError({ index }));
    }

    return ok(xs[index]);
}

const result = getItem([1, 2, 3], -1);

if (!result.ok) {
    if (result.error instanceof NegativeIndexError) {
        // fully typed:
        console.log(result.error.index); // number
        console.log(result.error.message);
    }
}
```
