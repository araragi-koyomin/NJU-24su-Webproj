/**
 * @description User-Service parameters
 */
export interface IUserOptions {
  uid: number;
  username: string
  password: string
  projects: Projects[]
}

export interface ILoginResult {
  success: boolean;
  message: string;
  token?: string;
}

export interface Projects {
  name: string
  description: string
  creationTime: string
  status: string
}