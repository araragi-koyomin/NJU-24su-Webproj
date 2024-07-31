export interface Task {
  id: string
  name: string;
  description: string;
  comments: string[];
  label: string;
}

export interface Projects {
  name: string;
  description: string;
  creationTime: string;
  status: string;
  tasks: Task[];
}

export interface IUserOptions {
  uid: number;
  username: string;
  password: string;
  projects: Projects[];
}
