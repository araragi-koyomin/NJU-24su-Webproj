import { Controller, Get, Param, Inject, Post, Body, Del, File } from '@midwayjs/core';
// import { UploadService } from '@midwayjs/upload';
import { Context } from '@midwayjs/koa'
import { DataService } from '../service/data.service';
import { ProjectService } from '../service/project.service';
import * as fs from 'fs';
import * as path from 'path';

@Controller('/project')
export class ProjectController {
  @Inject()
  dataService: DataService

  @Inject()
  ctx: Context

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
      return { success: false, message: 'Failed to update category' };
    }
  }


  @Post('/:username/:projectName/tasks/:taskId/attachments')
  async uploadAttachment(
    @Param('username') username: string,
    @Param('projectName') projectName: string,
    @Param('taskId') taskId: string,
    @File() file: any  // 使用 @File 装饰器
  ) {
    console.log('Received file:', file);  // 确认 file 是否正确接收

    if (!file) {
      console.error('No files uploaded');
      return { success: false, message: 'No files uploaded' };
    }

    const uploadDir = path.join(__dirname, '../public/uploads', username, projectName, taskId);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, file.filename);

    try {
      // 将文件从临时路径复制到最终目标路径
      fs.copyFileSync(file.data, filePath);  // 注意参数的顺序：源 -> 目标

      // 在数据库中记录文件信息
      await this.projectService.addAttachment(username, projectName, taskId, {
        filename: file.filename,
        url: `/uploads/${username}/${projectName}/${taskId}/${file.filename}`,
        uploadAt: new Date().toISOString(),
      });

      return { success: true, message: 'File uploaded successfully' };
    } catch (error) {
      console.error('Error uploading file:', error);
      return { success: false, message: 'File upload failed' };
    }
  }





  @Get('/:username/:projectName/tasks/:taskId/attachments/:filename')
  async downloadAttachment(
    @Param('username') username: string,
    @Param('projectName') projectName: string,
    @Param('taskId') taskId: string,
    @Param('filename') filename: string
  ) {
    const filePath = path.join(__dirname, '../public/uploads', username, projectName, taskId, filename);

    if (fs.existsSync(filePath)) {
      console.log(`Downloading file from: ${filePath}`);
      this.ctx.set('Content-Disposition', `attachment; filename=${filename}`);
      this.ctx.type = 'application/octet-stream'; // 设置响应类型
      this.ctx.body = fs.createReadStream(filePath); // 以流的方式返回文件内容
    } else {
      console.error(`File not found: ${filePath}`);
      return {
        success: false,
        message: 'File not found'
      };
    }
  }
}
