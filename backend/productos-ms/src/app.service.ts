import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  // Este método es útil para realizar un "Health Check" desde el Gateway
  getHello(): string {
    return 'Productos Microservice is running! 🚀';
  }
}