import got from "got";
import { API_URL } from "./constants.ts";


export type WorkoutStructure = {
  type: "Step" | "Repetition"
  intensityClass?: "WarmUp" | "Active" | "CoolDown" | "Rest"
  name?: string
  note?: string
  // omit if open duration
  length?: {
    unit: "Second" | "Meter" | "Kcal" | "Repetition"
    value: number
  }
  intensityTarget?: {
      /**
       * Active — no objective target
       * Speed — by speed, min/val in m/s kmh/0.0036
       * Power — zone of power 1-7
       * PowerCustom — min/val watts
       * PercentOfFtp — min/val percent
       * HeartRate — zone of hr 1-5
       * HeartRateCustom — min/val of HR
       * */
      unit: "Speed" | "PercentOfFTP" | "PowerCustom" | "HeartRateCustom" | "Power" | "HeartRate" | "Active" | "Cadence"
      value?: number
      minValue?: number
      maxValue?: number
  }
  cadenceTarget?: {
      unit: "Cadence"
      value?: number
      minValue?: number
      maxValue?: number
  }
  // no steps if already inside steps
  steps?: WorkoutStructure[]
  // till lap button is pressed, omit length if open duration
  openDuration?: "true" | "false"
}

export type AddOrEditWorkoutBody = {
  /* omitting does not lead to an error */
  memberId?: number
  data: {
    /* pass existing id to update workout */
    id?: string

    title: string
    description: string
    totalTime: number
    workoutType: "bike" | "run"
    sportBigType: 1 | 2

    createTimestamp?: number
    img?: string
    workoutDay?: string
    allowDeletion?: boolean
    tips?: string
    iconPath?: string

    structure: WorkoutStructure[]
  }
}

export type AddOrEditWorkoutResponse = {
  code: number
  message: string
  data: { workoutId: number } | null
};

export async function addOrEditWorkout(body: AddOrEditWorkoutBody, headers: Record<string, string>) {
  return got.post(`${API_URL}/service/mobile/api/WorkOut/EditCustomWorkOut`, { json: body, headers }).json<AddOrEditWorkoutResponse>();
}
