export interface Task {
  id: string
  name: string;
  description: string;
  comments: string[];
  category: string;
  attachments?: Attachment[]
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

export interface Attachment {
  filename: string,
  url: string
  uploadAt: string;
}
