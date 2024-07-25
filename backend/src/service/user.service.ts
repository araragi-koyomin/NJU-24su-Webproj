import { Post, Provide } from '@midwayjs/core';
import { IUserOptions } from '../interface';


@Provide()
export class UserService {

  private users: IUserOptions[] = [
    {
      uid: 1,
      username: "往目琛",
      password: "978wmcasd",
      projects: [{ name: "project1", description: "测试", creationTime: "2024/7/25", status: "未完成" }]
    }
  ];


  async getUserInfo(username: string, password: string) {
    const user = this.users.find((u) => u.username === username && u.password === password);
    if (user) {
      return { success: true, username: user.username, projects: user.projects };
    }
    return { success: false, message: 'Invalid username or password' };
  }

  @Post('/login')
  async login(username: string, password: string) {
    const user = this.users.find(u => u.password == password && u.username == username)
    if (user) {
      return { success: true, message: 'Login successful', user };
    }
    return { success: false, message: 'Login failed' };
  }
}
