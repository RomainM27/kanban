import axios from "axios";
import { URL } from "./constant";
import { Task, NewTask, UpdateTask } from "../types";

export function update(updateTask: UpdateTask): Promise<Task> {
  return axios
    .patch(`${URL}/tasks/${updateTask.id}`, updateTask)
    .then((res) => res.data);
}

export function create(props: { newTask: NewTask }) {
  const { newTask } = props;
  return axios.post(`${URL}/tasks`, newTask).then((res) => res.data);
}

export function remove(id: string) {
  return axios.delete(`${URL}/tasks/${id}`).then((res) => res.data);
}
