import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ConfigService {
  private readonly envConfig: Record<string, string>;

  constructor() {
    const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
    const filePath = path.resolve(process.cwd(), envFile);
    
    if (fs.existsSync(filePath)) {
      this.envConfig = dotenv.parse(fs.readFileSync(filePath));
    } else {
      this.envConfig = {};
    }
  }

  get(key: string, defaultValue?: string): string {
    return this.envConfig[key] || process.env[key] || defaultValue || '';
  }

  getNumber(key: string, defaultValue?: number): number {
    const value = this.get(key);
    return value ? parseInt(value, 10) : (defaultValue ?? 0);
  }

  getBoolean(key: string, defaultValue: boolean = false): boolean {
    const value = this.get(key);
    return value ? value.toLowerCase() === 'true' : defaultValue;
  }
}
