import './index.less'

import pic from './pic.png'

import tpl from './index.html'

document.body.innerHTML = tpl

document.querySelector('#img').src = pic

document.querySelector('#word').innerHTML = 'hello world'

export default 'hello rollup!'