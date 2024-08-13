import { Post, Provide, Inject } from '@midwayjs/core';
import { IUserOptions } from '../interface';
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

  async addUser(userData: any): Promise<any> {
    const users = this.dataService.loadUsers();

    // 为新用户生成唯一的 uid
    const newUser: IUserOptions = {
      uid: Date.now(),  // 生成一个唯一的 number 类型的 UID
      username: userData.username,
      password: userData.password,
      projects: userData.projects || []  // 初始化 projects 为空数组
    };


    // 添加新用户
    users.push(newUser);

    // 持久化保存数据到文件或数据库
    this.dataService.saveUsers(users);

    console.log(users)

    // 发送用户数据到前端
    return {
      success: true,
      message: 'User added successfully',
      users: users  // 将用户数据返回到前端
    };
  }

  getAllUsers(): IUserOptions[] {
    return this.dataService.loadUsers();
  }

}
