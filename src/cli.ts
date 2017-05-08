import { readFileSync } from 'fs';
import { argv } from 'yargs';
import parse from './parse';
import server from './server';

const file = readFileSync(argv.f).toString();
parse(file);
server(argv.p);
