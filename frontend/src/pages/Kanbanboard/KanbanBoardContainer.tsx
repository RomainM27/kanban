import { useMemo, useState } from "react";
import { Board, Task, UpdateTask } from "../../types";
import ColumnContainer from "./ColumnContainer";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";
import useDragAndDrop from "@hooks/useDragAndDrop";
import { useMutation } from "@tanstack/react-query";
import {
  create as createTaskCall,
  remove as deleteTaskCall,
} from "../../api/task";
import EditTaskModal from "./EditTaskModal";
import useUpdateTask from "@hooks/useUpdateTask";

type Props = {
  boardData: Board;
};

function KanbanBoardContainer(props: Props) {
  const { boardData } = props;

  const defaultTasks = useMemo(() => {
    return boardData.sections.map((section) => section.tasks).flat();
  }, [boardData]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTaskToEdit, setCurrentTaskToEdit] = useState<Task | null>(null);
  const updateTaskMutation = useUpdateTask();

  const handleUpdateTask = (task: Task) => {
    setCurrentTaskToEdit(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentTaskToEdit(null);
  };

  // Create task
  const createTaskMutation = useMutation({
    mutationFn: createTaskCall,
    onSuccess: (data) => {
      setTasks([...tasks, data]);
    },
  });

  const createTask = (sectionId: number) => {
    const newTask = {
      title: `Task ${tasks.length + 1}`,
      sectionId,
    };
    createTaskMutation.mutate({
      newTask,
    });
  };

  // Delete task
  const deleteTaskMutation = useMutation({
    mutationFn: deleteTaskCall,
    onSuccess: (data) => {
      const newTasks = tasks.filter((task) => task.id !== data.id);
      setTasks(newTasks);
      // queryClient.invalidateQueries(["tasks"]);
    },
  });

  const deleteTask = (id: number) => {
    deleteTaskMutation.mutate(id);
  };

  // update task
  const updateTask = (updateTask: UpdateTask) => {
    updateTaskMutation.mutate(updateTask, {
      onSuccess: (data) => {
        setTasks((currentTasks) =>
          currentTasks.map((task) =>
            task.id === data.id ? { ...task, ...data } : task
          )
        );
      },
    });
  };

  const { tasks, activeTask, onDragStart, onDragEnd, onDragOver, setTasks } =
    useDragAndDrop({
      initialTasks: defaultTasks,
    });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  return (
    <>
      <div className="flex items-start justify-center gap-4 max-h-full relative">
        <DndContext
          sensors={sensors}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragOver={onDragOver}
        >
          {boardData.sections.map((col) => (
            <ColumnContainer
              key={col.id}
              section={col}
              createTask={createTask}
              deleteTask={deleteTask}
              handleUpdateTask={handleUpdateTask}
              tasks={tasks.filter((task) => task?.sectionId === col.id)}
            />
          ))}

          {createPortal(
            <DragOverlay>
              {activeTask && (
                <TaskCard
                  task={activeTask}
                  deleteTask={deleteTask}
                  handleUpdateTask={handleUpdateTask}
                />
              )}
            </DragOverlay>,
            document.body
          )}
        </DndContext>
      </div>
      {isModalOpen && currentTaskToEdit && (
        <EditTaskModal
          task={currentTaskToEdit}
          updateTask={updateTask}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      )}
    </>
  );
}

export default KanbanBoardContainer;
