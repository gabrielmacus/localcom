import GAnalytics from 'ganalytics';
import App from '@components/App';
import './index.sass';


window.app = new App({
	target: document.querySelector('#app')
});

if (process.env.NODE_ENV === 'production') {
	window.ga = new GAnalytics('UA-XXXXXXXX-X');

	// Service Worker registration
	require('offline-plugin/runtime').install();
}
