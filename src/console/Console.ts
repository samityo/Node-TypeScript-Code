import {ICommand} from './ICommand';
import * as minimist from 'minimist';
import chalk from 'chalk';
import {injectable} from 'inversify';

@injectable()
export class Console {

    private commands: Map<string, ICommand> = new Map<string, ICommand>();

    public register(command: ICommand) {
        this.commands.set(command.getName(), command);
    }

    run(_args: any) {
        const name = _args[0];
        if (!name || name === 'list') {
            this.list();
            return;
        }
        const cmd = this.commands.get(name);
        if (!cmd) {
            console.log(chalk.red(`Command with name ${name} not found`));
            return;
        }
        const args = minimist(_args.slice(1), {
            string: cmd.getInputParameters(),
            boolean: cmd.getOptions(),
            alias: cmd.getAliases(),
            '--': true,
            stopEarly: true
        });
        cmd.run(args);
    }

    private list() {
        console.log(chalk.yellow('List of commands:'));
        this.commands.forEach((cmd: ICommand) => {
            console.log(chalk.blue(cmd.getName(), chalk.yellow(' input parameters: '), chalk.greenBright(cmd.getInputParameters().join(', '))), chalk.white(cmd.getDescription()));
        });
    }


}