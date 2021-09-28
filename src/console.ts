import 'reflect-metadata';
import * as path from 'path';
import * as log4js from 'log4js';
import {Container} from 'inversify';
import * as config from 'config';
import {container} from './inversify.config';
import * as kue from 'kue';
import * as clear from 'clear';
import * as chalk from 'chalk';
import * as figlet from 'figlet';
import {Console} from './console/Console';
import {SampleCommand} from './console/commands/SampleCommand';
import {ICommand} from './console/ICommand';


export class AppConsole {
    private container: Container = container;
    private logger: log4js.Logger;
    private queue: any;
    private cmd: Console;

    constructor() {
        log4js.configure({
            appenders: {
                console: {type: 'console'},
                file: {type: 'file', filename: path.join(__dirname, '/../console.log')}
            },
            categories: {
                app: {appenders: ['file', 'console'], level: 'debug'},
                default: {appenders: ['console', 'file'], level: 'debug'}
            }
        });
        this.logger = log4js.getLogger('Console');
        this.logger.level = config.get('logging.level');
        this.config();
    }

    private config(): void {
        this.cmd = this.container.get<Console>(Console);
        let sampleCmd: ICommand = new SampleCommand();
        this.cmd.register(sampleCmd);
    }

    public run(args: Array<any>): void{
        clear();
        console.log(
            chalk.green(
                figlet.textSync('Sample CLI', { horizontalLayout: 'full' })
            )
        );
        this.cmd.run(args);
    }

    public getQueue(): any {
        if(!this.queue){
            this.queue = kue.createQueue({
                prefix: 'jobs',
                redis: config.get('redis')
            });
        }
        return this.queue;
    }
}
const cmd = new AppConsole();
cmd.run(process.argv.slice(2));
