import axios from "axios";
import { URL } from "./constant";

export function getBoards() {
  return axios.get(`${URL}/boards`).then((res) => res.data);
}

export function getFirstBoard() {
  return axios.get(`${URL}/boards/first`).then((res) => res.data);
}
