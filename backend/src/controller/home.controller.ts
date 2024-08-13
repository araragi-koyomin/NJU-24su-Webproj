import { Controller, Get, Post, Body, Inject, Session, Query } from '@midwayjs/core';
import { UserService } from '../service/user.service';


@Controller('/user')
export class HomeController {

  @Inject()
  userService: UserService

  @Get('/')
  public async home(): Promise<any> {
    return "Hi, 欢迎使用兴趣圈";
  }

  @Post('/login')
  async login(@Body() body: { username: string; password: string }, @Session() session: any) {
    const { username, password } = body
    return await this.userService.login(username, password)
  }

  @Get('/info')
  async getUserInfo(@Query('username') username: string, @Query('password') password: string) {
    const result = await this.userService.getUserInfo(username, password);
    return result;
  }

  @Post('/register')
  async addUser(@Body() userData: any) {
    // 调用 UserService 的 addUser 方法来添加用户
    const result = await this.userService.addUser(userData);
    
    if (result) {
      // 如果添加用户成功，将用户数据返回前端
      const users = this.userService.getAllUsers(); // 假设有一个方法获取所有用户
      return {
        success: true,
        message: 'User added successfully',
        users: users  // 返回所有用户数据
      };
    } else {
      return {
        success: false,
        message: 'Failed to add user'
      };
    }
  }
}