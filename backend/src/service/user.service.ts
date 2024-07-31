import { Post, Provide, Inject } from '@midwayjs/core';
// import { IUserOptions } from '../interface';
import { DataService } from './data.service';


@Provide()
export class UserService {

  @Inject()
  dataService: DataService;

  async getUserInfo(username: string, password: string) {
    const user = this.dataService.users.find((u) => u.username === username && u.password === password);
    if (user) {
      return { success: true, username: user.username, projects: user.projects };
    }
    return { success: false, message: 'Invalid username or password' };
  }

  @Post('/login')
  async login(username: string, password: string) {
    const user = this.dataService.users.find(u => u.password == password && u.username == username)
    if (user) {
      return { success: true, message: 'Login successful', user };
    }
    return { success: false, message: 'Login failed' };
  }
}
