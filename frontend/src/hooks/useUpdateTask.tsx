import { useMutation } from "@tanstack/react-query";
import { update as updateTaskCall } from "../api/task";
import { Task, UpdateTask } from "../types";

function useUpdateTask() {
  return useMutation<Task, Error, UpdateTask>({
    mutationFn: updateTaskCall,
  });
}

export default useUpdateTask;
