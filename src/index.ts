import assert from "assert"
import { addOrEditWorkout } from "./api/addOrEditWorkout.ts";
import { authWithOAuthPassword } from "./api/authOauth.ts";
import { authWithPass } from "./api/authPass.ts";

const username = process.env.IGPSPORT_USERNAME
const password = process.env.IGPSPORT_PASSWORD
assert(username, "Missing IGPSPORT_USERNAME")
assert(password, "Missing IGPSPORT_PASSWORD")

const oauthClientId = process.env.IGPSPORT_OAUTH_CLIENT_ID
const oauthClientSecret = process.env.IGPSPORT_OAUTH_CLIENT_SECRET
const oauthScope = process.env.IGPSPORT_OAUTH_SCOPE ?? "openid offline_access mobile.api user.api device.api activity.api IdentityServerApi"

const { loginToken } = oauthClientId && oauthClientSecret
    ? await authWithOAuthPassword({
        username,
        password,
        clientId: oauthClientId,
        clientSecret: oauthClientSecret,
        scope: oauthScope
    })
    : await authWithPass(username, password)

assert(loginToken)

const res = await addOrEditWorkout({
    // memberId: 123456,
    data: {
        // "id": "0",
        "title": "1h FTP 100% 2",
        "description": "60 min at FTP",
        "totalTime": 3600,
        "workoutType": "bike",
        "sportBigType": 1,
        "structure": [
            {
                "intensityClass": "Active",
                "name": "FTP steady",
                "length": {
                    "unit": "Second",
                    "value": 3600
                },
                "type": "Step",
                "intensityTarget": {
                    "unit": "PercentOfFTP",
                    "minValue": 100,
                    "maxValue": 100
                },
                "cadenceTarget": {
                    unit: "Cadence",
                    maxValue: 100,
                    minValue: 100
                },
                // "steps": null,
                // "openDuration": null
            },
            {
                type: "Repetition",
                length: {
                    unit: "Repetition",
                    value: 2,
                },
                steps: [
                    {
                        "intensityClass": "Active",
                        "name": "Активных",
                        "note": "",
                        "length": {
                            "unit": "Second",
                            "value": 1200
                        },
                        "type": "Step",
                        "intensityTarget": {
                            "unit": "HeartRate",
                            "value": 3
                        }
                    },
                    {
                        "intensityClass": "Rest",
                        "name": "Остальные",
                        "note": "",
                        "type": "Step",
                        "openDuration": "true"
                    },
                    {
                        type: "Repetition",
                        length: {
                            unit: "Repetition",
                            value: 3,
                        },
                        steps: [
                            {
                                "intensityClass": "Active",
                                "name": "Активных",
                                "note": "",
                                "length": {
                                    "unit": "Second",
                                    "value": 1200
                                },
                                "type": "Step",
                                "intensityTarget": {
                                    "unit": "HeartRate",
                                    "value": 3
                                }
                            },
                            {
                                "intensityClass": "Rest",
                                "name": "Остальные",
                                "note": "",
                                "type": "Step",
                                "openDuration": "true"
                            }
                        ]
                    }


                ]
            }
        ],
        "allowDeletion": true,
        "tips": "Cool",
        // "iconPath": null
    }
}, { Authorization: `Bearer ${loginToken}` })

console.log(res)
