import axios from "axios";
import { URL } from "./constante";

export function getBoards() {
  return axios.get(`${URL}/boards`).then((res) => res.data);
}

export function getBoard(id: number) {
  return axios.get(`${URL}/boards/${id}`).then((res) => res.data);
}
