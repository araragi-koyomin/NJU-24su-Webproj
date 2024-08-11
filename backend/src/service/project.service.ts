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

  async addProject(username: string, projectData: any): Promise<boolean> {
    const users = this.dataService.loadUsers();
    const user = users.find(u => u.username === username);
    if (!user) {
      console.log('用户未找到');
      return false;
    }

    user.projects.push(projectData);
    this.dataService.saveUsers(users);
    return true
  }

  async addTask(username: string, projectName: string, taskData: any): Promise<boolean> {
    const users = this.dataService.loadUsers();
    const user = users.find(u => u.username === username);
    if (!user) {
      console.log('用户未找到');
      return false;
    }

    const project = user.projects.find(p => p.name === projectName);
    if (!project) {
      console.log('项目未找到');
      return false;
    }

    project.tasks.push(taskData);
    this.dataService.saveUsers(users);
    return true;
  }

  async removeTask(username: string, projectName: string, taskId: string): Promise<boolean> {
    const users = this.dataService.loadUsers();
    const user = users.find(u => u.username === username);
    if (!user) {
      console.log('用户未找到');
      return false;
    }

    const project = user.projects.find(p => p.name === projectName);
    if (!project) {
      console.log('项目未找到');
      return false;
    }

    project.tasks = project.tasks.filter(t => t.id !== taskId);

    this.dataService.saveUsers(users);
    return true;
  }

  async addComment(username: string, projectName: string, taskId: string, newComment: string): Promise<boolean> {
    const users = this.dataService.loadUsers();
    const user = users.find(u => u.username === username);
    if (!user) {
      console.log('用户未找到');
      return false;
    }

    const project = user.projects.find(p => p.name === projectName);
    if (!project) {
      console.log('项目未找到');
      return false;
    }

    const task = project.tasks.find(t => t.id === taskId);
    if (!task) {
      console.log('任务未找到');
      return false;
    }

    task.comments.push(newComment);
    this.dataService.saveUsers(users);
    return true;
  }

  async updateDescription(username: string, projectName: string, taskId: string, description: string): Promise<boolean> {
    const users = this.dataService.loadUsers();
    const user = users.find(u => u.username === username);
    if (!user) {
      console.log('用户未找到');
      return false;
    }

    const project = user.projects.find(p => p.name === projectName);
    if (!project) {
      console.log('项目未找到');
      return false;
    }

    const task = project.tasks.find(t => t.id === taskId);
    if (!task) {
      console.log('任务未找到');
      return false;
    }

    task.description = description;
    this.dataService.saveUsers(users);
    return true;
  }

  async updateTaskCategory(username: string, projectName: string, taskId: string, category: string): Promise<boolean> {
    const users = this.dataService.loadUsers();
    const user = users.find(u => u.username === username);
    if (!user) {
      console.log('用户未找到');
      return false;
    }

    const project = user.projects.find(p => p.name === projectName);
    if (!project) {
      console.log('项目未找到');
      return false;
    }

    const task = project.tasks.find(t => t.id === taskId);
    if (!task) {
      console.log('任务未找到');
      return false;
    }

    task.category = category;
    this.dataService.saveUsers(users);
    return true;
  }
}
