import { Button } from "@/components/ui/button/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Task, UpdateTask } from "../../types";
import { ChangeEvent, useState } from "react";
import { EditIcon } from "lucide-react";

type EditTaskModalProps = {
  task: Task;
  updateTask: (updateTask: UpdateTask) => void;
  isOpen: boolean;
  onClose: () => void;
};
function EditTaskModal(props: EditTaskModalProps) {
  const { task, updateTask, isOpen, onClose } = props;

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setTitle(e.target.value);
  const handleDescriptionChange = (e: ChangeEvent<HTMLInputElement>) =>
    setDescription(e.target.value);

  const handleSave = () => {
    updateTask({ id: task.id, title, description });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            <span className="flex items-end gap-2">
              <EditIcon />
              Edit Task
            </span>
          </DialogTitle>
          <DialogDescription>Make changes to your task</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              defaultValue={title}
              onChange={handleTitleChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Descripton
            </Label>
            <Input
              id="description"
              defaultValue={description}
              onChange={handleDescriptionChange}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSave}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default EditTaskModal;
