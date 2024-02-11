import TrashIcon from "@assets/icons/TrashIcon";
import { Task } from "../../types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button/button";
import { cn } from "@/lib/utils";

interface Props {
  task: Task;
  deleteTask: (id: number) => void;
  handleUpdateTask: (task: Task) => void;
}

function TaskCard({ task, deleteTask, handleUpdateTask }: Props) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="
          opacity-30
          p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl border-2 border-green-500  cursor-grab relative
        "
      />
    );
  }

  const handleClick = () => {
    handleUpdateTask(task);
  };

  return (
    <>
      <Card
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={cn(
          "drop-shadow-md  bg-slate-200 dark:bg-slate-700 p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-green-500 cursor-grab relative task my-4"
        )}
      >
        {/* // TODO not realy good, must change this */}
        <span
          onClick={handleClick}
          className="my-auto h-[90%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap"
        >
          {task.title}
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            deleteTask(task.id);
          }}
          className="opacity-60 hover:opacity-100"
        >
          <TrashIcon />
        </Button>
      </Card>
    </>
  );
}

export default TaskCard;
