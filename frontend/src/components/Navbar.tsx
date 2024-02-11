import { ModeToggle } from "@/components/mode-toggle";

function Navbar() {
  return (
    <div className="flex h-16 items-center border-b px-2.5 md:px-20 bg-slate-100 dark:bg-slate-900">
      <span className="text-2xl font-bold">Kanban Board</span>
      <div className="ml-auto flex items-center space-x-4">
        {" "}
        <ModeToggle />
      </div>
    </div>
  );
}

export default Navbar;
