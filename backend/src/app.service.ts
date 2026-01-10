import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): any {
    const fs = require('fs');
    const path = require('path');

    let rootFiles = [];
    try { rootFiles = fs.readdirSync(process.cwd()); } catch (e) { rootFiles = [e.message]; }

    let tmpFiles = [];
    try { tmpFiles = fs.readdirSync('/tmp'); } catch (e) { tmpFiles = [e.message]; }

    return {
      message: 'Hello World! Backend is Online.',
      env: process.env.NODE_ENV,
      vercel: process.env.VERCEL,
      cwd: process.cwd(),
      database_path_check: {
        root_exists: fs.existsSync(path.join(process.cwd(), 'database.sqlite')),
        tmp_exists: fs.existsSync(path.join('/tmp', 'database.sqlite'))
      },
      rootFiles,
      tmpFiles
    };
  }
}
