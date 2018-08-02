const request = require('request-promise-native');
module.exports.kotlin = {};

module.exports.kotlin.fetch = function(context) {
    const kotlinDefaultFallback = '1.2.51';
    const kotlinDefaultQuery =
          'https://search.maven.org/solrsearch/select?q=g:org.jetbrains.kotlin%20AND%20a:kotlin-project&wt=json'
    
    const kotlinDefaultErr = () => {
        context.log('Unable to find latest kotlin version automatically, defaulting to ' + kotlinDefaultFallback);
        context.kotlinDefault = kotlinDefaultFallback;
    }

    return request(kotlinDefaultQuery)
        .then(body => {
            const result = JSON.parse(body);
            if(result.response.docs.length < 1){
                kotlinDefaultErr(); return;
            }
            context.kotlinDefault = result.response.docs[0].latestVersion;
        })
        .catch((err) => {
            kotlinDefaultErr(); return;
        });
}
