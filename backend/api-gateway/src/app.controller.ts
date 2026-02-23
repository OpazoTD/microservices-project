import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Estado')
@Controller()
export class AppController {
  @Get('health')
  @ApiOperation({ summary: 'Verificar si el Gateway está en línea' })
  getHealth() {
    return { status: 'API Gateway is running', timestamp: new Date().toISOString() };
  }
}