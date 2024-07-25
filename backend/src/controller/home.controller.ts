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

}