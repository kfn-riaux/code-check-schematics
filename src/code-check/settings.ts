import {NodeDependency, NodeDependencyType} from '@schematics/angular/utility/dependencies';

export const haskySetting = {
    'hooks': {
        'pre-commit': 'lint-staged'
    }
};
export const lintStagedSetting = {
    'src/**/*.@(ts|html|css|scss)': [
        'npm run format',
        'npm run lint',
        'git add'
    ]
};

export const additionalScripts = {
    'lint': 'npm run lint:ts && npm run lint:style',
    'lint:ts': 'ng lint',
    'lint:style': 'stylelint "src/**/*.(css|scss)"',
    'format': 'prettier --config .prettierrc.json --ignore-path .prettierignore --write',
};

export const devDependencies: NodeDependency[] = [
    {name: 'husky', version: '^2.2.0', type: NodeDependencyType.Dev},
    {name: 'lint-staged', version: '^8.1.6', type: NodeDependencyType.Dev},
    {name: 'prettier', version: '^1.17.0', type: NodeDependencyType.Dev},
    {name: 'stylelint', version: '^10.0.1', type: NodeDependencyType.Dev},
    {name: 'stylelint-config-prettier', version: '^5.1.0', type: NodeDependencyType.Dev},
    {name: 'stylelint-config-standard', version: '^18.3.0', type: NodeDependencyType.Dev},
    {name: 'stylelint-scss', version: '^3.6.1', type: NodeDependencyType.Dev},
    {name: 'tslint-config-prettier', version: '^1.18.0', type: NodeDependencyType.Dev},
];

export const tslintExtendsSettings: string[] = [
    'tslint:recommended',
    'tslint-config-prettier'
];
