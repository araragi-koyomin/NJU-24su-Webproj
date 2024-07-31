import { Provide } from '@midwayjs/decorator';
import { IUserOptions } from '../interface';

@Provide()
export class DataService {
  public users: IUserOptions[] = [
    {
      uid: 1,
      username: "往目琛",
      password: "978wmcasd",
      projects: [
        {
          name: "project1",
          description: "测试",
          creationTime: "2024/7/25",
          status: "未完成",
          tasks: [
            { id: "1", name: "tasks1", description: "测试任务1", comments: ["测试评论1"], label: "未完成" }
          ]
        },
        {
          name: "project2",
          description: "还是测试",
          creationTime: "2024/7/25",
          status: "已完成",
          tasks: []
        }
      ]
    }
  ];
}
