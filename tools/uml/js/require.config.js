requirejs.config({
	baseUrl: STATIC_URL,
	urlArgs: STATIC_VER,
	paths: {
		// jquery
		'jquery': 'js/jquery-1.10.2.min',
		'jquery.base64':'js/jquery.base64.min',
		'rawdeflate':'js/rawdeflate.min',
		"codemirror":'js/codemirror/lib/codemirror.min',
		'yaml':'js/codemirror/mode/yaml/yaml',
		'mustache':'js/mustache.min',
		'plantuml':'js/plantuml',
	},
	map: {
		'*': {
			'style': 'js/requirejs.css'
		}
	},
	shim: {
		'jquery': {
			exports: ['$', 'jQuery']
		},
		'jquery.base64':['jquery'],
		// 'codemirror':{
		// 	exports:['CodeMirror'],
		// 	deps:'yaml'
		// },
		// 'yaml':['codemirror']
		// 'Mustache':{
		// 	exports:'Mustache'
		// }
	}
});

// require('plantuml',function(uml){
// 	uml.do();
// });
