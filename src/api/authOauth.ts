import got from "got"
import { OAUTH_URL } from "./constants.ts";

type OAuthTokenSuccessResponse = {
    access_token: string
    expires_in: number
    token_type: string
    boundPhone: boolean
    refresh_token?: string
    scope?: string
    memberId?: string
}

type OAuthTokenErrorResponse = {
    error: string
    error_description?: string
}

type OAuthScope = string | string[]

type OAuthPasswordAuthInput = {
    username: string
    password: string
    clientId: string
    clientSecret: string
    scope: OAuthScope
    oauthBaseUrl?: string
}

export type OAuthPasswordAuthResult = {
    loginToken: string
    access_token: string
    refresh_token: string | null
    boundPhone: boolean
    expires_in: number
    token_type: string
    scope: string | null
    memberId: number | null
}

function normalizeScope(scope: OAuthScope) {
    return Array.isArray(scope) ? scope.join(" ") : scope
}

function parseOAuthError(statusCode: number, payload: OAuthTokenErrorResponse) {
    const details = payload.error_description ? `: ${payload.error_description}` : ""
    return new Error(`OAuth token request failed (${statusCode}) ${payload.error}${details}`)
}



export async function authWithOAuthPassword(input: OAuthPasswordAuthInput): Promise<OAuthPasswordAuthResult> {
    const request = await got.post(`${input.oauthBaseUrl ?? OAUTH_URL}/connect/token`, {
        username: input.clientId,
        password: input.clientSecret,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        form: {
            grant_type: "password",
            username: input.username,
            password: input.password,
            scope: normalizeScope(input.scope),
        },
        throwHttpErrors: false
    })

    const payload = JSON.parse(request.body) as OAuthTokenSuccessResponse | OAuthTokenErrorResponse
    if (request.statusCode >= 400 || "error" in payload) {
        throw parseOAuthError(request.statusCode, payload as OAuthTokenErrorResponse)
    }

    const memberId = payload.memberId ? Number(payload.memberId) : null

    return {
        loginToken: payload.access_token,
        access_token: payload.access_token,
        refresh_token: payload.refresh_token ?? null,
        boundPhone: payload.boundPhone,
        expires_in: payload.expires_in,
        token_type: payload.token_type,
        scope: payload.scope ?? null,
        memberId: Number.isNaN(payload.memberId) ? null : memberId
    }
}
