import { Controller, Get, Param, Inject } from '@midwayjs/core';
import { DataService } from '../service/data.service';
import { ProjectService } from '../service/project.service';

@Controller('/project')
export class ProjectController {
  @Inject()
  dataService: DataService

  @Inject()
  projectService: ProjectService

  @Get('/:username/:projectName')
  async getProject(@Param('username') username: string, @Param('projectName') projectName: string) {
    try {
      const project = await this.projectService.getProjectInfo(username, projectName);
      if (project) {
        return { success: true, project };
      } else {
        console.error('controller出错');
        return { success: false, message: 'Project not found' };
      }
    } catch (error) {
      console.error('Error fetching project:', error);
      return { success: false, message: 'Internal server error' };
    }
  }

  @Get('/:username/:projectName/tasks')
  async getTasks(@Param('username') username: string, @Param('projectName') projectName: string) {
    try {
      const tasks = await this.projectService.getTasksByProjectName(username, projectName);
      if (tasks) {
        return { success: true, tasks };
      } else {
        return { success: false, message: 'Tasks not found' };
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return { success: false, message: 'Internal server error' };
    }
  }
}
