import express from "express";
import { exec } from "child_process";
import fs from "fs";

interface RunRSP {
    milis: number;
    output: string;
}

interface File {
    name: string;
    text: string;
};

const runCode = async (input : string) => {
    let output = '';

    exec("cd")
};

const Run = async (_req : express.Request) : Promise<RunRSP> => {
    const file : File = _req.body;
    // save the body to a file...

    return {
        milis: 0,
        output: 'The box has been run'
    }
};

export default Run