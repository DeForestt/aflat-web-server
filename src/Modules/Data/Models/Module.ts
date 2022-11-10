import db from '../LowDB.js';

export interface IModule {
    id: string;
    name: string;
    description: string;
    code: string;
    author: string;
    version: string;
    dependencies: string[];
}

export class Module {

    _module: IModule;

    constructor(module: IModule) {
        this._module = module;
    }

    static async get(id: string) {
        db.read();
        return db.data.modules.find((module: IModule) => module.id === id);
    }

    static async getAll() {
        db.read();
        console.log(db.data);
        return db.data.modules;
    };

    static async getByName(name: string) {
        db.read();
        return db.data.modules.find((module: IModule) => module.name === name);
    }

    static async post(module: IModule) {
        db.read();
        db.data.modules.push(module);
        await db.write();
    }
}