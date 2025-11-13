export type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };
export type AppError<ErrorName extends string, Extra = {}> = Error & Extra & { name: ErrorName };
export const ok = <T>(value: T): Result<T, never> => ({ ok: true, value });
export const err = <E>(error: E): Result<never, E> => ({ ok: false, error });

export function defineError<ErrorName extends string, Extra extends object = {}>(
    name: ErrorName,
    messageTemplate: (extra: Extra) => string
) {
    class CustomError extends Error {
        constructor(extra: Extra) {
            super(messageTemplate(extra));
            Object.setPrototypeOf(this, new.target.prototype);
            this.name = name;
            Object.assign(this, extra);
        }
    }

    return CustomError as unknown as {
        new (extra: Extra): AppError<ErrorName, Extra>;
    };
}

/**
import { Result, ok, err, defineError } from "./errors";

export const NegativeIndexError = defineError(
    "NegativeIndexError",
    ({ index }: { index: number }) => `Index must be non-negative, got ${index}`
);
export type GetItemsError = InstanceType<typeof NegativeIndexError> | Error;

function getItem(xs: unknown[], index: number): Result<unknown, GetItemsError> {
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
 */
