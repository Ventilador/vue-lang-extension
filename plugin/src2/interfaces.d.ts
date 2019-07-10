import { log as Logger } from 'console';
declare global {
    const log: typeof Logger;
}