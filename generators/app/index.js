const Generator = require('yeoman-generator');
const request = require('request-promise-native');

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);
    }

    fetchLatestKotlin() {
        const kotlinDefaultFallback = '1.2.51';
        const kotlinDefaultQuery =
              'https://search.maven.org/solrsearch/select?q=g:org.jetbrains.kotlin%20AND%20a:kotlin-project&wt=json'

        const kotlinDefaultErr = () => {
            this.log('Unable to find latest kotlin version automatically, defaulting to ' + kotlinDefaultFallback);
            this.kotlinDefault = kotlinDefaultFallback;
        }

        return request(kotlinDefaultQuery)
            .then(body => {
                const result = JSON.parse(body);
                if(result.response.docs.length < 1){
                    kotlinDefaultErr(); return;
                }
                this.kotlinDefault = result.response.docs[0].latestVersion;
            })
            .catch((err) => {
                kotlinDefaultErr(); return;
            });
    }

    prompting() {
        return this.fetchLatestKotlin().then(() => {
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
    }
};
