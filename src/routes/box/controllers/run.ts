import express from "express";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import {wwwroot} from "../constants"
import {randomUUID} from "crypto"
import { collapseTextChangeRangesAcrossMultipleVersions } from "typescript";

interface RunRSP {
    output: string;
    milis: number;
}

interface File {
    id: number;
    name: string;
    data: string;
};

const runCode = async (input : string) : Promise<string> => {
    const boxID = randomUUID();
    const boxPath = path.join(wwwroot, 'Boxes', boxID);
    execSync(`(aflat make ${boxPath})`);
    fs.writeFileSync(path.join(boxPath, 'src', 'main.af'), input);
    execSync(`(cd ${boxPath}; aflat run > './output.txt')`);
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