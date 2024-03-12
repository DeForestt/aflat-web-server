import { exec, execSync } from "child_process";

export function runDockerContainer (path : string, command: string) {
    return execSync(`(cd ${path} && sudo docker run --rm -v $(pwd):/app -w /app -i deforestt/aflat:latest ${command} < stdin.txt && exit) 2> ${path}/null`, {timeout: 20000});
}

export function setDockerCleanupInterval () {
    // every hour
    setInterval(() => {
        execSync("sudo docker system prune -f");
        execSync("sudo docker stop $(sudo docker ps -q) > /dev/null");
    }, 3600000);
}