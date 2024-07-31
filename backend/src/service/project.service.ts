import { Provide, Inject } from '@midwayjs/decorator';
import { Projects, Task } from '../interface'; // 只导入必要的接口
import { DataService } from './data.service';

@Provide()
export class ProjectService {
  @Inject()
  dataService: DataService;

  async getProjectInfo(username: string, projectName: string): Promise<Projects | null> {
    const user = this.dataService.users.find(u => u.username === username);
    if (user) {
      const project = user.projects.find(p => p.name === projectName);
      return project || null;
    }
    return null;
  }

  async getTasksByProjectName(username: string, projectName: string): Promise<Task[] | null> {
    const project = await this.getProjectInfo(username, projectName);
    if (project) {
      return project.tasks || [];
    }
    return null;
  }
}
