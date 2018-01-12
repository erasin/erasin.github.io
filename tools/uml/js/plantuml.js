var uml = {
	encode64 : function(data) {
		r = "";
		for (i=0; i<data.length; i+=3) {
			if (i+2==data.length) {
				r +=this.append3bytes(data.charCodeAt(i), data.charCodeAt(i+1), 0);
			} else if (i+1==data.length) {
				r += this.append3bytes(data.charCodeAt(i), 0, 0);
			} else {
				r += this.append3bytes(data.charCodeAt(i), data.charCodeAt(i+1), data.charCodeAt(i+2));
			}
		}
		return r;
	},

	append3bytes : function(b1, b2, b3) {
		c1 = b1 >> 2;
		c2 = ((b1 & 0x3) << 4) | (b2 >> 4);
		c3 = ((b2 & 0xF) << 2) | (b3 >> 6);
		c4 = b3 & 0x3F;
		r = "";
		r += this.encode6bit(c1 & 0x3F);
		r += this.encode6bit(c2 & 0x3F);
		r += this.encode6bit(c3 & 0x3F);
		r += this.encode6bit(c4 & 0x3F);
		return r;
	},

	encode6bit : function(b) {
		if (b < 10) {
			return String.fromCharCode(48 + b);
		}
		b -= 10;
		if (b < 26) {
			return String.fromCharCode(65 + b);
		}
		b -= 26;
		if (b < 26) {
			return String.fromCharCode(97 + b);
		}
		b -= 26;
		if (b == 0) {
			return '-';
		}
		if (b == 1) {
			return '_';
		}
		return '?';
	}
};

uml.do = function(){
	var plantUmlUrl = 'http://www.plantuml.com/plantuml';
	
	require(["js/codemirror/lib/codemirror.min",'js/codemirror/mode/yaml/yaml','js/codemirror/keymap/emacs'],function(CodeMirror){

		var meditor = CodeMirror.fromTextArea(document.getElementById("code"), {
			lineNumbers: true,
			mode:'yaml',
			styleActiveLine: true,
			matchBrackets: true,
			viewportMargin: Infinity,
			autofocus: true
		});

		meditor.setSize("100%",window.innerHeight*0.97);

		$(window).on('resize', function(event) {
			event.preventDefault();
			meditor.setSize("100%",window.innerHeight*0.97);
		});

		meditor.on('change',function(e,o){
			var timer = 0;
			clearTimeout (timer);
			timer = setTimeout(function() {
				$loader = $('#loader');
				$loader.css('display', 'block');

				var code =e.getValue();
				code = unescape(encodeURIComponent(code));
				var deflated_code = deflate(code, 9);
				var encoded_code = uml.encode64(deflated_code);

				// $('#diagram').attr('src', plantUmlUrl + encoded_code)
				$loader.css('display', 'none');
				$('#uml_png').attr('href',plantUmlUrl +'/png/' + encoded_code).show();
				$('#uml_svg').attr('href',plantUmlUrl +'/svg/' + encoded_code).show();

				var data = { url : plantUmlUrl + '/svg/' + encoded_code };
				require(['js/mustache.min'],function(Mustache){
					var output = Mustache.render('<embed src="{{url}}" type="image/svg+xml" />', data);
					console.log(output);
					$('#uml').html(output);
				});
			}, 1000);
		});
	});
};

// 兼容 AMD
if (typeof define !== 'undefined' && define.amd){
	define('plantuml',["jquery","jquery.base64","rawdeflate"],function(){
		return uml;
	});
}else{
	// uml.do();
}
