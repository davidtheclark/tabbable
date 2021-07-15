/* eslint-env node */

const path = require('path');
const fs = require('fs');

module.exports = {
  basic: fs.readFileSync(path.join(__dirname, 'basic.html'), 'utf8'),
  'changing-content': fs.readFileSync(
    path.join(__dirname, 'changing-content.html'),
    'utf8'
  ),
  jqueryui: fs.readFileSync(path.join(__dirname, 'jqueryui.html'), 'utf8'),
  nested: fs.readFileSync(path.join(__dirname, 'nested.html'), 'utf8'),
  'non-linear': fs.readFileSync(
    path.join(__dirname, 'non-linear.html'),
    'utf8'
  ),
  svg: fs.readFileSync(path.join(__dirname, 'svg.html'), 'utf8'),
  radio: fs.readFileSync(path.join(__dirname, 'radio.html'), 'utf8'),
  details: fs.readFileSync(path.join(__dirname, 'details.html'), 'utf8'),
  'shadow-dom': fs.readFileSync(
    path.join(__dirname, 'shadow-dom.html'),
    'utf8'
  ),
  displayed: fs.readFileSync(path.join(__dirname, 'displayed.html'), 'utf8'),
  shadowDomRadio: fs.readFileSync(
    path.join(__dirname, 'shadow-dom-radio.html'),
    'utf8'
  ),
  shadowDomDisplay: fs.readFileSync(
    path.join(__dirname, 'shadow-dom-display.html'),
    'utf8'
  ),
  shadowDomQuery: fs.readFileSync(
    path.join(__dirname, 'shadow-dom-query.html'),
    'utf8'
  ),
};
