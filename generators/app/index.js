const Generator = require('yeoman-generator');
const execSync = require('child_process').execSync;
const latest = require('./common/fetch-versions.js');

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);
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
                type: 'confirm',
                name: 'fatJar',
                message: 'Would you like to create a fat jar (bundled dependencies)?'
            }, {
                type: 'confirm',
                name: 'runnable',
                message: 'Would you like to create a runnable jar?',
            }, {
                type: 'input',
                name: 'kotlinVersion',
                message: 'Kotlin version',
                default: this.kotlinDefault
            }, {
                type: 'input',
                name: 'jvmVersion',
                message: 'JVM version',
                default: '1.8'
            },{
                type: 'confirm',
                name: 'includeStdlib',
                message: 'Would you like to include the Kotlin Standard Library?',
            }]).then(answers => {
                this.answers = answers;
                return this._stdlibVersion();
            });
        });
    }
        
    _stdlibVersion() {
        if(this.answers.includeStdlib) {
            return this.prompt([{
                type: 'input',
                name: 'stdlibVersion',
                message: 'Kotlin Standard Library version',
                default: 'kotlin-stdlib-jdk8'
            }]).then(a => {
                this.answers.stdlibVersion = a.stdlibVersion;
            });
        }
    }
   
    configuring() {
        this.rootPackagePath = 'src/main/kotlin/' + this.answers.rootPackage.replace(/\./g, '/');
    }

    writing() {
        // Generate build.gradle.
        this.fs.copyTpl(
            this.templatePath('build.gradle'),
            this.destinationPath('build.gradle'),
            {
                kotlinVersion: this.answers.kotlinVersion,
                runnableJar: this.answers.runnable,
                jvmVersion: this.answers.jvmVersion,
                stdlib: this.answers.includeStdlib,
                stdlibVersion: this.answers.stdlibVersion,
                mainClassName: this.answers.rootPackage + '.MainKt',
                fatJar: this.answers.fatJar
            }
        );
            
        // Generate gradle.properties.
        this.fs.copyTpl(
            this.templatePath('gradle.properties'),
            this.destinationPath('gradle.properties'),
            {
                name: this.answers.name,
                group: this.answers.rootPackage.substring(this.answers.rootPackage.lastIndexOf(".") + 1)
            }
        );

        // Generate settings.gradle
        this.fs.copy(
            this.templatePath('settings.gradle'),
            this.destinationPath('settings.gradle')
        );
        
        // Generating Main.kt
        this.fs.copyTpl(
            this.templatePath('Main.kt'),
            this.destinationPath(this.rootPackagePath + '/Main.kt'),
            {
                rootPackage: this.answers.rootPackage
            }
        );

        // Generating gradle wrapper
        this.log('Generating gradle wrapper');
        execSync('gradle wrapper');
    }
};
