import { join } from "path";
import { cp } from "./cp";
import { writeFile, rename } from "fs-extra";

const packajeJson = require('./../package.json');
packajeJson.contributes.typescriptServerPlugins[0].name = '../plugin';
const mainFolder = join(__dirname, '..')
const distFolder = join(mainFolder, 'dist');
Promise.all([
    writeFile(
        join(__dirname, '../dist/package.json'),
        JSON.stringify(
            ['repository', 'publisher', 'name', 'displayName', 'version', 'engines', 'activationEvents', 'contributes'].reduce(function (prev, cur) {
                prev[cur] = packajeJson[cur];
                return prev;
            }, { main: './extension.js' }),
            undefined, '\t'
        )
    ),
    cp(join(mainFolder, 'syntaxes'), join(distFolder, 'syntaxes')),
    cp(join(mainFolder, 'lang'), join(distFolder, 'lang'))

]);
