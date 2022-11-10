import { join, dirname } from 'node:path';

import { JSONFile } from 'lowdb';
import { Low } from 'lowdb';
import { wwwroot } from '../../routes/box/constants.js';


const dirname_ = process.env.DB_DIR || dirname(wwwroot);
const file = join(dirname_, 'db.json')

const adapter = new JSONFile(file)
const db : Low<any> = new Low(adapter)

db.read()

// Set some defaults (required if your JSON file is empty)
db.data = db.data ?? { modules: [] }
db.write();
export default db