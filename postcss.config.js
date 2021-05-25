// module.exports = {
//     parser: 'postcss-scss',
//     // eslint-disable-next-line global-require
//     plugins: [require('postcss-advanced-variables')(), require('autoprefixer'), require('postcss-nested')],
// };

module.exports = (cfg) => {
    const dev = cfg.env === 'development';
    const scss = cfg.file.extname === '.scss';
    return {
        map: dev ? { inline: false } : false,
        parser: scss ? 'postcss-scss' : false,
        // eslint-disable-next-line global-require
        plugins: [require('postcss-advanced-variables')(), require('postcss-nested')(), require('autoprefixer')()],
    };
};
