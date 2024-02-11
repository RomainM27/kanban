export type Id = number;

export type Board = {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  sections: Section[];
};

export type Section = {
  id: number;
  title: string;
  description?: string;
  order: number;
  boardId: number;
  createdAt: string;
  updatedAt: string;
  tasks: Task[] | [];
};

export type Task = {
  id: number;
  title: string;
  order: number;
  description?: string;
  sectionId: number;
  createdAt?: string;
  updatedAt?: string;
};

export type NewTask = {
  title: string;
  description?: string;
  sectionId: number;
};

export type UpdateTask = {
  id: number;
  title?: string;
  order?: number;
  description?: string;
  sectionId?: number;
};
