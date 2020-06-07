import { exec } from 'child_process';

export class CommandOutput {
    stdout = '';
    stderr = '';
    exitCode:number;
}


export let ENVIRONMENT = process.env;

export function execute(command: string, exitOnError=true) {
    console.log('> ' + command)
    return new Promise<CommandOutput>((resolve: any, reject:any) => {
        const child = exec(command, {env: ENVIRONMENT});
        let output = new CommandOutput();
        child.stdout?.on('data', (data: any) => {
            console.log(data.toString())
            output.stdout = output.stdout + data.toString();
        })
        child.stderr?.on('data', (data: any) => {
            console.error(data.toString())
            output.stderr = output.stderr + data.toString();
        })
        child.on('exit', (code: any) => {
            output.exitCode = code;
            if (code == 0){
                resolve(output);
            }
            else {
                if (exitOnError) process.exit(1);
                else resolve(output);
            }
        })
    })
}
