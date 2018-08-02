const Generator = require('yeoman-generator')
const latest = require('../app/common/fetch-versions.js');

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts)
    }
    
    prompting() {
        return latest.kotlin.fetch(this).then(() => {
            return this.prompt([{
                type: 'input',
                name: 'name',
                message: 'Project name',
                default: this.appname
            }, {
                type: 'input',
                name: 'rootPackage',
                message: 'Root package name',
                default: 'com.mycompany.myproject'
            }, {
                type: 'input',
                name: 'kotlinVersion',
                message: 'Kotlin Version',
                default: this.kotlinDefault
            }, {
                type: 'confirm',
                name: 'includeStdLib',
                message: 'Would you like to include the Kotlin Standard Library?'
            }, {
                type: 'list',
                name: 'nodeOrWeb',
                message: 'Which JS platform?',
                choices: ['Web', 'Node']
            }]).then(answers => {
                this.answers = answers;
            });
        });
    }
   
    configuring() {
        this.rootPackagePath = 'src/main/kotlin/' + this.answers.rootPackage.replace(/\./g, '/');
    }

    writing() {
        this.fs.copyTpl(
            this.templatePath('build.gradle'),
            this.destinationPath('build.gradle'),
            {
                kotlinVersion: this.answers.kotlinVersion,
                rootPackage: this.answers.rootPackage,
                version: this.answers.version,
                nodeOrWeb: this.answers.nodeOrWeb,
                includeStdLib: this.answers.includeStdLib
            }
        );

        this.fs.copyTpl(
            this.templatePath('settings.gradle'),
            this.destinationPath('settings.gradle'),
            {
                name: this.answers.name
            }
        );

        this.fs.copyTpl(
            this.templatePath('Main.kt'),
            this.destinationPath(this.rootPackagePath + 'Main.kt'),
            {
                rootPackage: this.answers.rootPackage
            }
        );

        // Copies the package.json file for node project
        if (this.answers.nodeOrWeb === 'Node') {
            this.fs.copyTpl(
                this.templatePath('package.json'),
                this.destinationPath('package.json'),
                {
                    name: this.answers.name,
                    version: this.answers.version
                }
            );
        }
    }

    // NPM install if node project
    install() {
        if (this.answers.nodeOrWeb === 'Node') {
            this.npmInstall('kotlin');
        }
    }
};