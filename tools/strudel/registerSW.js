if('serviceWorker' in navigator) {window.addEventListener('load', () => {navigator.serviceWorker.register('/tools/strudel/sw.js', { scope: '/tools/strudel/' })})}