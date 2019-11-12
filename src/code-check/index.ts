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
import {Schema} from './schema';
import {strings} from '@angular-devkit/core';
import {addPackageJsonDependency} from '@schematics/angular/utility/dependencies';
import {additionalScripts, devDependencies, haskySetting, lintStagedSetting} from './settings';

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function codeCheck(_options: Schema): Rule {
    return (tree: Tree, _context: SchematicContext) => {

        updatePackageJson(tree);

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

function updatePackageJson(tree: Tree): void {
    const packageJsonBuffer = tree.read('package.json');
    if (!packageJsonBuffer) {
        throw new SchematicsException('Not npm project');
    }
    const packageJson = JSON.parse(packageJsonBuffer.toString());

    for (let devDependency of devDependencies) {
        addPackageJsonDependency(tree, devDependency);
    }

    packageJson.hasky = haskySetting;
    packageJson['lint-staged'] = lintStagedSetting;
    packageJson.scripts = {
        ...packageJson.scripts,
        ...additionalScripts
    };
    tree.overwrite('package.json', JSON.stringify(packageJson, null, 2));
}
