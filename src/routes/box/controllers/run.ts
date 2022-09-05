import express from "express";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import {wwwroot} from "../constants"
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
    modules ?: [CodeFile];
}

interface File {
    id: number;
    data: AflatProject;
};

const runCode = async (project : AflatProject) : Promise<string> => {
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

    execSync(`(cd ${boxPath}; touvh './output.txt'; aflat run > './output.txt')`);
    let output : Promise<string> = fs.promises.readFile(path.join(boxPath, 'output.txt'), 'utf-8');
    fs.rm(boxPath, {recursive: true} ,err => { if (err) return console.log(err)});
    return output;
};

const Run = async (_req : express.Request) : Promise<RunRSP> => {
    const file : File = _req.body;
    const output: string = await runCode(file.data);
    return {
        output: output,
        milis: 0
    }
};

export default Run