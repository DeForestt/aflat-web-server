import path from 'path';
import db from '../LowDB.js';
import fs from 'fs';

export interface IModule {
    id: string;
    name: string;
    description: string;
    codePath: string; // Path to the module's code
    author: string;
    version: string;
    dependencies: string[];
    locked: boolean;
}

export interface IModuleQuery {
    name?: string;
    author?: string;
    version?: string;
};

export class Module {

    _module: IModule;

    constructor(module: IModule) {
        this._module = module;
    }

    static async get(query: IModuleQuery) {
        db.read();
        let modules = db.data.modules;
        if (query.name !== undefined) {
            modules = modules.filter((module: IModule) => module.name === query.name);
        }
        if (query.author !== undefined) {
            modules = modules.filter((module: IModule) => module.author === query.author);
        }
        if (query.version !== undefined) {
            modules = modules.filter((module: IModule) => module.version === query.version);
        }
        return modules.length > 0 ? modules[0] : undefined;
    }

    static async getAll() {
        db.read();
        console.log(db.data);
        return db.data.modules;
    };

    static async getID(id: string) {
        db.read();
        return db.data.modules.find((module: IModule) => module.id === id);
    }

    static async post(module: IModule) {
        db.read();
        // get the highest id in the modules array
        const highestId =  db.data.modules.length > 0 ? db.data.modules.reduce((prev: IModule, current: IModule) => (prev.id > current.id) ? prev : current).id : 0;
        module.id = (parseInt(highestId) + 1).toString();
        const filePath = path.join(process.env.DB_DIR ?? './', '_modules', module.name, module.version);
        // create the directory for the module
        fs.mkdirSync(filePath, { recursive: true });
        module.codePath = filePath;
        db.data.modules.push(module);
        module.locked = false;
        await db.write();
        return module;
    }

    static async saveModuleText(id: string, body: string) : Promise<number> {
        await db.read();
        const module = db.data.modules.length > 0 ?  db.data.modules.find((module: IModule) => module.id === id) : undefined;
        if (module === undefined) {
            return 1; // Module not found
        }
        if (module.locked) {
            return 2; // Module is locked
        }

        module.locked = true;
        
        const filePath = module.codePath.replace(" ", "_");

        // write the module code to the file
        fs.writeFileSync(path.join(filePath, module.name + '.af'), body);
        await db.write();

        return 0; // Success
    };

    static async getModuleText(id: string) : Promise<string | undefined> {
        await db.read();
        const module = db.data.modules.length > 0 ?  db.data.modules.find((module: IModule) => module.id === id) : undefined;
        if (module === undefined) {
            return undefined; // Module not found
        }

        const filePath = module.codePath.replace(" ", "_");
        const file = path.join(filePath, module.name + '.af');
        const data = fs.readFileSync(file, 'utf8');
        return data;
    };
}

