const path = require("path");
module.exports = {
    transpileDependencies: [
        "@splidejs"
    ],
    lintOnSave: false,
    filenameHashing: false,
    configureWebpack: {
        resolve: {
            alias: {
                'styles': path.resolve(__dirname, 'src/styles')
            }
        },
        output: {
            libraryTarget: "umd",
            filename: "js/app.js",
        },
        devServer: {
            disableHostCheck: true,
            historyApiFallback: true,
            headers: {
              'Access-Control-Allow-Origin': '*'
            }
        }
    }
}
