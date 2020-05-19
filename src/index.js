import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import App from './components/App'
import './css/style.scss'

import store from './store'

ReactDOM.render(
	<StrictMode>
		<Provider store={ store }>
			<App />
		</Provider>
	</StrictMode>,
	document.getElementById('root')
)
