export type Id = string;

export type Board = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  sections: Section[];
};

export type Section = {
  id: string;
  title: string;
  description?: string;
  order: number;
  boardId: string;
  createdAt: string;
  updatedAt: string;
  tasks: Task[] | [];
};

export type Task = {
  id: string;
  title: string;
  order: number;
  description?: string;
  sectionId: string;
  createdAt?: string;
  updatedAt?: string;
};

export type NewTask = {
  title: string;
  description?: string;
  sectionId: string;
};

export type UpdateTask = {
  id: string;
  title?: string;
  order?: number;
  description?: string;
  sectionId?: string;
};
