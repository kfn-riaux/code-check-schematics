import {Tree} from '@angular-devkit/schematics';
import {SchematicTestRunner, UnitTestTree} from '@angular-devkit/schematics/testing';
import {getFileContent} from '@schematics/angular/utility/test';
import * as Settings from './settings';

describe('code-check schematic', () => {
    let runner: SchematicTestRunner;
    let appTree: Tree;

    beforeEach(async () => {
        runner = new SchematicTestRunner('schematics', require.resolve('../collection.json'));
        appTree = await createTestApp(runner);
    });

    describe('ng-add', () => {
        let tree: Tree;
        let packageJson: any;
        beforeEach(async () => {
            tree = await runner.runSchematicAsync('ng-add', {}, appTree).toPromise();
            packageJson = JSON.parse(getFileContent(tree, 'package.json'));
        });
        it('should add devDependencies', async () => {
            const devDependencies = packageJson.devDependencies;
            for (const dev of Settings.devDependencies) {
                expect(devDependencies[dev.name]).toBeDefined();
            }
        });

        it('should add auto ng-add setting in package.json', async () => {
            const haskySetting = packageJson['hasky'];
            const lintStagedSettings = packageJson['lint-staged'];

            expect(haskySetting).toEqual(Settings.haskySetting);
            expect(lintStagedSettings).toEqual(Settings.lintStagedSetting);
        });

        it('should add new setting files in workspace', async () => {
            const prettierIgnore = getFileContent(tree, '/.prettierignore');
            const prettierRcJson = getFileContent(tree, '/.prettierrc.json');
            const styleLintRcJson = getFileContent(tree, '/.stylelintrc.json');

            expect(prettierIgnore).toBeTruthy();
            expect(prettierRcJson).toBeTruthy();
            expect(styleLintRcJson).toBeTruthy();
        });

        it('should add extends setting in tslint.json', async () => {
            const tslintJson = JSON.parse(getFileContent(tree, '/tslint.json'));
            const extendsSetting = tslintJson.extends;

            expect(extendsSetting).toEqual(Settings.tslintExtendsSettings);
        });

        it('should add and update npm scripts', () => {
            const scripts = packageJson.scripts;
            for (const scriptName of Object.keys(Settings.additionalScripts)) {
                expect(scripts[scriptName]).toEqual(Settings.additionalScripts[scriptName]);
            }
        });
    });

    describe('ng-add with style param', () => {

        async function getRule(style: string): Promise<any> {
            const tree = await runner.runSchematicAsync('ng-add', {style}, appTree).toPromise();
            const styleLintRcJson = JSON.parse(getFileContent(tree, '/.stylelintrc.json'));
            return styleLintRcJson.rules;
        }

        const scssRules = [
            'scss/at-extend-no-missing-placeholder',
            'scss/at-function-pattern',
            'scss/at-import-no-partial-leading-underscore',
            'scss/at-import-partial-extension-blacklist',
            'scss/at-mixin-pattern',
            'scss/at-rule-no-unknown',
            'scss/dollar-variable-colon-space-after',
            'scss/dollar-variable-colon-space-before',
            'scss/dollar-variable-pattern',
            'scss/percent-placeholder-pattern',
            'scss/selector-no-redundant-nesting-selector',
        ];

        it('should exist scss specific setting in .stylelintrc.json when style is scss', async () => {
            const rules = await getRule('scss');

            for (const ruleName of scssRules) {
                expect(rules[ruleName]).toBeDefined();
            }
        });

        it('should not exist scss specific setting in .stylelintrc.json when style is css', async () => {
            const rules = await getRule('css');

            for (const ruleName of scssRules) {
                expect(rules[ruleName]).toBeUndefined();
            }
        });
    });
});

export async function createTestApp(runner: SchematicTestRunner, appOptions = {}, tree?: Tree):
    Promise<UnitTestTree> {
    const workspaceTree = await runner.runExternalSchematicAsync('@schematics/angular', 'workspace', {
        name: 'workspace',
        version: '8.3.17',
        newProjectRoot: 'projects'
    }, tree).toPromise();

    return runner.runExternalSchematicAsync('@schematics/angular', 'application',
        {name: 'application', ...appOptions}, workspaceTree).toPromise();
}
