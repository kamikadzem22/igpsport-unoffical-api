export function getCookiesFromResponse<T>(setCookieHeader: string | string[] | undefined) {
    const setCookies = typeof setCookieHeader === "string" ? [setCookieHeader] : setCookieHeader ?? []

    return Object.fromEntries(
        setCookies
            .map(c => c.split(";")[0]?.split("=") ?? [])
    ) as T
}
