import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { Section, Task } from "../../types";
import { useMemo } from "react";
import TaskCard from "./TaskCard";
import PlusIcon from "../../assets/icons/PlusIcon";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface Props {
  section: Section;
  createTask: (sectionId: number) => void;
  handleUpdateTask: (task: Task) => void;
  deleteTask: (id: number) => void;
  tasks: Task[];
}

function ColumnContainer({
  section,
  createTask,
  tasks,
  deleteTask,
  handleUpdateTask,
}: Props) {
  const tasksIds = useMemo(() => {
    return tasks.map((task) => task?.id);
  }, [tasks]);

  const { setNodeRef } = useSortable({
    id: section.id,
    data: {
      type: "Section",
      section,
    },
  });

  return (
    <>
      <Card
        ref={setNodeRef}
        className="w-[300px] bg-slate-100 dark:bg-slate-900 h-full overflow-hidden "
      >
        <CardHeader className="py-4 px-4">
          <CardTitle>{section.title}</CardTitle>
        </CardHeader>

        <CardContent className="py-2 pr-2 pl-4">
          <SortableContext items={tasksIds}>
            {/* // TODO change the height to be dynamic */}
            <ScrollArea className="color-slate-500">
              <div className="pr-4 max-h-[500px]">
                {tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    deleteTask={deleteTask}
                    handleUpdateTask={handleUpdateTask}
                  />
                ))}
              </div>
              <ScrollBar thumbClassName="bg-slate-300 dark:bg-slate-600" />
            </ScrollArea>
          </SortableContext>
        </CardContent>

        <CardFooter className="p-2 justify-start">
          <Button
            variant="ghost"
            className="pl-2 w-full justify-start"
            onClick={() => {
              createTask(section.id);
            }}
          >
            <PlusIcon />
            <span className="pl-4"> Add task</span>
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}

export default ColumnContainer;
