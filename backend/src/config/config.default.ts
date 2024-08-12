import { MidwayConfig } from '@midwayjs/core';
import * as path from 'path';  // 添加这一行

export default {
  // use for cookie sign key, should change to your own and keep security
  keys: '1719990379385_8994',
  koa: {
    port: 7002,
  },
  webSocket: {},
  cors: {
    origin: "*"
  },
  upload: {
    mode: 'file',
    fileSize: '50mb',
    whitelist: ['.jpg', '.png', '.pdf', '.txt', '.zip', '.md', '.docx', '.epub', '.zip', '.7z', '.mp3', '.mp4'],
    tmpdir: path.join(__dirname, '../public/uploads/tmp'),  // 将 tmpdir 设为实际存在的目录
    cleanTmpdir: false,
    base64: false,
  },
} as MidwayConfig;
