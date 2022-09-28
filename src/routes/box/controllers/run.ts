import express from "express";
import { exec, execSync } from "child_process";
import fs from "fs";
import path from "path";
import {TIMEOUT, wwwroot} from "../constants"
import {randomUUID} from "crypto"
import { runDockerContainer } from "../../../Modules/RunDocker";

interface RunRSP {
    output: string;
    milis: number;
    stderr?: string;
}

export interface CodeFile {
    name: string
    content: string
}

export interface AflatProject {
    main: CodeFile;
    test?: CodeFile;
    modules?: [CodeFile];
    stdin?: string;
}

interface File {
    id: number;
    data: AflatProject;
};

const runCode = (project : AflatProject) : RunRSP => {
    const boxID = randomUUID();
    const boxPath = path.join(wwwroot, 'Boxes', boxID);
    let command = "run";
    execSync(`(aflat make ${boxPath}; touch ${boxPath}/stdin.txt)`);

    if (project.stdin) {
        fs.writeFileSync(path.join(boxPath, 'stdin.txt'), project.stdin);
    };

    fs.writeFileSync(path.join(boxPath, 'src', 'main.af'), project.main.content);

    if (project.test) {
        fs.writeFileSync(path.join(boxPath, 'src', 'test', 'test.af'), project.test.content);
        command = "test";
    }
    
    if (project.modules) {
        project.modules.forEach((module) => {
            fs.writeFileSync(path.join(boxPath, 'src', module.name + '.af'), module.content);
            fs.appendFileSync(path.join(boxPath, 'aflat.cfg'), `m ${module.name}\n`);
        });
    }

    let output : RunRSP = {
        output: "",
        milis: 0
    };
    
    try {
        // const result = execSync(`(cd ${boxPath} &&  aflat ${command} < stdin.txt)`, {timeout: TIMEOUT});
        const result = runDockerContainer(boxPath, command)
        output.output = result.toString();
    } catch (err) {
        // get err string from file
        output.stderr = fs.readFileSync(path.join(boxPath, 'null')).toString();
        output.stderr = `${output.stderr}\n\n${err}`
        console.log(output.stderr);
        output.output = `Program timed out... maximum execution time is ${TIMEOUT} miliseconds`;
    }
    fs.rm(boxPath, {recursive: true} ,err => { if (err) return console.log(err)});

    return output;
};

const Run = (_req : express.Request) : RunRSP => {
    const file : File = _req.body;
    return runCode(file.data);
};

export default Run