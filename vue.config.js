module.exports = {
    devServer: {
        proxy: {
            '/api': {
                // target: 'http://10.70.6.90:12800',
                // target: 'http://10.70.50.35:12800',
                target: 'http://10.70.0.76:12800',
                // target: 'http://10.25.74.56:12800',
                changeOrigin: true,
            },
            '/graphql': {
                // target: 'http://10.25.74.56:12800',
                // target: 'http://10.70.50.35:12800',
                target: 'http://10.70.0.76:12800',
                // target: 'http://10.70.6.90:12800',
                changeOrigin: true,
            },
        },
    },
    chainWebpack: config => {
        const svgRule = config.module.rule('svg');
        svgRule.uses.clear();
        svgRule
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: '[name]',
            });
    },
};
