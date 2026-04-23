import got from "got";
import { API_URL } from "./constants.ts";

export type CustomWorkoutDelResponse = {
  code: number
  message: string
  data: boolean
}


export async function customWorkoutDel(
  id: number,
  headers: Record<string, string>,
) {

  return got.post(`${API_URL}/service/mobile/api/WorkOut/CustomWorkoutDel`, {
    json: {id},
    headers
  }).json<CustomWorkoutDelResponse>();
}
