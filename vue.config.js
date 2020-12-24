module.exports = {
    publicPath: './',
    outputDir: 'dist-rollup/sam-mobile',
    assetsDir: 'static',
    indexPath: "index.html",
    runtimeCompiler: true,
    productionSourceMap: false,
    configureWebpack: {
        devtool: 'source-map'
    },
    chainWebpack: config => config.mode('development')
    /**
     * 打包检测打包内容
     */
    // chainWebpack: config => {
    //     config
    //         .plugin('webpack-bundle-analyzer')
    //         .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
    // }
}
