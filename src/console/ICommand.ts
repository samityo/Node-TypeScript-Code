import {ParsedArgs} from 'minimist';

export interface ICommand {
    run(args: ParsedArgs): void;

    getName(): string;

    getDescription(): string;

    getInputParameters(): string[];

    getOptions(): string[];

    getAliases(): { [key: string]: string };
}