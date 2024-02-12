import { useState } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import { DragEndEvent, DragOverEvent, DragStartEvent } from "@dnd-kit/core";
import { Task, Section } from "../types";
import useUpdateTask from "./useUpdateTask";

type Props = {
  initialTasks: Task[];
  initialSections: Section[];
};
function useDragAndDrop(props: Props) {
  const { initialTasks, initialSections } = props;

  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const [sectionTitleOnDragStart, setSectionTitleOnDragStart] = useState<
    string | null
  >(null);

  const updateTaskMutation = useUpdateTask();

  const onDragStart = (event: DragStartEvent) => {
    const { active } = event;
    if (!active.data.current) {
      return;
    }
    console.log("DRAG START");

    const type = active.data.current?.type;

    if (type === "Task") {
      setActiveTask(active.data.current.task);
      setSectionTitleOnDragStart(
        getSectionTitleById(active.data.current.task.sectionId)
      );
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    resetActive();
    const { active, over } = event;

    if (!over) return;

    if (!active.data.current) return;

    const id = active.id as string;

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

    // get the section id of the element being overed
    const sectionId =
      over.data.current?.task?.sectionId ?? over.data.current?.section?.id;

    const overSectionTitle = getSectionTitleById(sectionId);

    if (sectionTitleOnDragStart === "TO DO" && overSectionTitle === "DONE") {
      return; // Prevent the move
    }

    if (sectionTitleOnDragStart === "DONE" && overSectionTitle === "TO DO") {
      return; // Prevent the move
    }

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

        tasks[activeIndex].sectionId = overId as string;

        console.log("DROPPING TASK OVER SECTION", { activeIndex });
        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  };

  const resetActive = () => {
    setActiveTask(null);
  };

  function getSectionTitleById(sectionId: string): string {
    const title = initialSections.find(
      (section) => section.id === sectionId
    )?.title;

    // TODO throw error
    if (!title) return "No title found";

    return title;
  }

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
