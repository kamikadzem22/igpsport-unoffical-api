import { BASE_URL } from "./constants.ts"
import got from "got"
import { getCookiesFromResponse } from "../utils.ts";

type AuthResponse = {
    Code: 0 | 403 | (number & {}),
    Message: string,
    Data: string | null
}


export async function authWithPass(username: string, password: string) {
    const request = await got.post(`${BASE_URL}/Auth/Login`, {
        json: {
            username,
            password
        }
    })
    const json = JSON.parse(request.body) as unknown as AuthResponse

    const cookies = getCookiesFromResponse<{
        loginTicket?: string
        loginToken?: string
    }>(request.headers["set-cookie"])

    return {
        loginToken: cookies.loginToken ?? null,
        Code: json.Code,
        Message: json.Message,
        Data: json.Data
    }
}
