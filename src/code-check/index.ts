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
import {addPackageJsonDependency, NodeDependency, NodeDependencyType} from '@schematics/angular/utility/dependencies';


const haskySetting = {
    'hooks': {
        'pre-commit': 'lint-staged'
    }
};
const lintStagedSetting = {
    'src/**/*.@(ts|html|css|scss)': [
        'npm run format',
        'npm run lint',
        'git add'
    ]
};

const additionalScripts = {
    'lint': 'npm run lint:ts && npm run lint:style',
    'lint:ts': 'ng lint',
    'lint:style': 'stylelint "src/**/*.(css|scss)"',
    'format': 'prettier --config .prettierrc.json --ignore-path .prettierignore --write',
};

const devDependencies: NodeDependency[] = [
    {name: 'husky', version: '^2.2.0', type: NodeDependencyType.Dev},
    {name: 'lint-staged', version: '^8.1.6', type: NodeDependencyType.Dev},
    {name: 'prettier', version: '^1.17.0', type: NodeDependencyType.Dev},
    {name: 'stylelint', version: '^10.0.1', type: NodeDependencyType.Dev},
    {name: 'stylelint-config-prettier', version: '^5.1.0', type: NodeDependencyType.Dev},
    {name: 'stylelint-config-standard', version: '^18.3.0', type: NodeDependencyType.Dev},
    {name: 'stylelint-scss', version: '^3.6.1', type: NodeDependencyType.Dev},
    {name: 'tslint-config-prettier', version: '^1.18.0', type: NodeDependencyType.Dev},
]

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function codeCheck(_options: Schema): Rule {
    return (tree: Tree, _context: SchematicContext) => {

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
