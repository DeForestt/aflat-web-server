import { exec, execSync } from "child_process";

export function runDockerContainer (path : string, command: string) {
    return execSync(`(cd ${path} && docker run --rm -v $(pwd):/app -w /app deforestt/aflat:latest ${command} < stdin.txt) 2> ${path}/null`, {timeout: 20000});
}