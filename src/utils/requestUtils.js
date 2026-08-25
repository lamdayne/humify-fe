export function cleanParams(params) {
    return Object.fromEntries(
        Object.entries(params).filter(
            ([, value]) =>
                value !== null &&
                value !== undefined &&
                value !== ""
        )
    );
}