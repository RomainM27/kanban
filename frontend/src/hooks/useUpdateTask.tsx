import { useMutation } from "@tanstack/react-query";
import { update as updateTaskCall } from "../api/task"; // Adjust the import path as needed
import { Task, UpdateTask } from "../types"; // Adjust the import path as needed

function useUpdateTask() {
  return useMutation<Task, Error, UpdateTask>({
    mutationFn: updateTaskCall,
  });
}

export default useUpdateTask;
