import { Controller, Get, Param, Inject, Post, Body, Del } from '@midwayjs/core';
import { DataService } from '../service/data.service';
import { ProjectService } from '../service/project.service';

@Controller('/project')
export class ProjectController {
  @Inject()
  dataService: DataService

  @Inject()
  projectService: ProjectService

  @Post('/:username/projects')
  async addProject(
    @Param('username') username: string,
    @Body() projectData: any
  ) {
    const result = await this.projectService.addProject(username, projectData);
    if (result) {
      return { success: true, message: 'Project added successfully' };
    } else {
      return { success: true, message: 'Failed to add project' }
    }
  }

  @Get('/:username/:projectName')
  async getProject(@Param('username') username: string, @Param('projectName') projectName: string) {
    try {
      const project = await this.projectService.getProjectInfo(username, projectName);
      // console.log('项目任务:', project.tasks);  // 在这里查看项目中的任务
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

  @Post('/:username/:projectName/tasks')
  async addTask(
    @Param('username') username: string,
    @Param('projectName') projectName: string,
    @Body() taskData: any
  ) {
    const result = await this.projectService.addTask(username, projectName, taskData);
    if (result) {
      return { success: true, message: 'Task added successfully' };
    } else {
      return { success: true, message: 'Failed to add task' }
    }
  }

  @Del('/:username/:projectName/tasks/:taskId')
  async removeTask(
    @Param('username') username: string,
    @Param('projectName') projectName: string,
    @Param('taskId') taskId: string
  ) {
    const result = this.projectService.removeTask(username, projectName, taskId);
    if (result) {
      return { success: true };
    } else {
      return { success: false, message: 'Failed to delete task' };
    }
  }

  @Post('/:username/:projectName/tasks/:taskId/comments')
  async addComment(
    @Param('username') username: string,
    @Param('projectName') projectName: string,
    @Param('taskId') taskId: string,
    @Body('comment') comment: string
  ) {
    const result = await this.projectService.addComment(username, projectName, taskId, comment);
    if (result) {
      return { success: true, message: 'Comment added successfully' };
    } else {
      return { success: true, message: 'Failed to add comment' };
    }
  }

  @Post('/:username/:projectName/tasks/:taskId/description')
  async updateDescription(
    @Param('username') username: string,
    @Param('projectName') projectName: string,
    @Param('taskId') taskId: string,
    @Body('description') description: string,
  ) {
    const result = await this.projectService.updateDescription(username, projectName, taskId, description);
    if (result) {
      return { success: true, message: 'Description updated successfully' };
    } else {
      return { success: true, message: 'Failed to update description' };
    }
  }

  @Post('/:username/:projectName/tasks/:taskId/category')
  async updateTaskCategory(
    @Param('username') username: string,
    @Param('projectName') projectName: string,
    @Param('taskId') taskId: string,
    @Body('category') category: string,
  ) {
    const result = await this.projectService.updateTaskCategory(username, projectName, taskId, category);
    if (result) {
      return { success: true, message: 'Category updated successfully' };
    } else {
      return { success: true, message: 'Failed to update category' };
    }
  }
}
