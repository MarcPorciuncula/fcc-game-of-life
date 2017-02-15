import { jsdom } from 'jsdom';

global.document = jsdom('<body><div id="root"></div></body>');
global.window = document.defaultView;
global.navigator = window.navigator;
