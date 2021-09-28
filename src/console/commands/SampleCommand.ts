import {ICommand} from '../ICommand';
import {injectable} from 'inversify';
import {ParsedArgs} from 'minimist';
import * as log4js from 'log4js';

@injectable()
export class SampleCommand implements ICommand {
    private logger: log4js.Logger;

    constructor() {
        this.logger = log4js.getLogger(this.getName());
        this.logger.level = 'debug';
    }

    getName(): string {
        return 'sample:cmd';
    }

    run(args: ParsedArgs): void {
        let param: any = args.param;
        if (!param) {
            this.logger.info('\'--param\' is required');
            return;
        }

        try {
            this.logger.info('Command is run...')
        } catch (e) {
            this.logger.error('perform error: ', e);
        }
    }

    getDescription(): string {
        return 'Sample command';
    }

    getInputParameters(): string[] {
        return ['param'];
    }

    getOptions(): string[] {
        return ['verbose'];
    }

    getAliases(): { [key: string]: string } {
        return {p: 'param', v: 'verbose'};
    }

}