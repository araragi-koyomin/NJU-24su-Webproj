import { Configuration, App } from '@midwayjs/core';
import * as koa from '@midwayjs/koa';
import * as validate from '@midwayjs/validate';
import * as info from '@midwayjs/info';
import { join } from 'path';
import { ReportMiddleware } from './middleware/report.middleware';
import cors from '@koa/cors';
import * as upload from '@midwayjs/upload';
import koaStatic from 'koa-static';

@Configuration({
  imports: [
    koa,
    validate,
    upload,
    {
      component: info,
      enabledEnvironment: ['local'],
    },
  ],
  importConfigs: [join(__dirname, './config')],
})
export class MainConfiguration {
  @App('koa')
  app: koa.Application;

  async onReady() {
    // add middleware
    this.app.useMiddleware([ReportMiddleware]);

    // add CORS middleware
    this.app.use(cors({
      origin: '*',
      allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    }));

    // Serve static files
    this.app.use(koaStatic(join(__dirname, '/public')));
  }
}
