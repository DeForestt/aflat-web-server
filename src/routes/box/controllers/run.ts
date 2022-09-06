import express from "express";
import { exec, execSync } from "child_process";
import fs from "fs";
import path from "path";
import {TIMEOUT, wwwroot} from "../constants"
import {randomUUID} from "crypto"

interface RunRSP {
    output: string;
    milis: number;
}

export interface CodeFile {
    name: string
    content: string
}

export interface AflatProject {
    main: CodeFile;
    test?: CodeFile;
    modules?: [CodeFile];
}

interface File {
    id: number;
    data: AflatProject;
};

const runCode = (project : AflatProject) : string => {
    const boxID = randomUUID();
    const boxPath = path.join(wwwroot, 'Boxes', boxID);
    execSync(`(aflat make ${boxPath})`);
    fs.writeFileSync(path.join(boxPath, 'src', 'main.af'), project.main.content);

    if (project.test) {
        fs.writeFileSync(path.join(boxPath, 'test', 'test.af'), project.test.content);
    }
    
    if (project.modules) {
        project.modules.forEach((module) => {
            fs.writeFileSync(path.join(boxPath, 'src', module.name + '.af'), module.content);
        });
    }

    let output;
    
    try {
        const result = execSync(`(cd ${boxPath} && aflat run)`, {timeout: TIMEOUT});
        output = result.toString();
    } catch (err) {
        output = `Program timed out... maximum execution time is ${TIMEOUT} miliseconds`;
    }
    fs.rm(boxPath, {recursive: true} ,err => { if (err) return console.log(err)});

    return output;
};

const Run = (_req : express.Request) : RunRSP => {
    const file : File = _req.body;
    const output: string = runCode(file.data);
    return {
        output: output,
        milis: 0
    }
};

export default Run