import { Injectable } from '@nestjs/common';

@Injectable()
export class LoggerService {
    log(message: string, context?: string) {}
    error(message: string, trace?: string, context?: string) {}
    warn(message: string, context?: string) {}
    debug(message: string, context?: string) {}
    verbose(message: string, context?: string) {}
} 