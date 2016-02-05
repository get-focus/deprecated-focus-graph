const configBuilder = require('webpack-focus').configBuilder;
const customConfig = {
    externals: {
        'react': 'React',
        'react-dom': 'ReactDOM',
        'redux-devtools': 'redux-devtools',
        'react-addons-css-transition-group': {
            root: ['React', 'addons', 'CSSTransitionGroup']
        },
        moment: 'moment',
        lodash: 'lodash'
    }
}

module.exports = configBuilder(customConfig);
