const request = require('request-promise-native');
module.exports.kotlin = {};

module.exports.kotlin.fetch = function(context) {
    return fetch(context,
        'Kotlin',
        '1.2.51',
        'https://search.maven.org/solrsearch/select?q=g:org.jetbrains.kotlin%20AND%20a:kotlin-project&wt=json'
    );
}

const fetch = (context, artifactName, defaultFallbackVersion, query) => {
    const defaultErr = () => {
        context.log('Unable to find latest' + artifactName + ' version automatically, defaulting to ' + defaultFallbackVersion);
        context[artifactName.toLowerCase() + 'Default'] = defaultFallbackVersion;
    }

    return request(query)
        .then(body => {
            const result = JSON.parse(body);
            if(result.response.docs.length < 1){
                defaultErr(); return;
            }
            context[artifactName.toLowerCase() + 'Default'] = result.response.docs[0].latestVersion;
        })
        .catch((err) => {
            defaultErr(); return;
        });
};
