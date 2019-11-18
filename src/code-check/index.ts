import {
    apply,
    mergeWith,
    Rule,
    SchematicContext,
    SchematicsException,
    template,
    Tree,
    url
} from '@angular-devkit/schematics';
import {strings} from '@angular-devkit/core';
import {addPackageJsonDependency} from '@schematics/angular/utility/dependencies';
import * as Settings from './settings';
import {Schema} from './schema';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function codeCheck(_options: Schema): Rule {
    return (tree: Tree, _context: SchematicContext) => {

        addDevDependencies(tree);
        updatePackageJson(tree);
        updateTsLintJson(tree);
        const sourceTemplates = url('./files');
        const sourceParametrizedTemplates = apply(sourceTemplates, [
            template({
                ..._options,
                ...strings,
            }),
        ]);
        return mergeWith(sourceParametrizedTemplates)(tree, _context);
    };
}

function addDevDependencies(tree: Tree) {
    for (let devDependency of Settings.devDependencies) {
        addPackageJsonDependency(tree, devDependency);
    }
}

function updatePackageJson(tree: Tree): void {
    const path = 'package.json';
    const packageJsonBuffer = tree.read(path);
    if (!packageJsonBuffer) {
        throw new SchematicsException('package.json is not found.');
    }
    const packageJson = JSON.parse(packageJsonBuffer.toString());
    packageJson.hasky = Settings.haskySetting;
    packageJson['lint-staged'] = Settings.lintStagedSetting;
    packageJson.scripts = {
        ...packageJson.scripts,
        ...Settings.additionalScripts
    };
    tree.overwrite(path, JSON.stringify(packageJson, null, 2));
}

function updateTsLintJson(tree: Tree) {
    const path = 'tslint.json';
    const tslintJsonBuffer = tree.read(path);
    if (!tslintJsonBuffer) {
        throw new SchematicsException('tslint.json is not found.');
    }
    const tslintJson = JSON.parse(tslintJsonBuffer.toString());

    tslintJson.extends = Settings.tslintExtendsSettings;

    tree.overwrite(path, JSON.stringify(tslintJson, null, 2));

}
