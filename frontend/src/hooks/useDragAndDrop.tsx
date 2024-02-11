import { useState } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import { DragEndEvent, DragOverEvent, DragStartEvent } from "@dnd-kit/core";
import { Task } from "../types";
import useUpdateTask from "./useUpdateTask";

type Props = {
  initialTasks: Task[];
};
function useDragAndDrop(props: Props) {
  const { initialTasks } = props;

  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const updateTaskMutation = useUpdateTask();

  const onDragStart = (event: DragStartEvent) => {
    const { active } = event;
    if (!active.data.current) {
      return;
    }

    const type = active.data.current?.type;

    if (type === "Task") {
      setActiveTask(active.data.current.task);
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    resetActive();
    const { active, over } = event;

    if (!over) return;

    if (!active.data.current) return;

    const id = Number(active.id);

    console.log("DRAG END");
    updateTaskMutation.mutate({
      id,
      sectionId: active.data.current.task.sectionId,
      order: active.data.current.sortable.index + 1,
    });
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveATask) return;

    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t?.id === activeId);
        const overIndex = tasks.findIndex((t) => t?.id === overId);

        if (tasks[activeIndex]?.sectionId != tasks[overIndex].sectionId) {
          tasks[activeIndex].sectionId = tasks[overIndex].sectionId;
          return arrayMove(tasks, activeIndex, overIndex - 1);
        }
        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverASection = over.data.current?.type === "Section";

    if (isActiveATask && isOverASection) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t?.id === activeId);

        tasks[activeIndex].sectionId = Number(overId);

        console.log("DROPPING TASK OVER SECTION", { activeIndex });
        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  };

  const resetActive = () => {
    setActiveTask(null);
  };

  return {
    tasks,
    activeTask,
    onDragStart,
    onDragEnd,
    onDragOver,
    setTasks,
  };
}

export default useDragAndDrop;
