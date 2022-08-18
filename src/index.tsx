import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { hot } from 'react-hot-loader';

import Home from './containers/Home';
import 'normalize.css';

const HotApp = hot(module)(Home);
ReactDOM.render(<HotApp />, document.getElementById('root'));
