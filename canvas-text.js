(function (root) {
  // base on http://namniak.github.io/canvas-text-wrapper/
  function CanvasTextWrapper(canvas, text, options) {
    'use strict';

    var defaults = {
      font: '18px Arial, sans-serif',
      sizeToFill: false,
      maxFontSizeToFill: false,
      lineHeight: 1,
      allowNewLine: true,
      lineBreak: 'auto',
      textAlign: 'left', // left/ center
      verticalAlign: 'top',
      justifyLines: false,
      paddingX: 0,
      paddingY: 0,
      fitParent: false,
      strokeText: false,
      renderHDPI: true,
      textDecoration: 'none',
      vertical: false,
      verticalRL: false,
      x: 0,
      y: 0,
    };

    var opts = {};

    for (var key in defaults) {
      opts[key] = options.hasOwnProperty(key) ? options[key] : defaults[key];
    }
    console.log('-->', opts.y);

    var context = canvas.getContext('2d');
    context.font = opts.font;
    context.textBaseline = 'bottom';

    var scale = 1;
    var devicePixelRatio = typeof global !== 'undefined' ? global.devicePixelRatio : root.devicePixelRatio;

    if (opts.renderHDPI && devicePixelRatio > 1) {
      var tempCtx = {};

      // store context settings in a temp object before scaling otherwise they will be lost
      for (var key in context) {
        tempCtx[key] = context[key];
      }

      var canvasWidth = canvas.width;
      var canvasHeight = canvas.height;
      scale = devicePixelRatio;

      canvas.width = canvasWidth * scale;
      canvas.height = canvasHeight * scale;
      canvas.style.width = canvasWidth * scale * 0.5 + 'px';
      canvas.style.height = canvasHeight * scale * 0.5 + 'px';

      // restore context settings
      for (var key in tempCtx) {
        try {
          context[key] = tempCtx[key];
        } catch (e) {}
      }

      context.scale(scale, scale);
    }

    var EL_WIDTH = (!opts.fitParent ? canvas.width : canvas.parentNode.clientWidth) / scale;
    var EL_HEIGHT = (!opts.fitParent ? canvas.height : canvas.parentNode.clientHeight) / scale;
    var MAX_TXT_WIDTH = EL_WIDTH - opts.paddingX * 2;
    var MAX_TXT_HEIGHT = EL_HEIGHT - opts.paddingY * 2;

    var fontSize = opts.font.match(/\d+(px|em|%)/g) ? +opts.font.match(/\d+(px|em|%)/g)[0].match(/\d+/g) : 18;
    var textBlockHeight = 0;
    var lines = [];
    var newLineIndexes = [];
    var textPos = { x: opts.x, y: opts.y };
    var lineHeight = 0;
    var fontParts;
    var multiNewLineDelimiter = '\u200B';

    text = handleMultipleNewline(text);
    setFont(fontSize);
    setLineHeight();
    validate();
    render();

    function handleMultipleNewline(text) {
      do {
        text = text.replace(/\n\n/g, '\n' + multiNewLineDelimiter + '\n');
      } while (text.indexOf('\n\n') > -1);
      return text;
    }

    function setFont(fontSize) {
      if (!fontParts) fontParts = !opts.sizeToFill ? opts.font.split(/\b\d+px\b/i) : context.font.split(/\b\d+px\b/i);
      context.font = fontParts[0] + fontSize + 'px' + fontParts[1];
    }

    function setLineHeight() {
      if (!isNaN(opts.lineHeight)) {
        lineHeight = fontSize * opts.lineHeight;
      } else if (opts.lineHeight.toString().indexOf('px') !== -1) {
        lineHeight = parseInt(opts.lineHeight);
      } else if (opts.lineHeight.toString().indexOf('%') !== -1) {
        lineHeight = (parseInt(opts.lineHeight) / 100) * fontSize;
      }
    }

    function reSize() {
      var max = MAX_TXT_WIDTH;
      var length = (lines.length + 1) * lineHeight;

      var canvasWidth = canvas.width;
      var canvasHeight = canvas.height;
      scale = devicePixelRatio;

      if (opts.vertical) {
        if (length > max) {
          canvasWidth = length * scale;
          console.log('---1--------', max, length);
        }
      } else {
        max = MAX_TXT_HEIGHT;
        if (length > max) {
          canvasHeight = length * scale;
          console.log('---2--------', max, length);
        }
      }

      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      //   canvas.style.width = canvasWidth * scale * 0.5 + 'px';
      //   canvas.style.height = canvasHeight * scale * 0.5 + 'px';

      EL_WIDTH = (!opts.fitParent ? canvas.width : canvas.parentNode.clientWidth) / scale;
      EL_HEIGHT = (!opts.fitParent ? canvas.height : canvas.parentNode.clientHeight) / scale;
      MAX_TXT_WIDTH = EL_WIDTH - opts.paddingX * 2;
      MAX_TXT_HEIGHT = EL_HEIGHT - opts.paddingY * 2;

      console.log(MAX_TXT_HEIGHT);
    }

    function render() {
      var max = MAX_TXT_HEIGHT;
      if (opts.vertical) {
        max = MAX_TXT_WIDTH;
      }

      if (opts.sizeToFill) {
        var wordsCount = text.trim().split(/\s+/).length;
        var newFontSize = 0;
        var fontSizeHasLimit = opts.maxFontSizeToFill !== false;

        do {
          if (fontSizeHasLimit) {
            if (++newFontSize <= opts.maxFontSizeToFill) {
              adjustFontSize(newFontSize);
            } else {
              break;
            }
          } else {
            adjustFontSize(++newFontSize);
          }
        } while (textBlockHeight < max && lines.join(' ').split(/\s+/).length == wordsCount);

        adjustFontSize(--newFontSize);
      } else {
        wrap();
      }

      if (opts.justifyLines && opts.lineBreak === 'auto') {
        justify();
      }

      setVertAlign();
      setHorizAlign();

      //   reSize();
      if (opts.vertical) {
        drawTextVertical();
      } else {
        drawText();
      }
    }

    function adjustFontSize(size) {
      setFont(size);
      lineHeight = size;
      wrap();
    }

    function wrap() {
      if (opts.allowNewLine) {
        var newLines = text.trim().split('\n');
        for (var i = 0, idx = 0; i < newLines.length - 1; i++) {
          idx += newLines[i].trim().split(/\s+/).length;
          newLineIndexes.push(idx);
        }
      }

      var words = text.trim().split(/\s+/);
      checkLength(words);
      breakText(words);

      textBlockHeight = lines.length * lineHeight;
    }

    function checkLength(words) {
      var testString, tokenLen, sliced, leftover;

      var max = MAX_TXT_WIDTH;
      if (opts.vertical) {
        max = MAX_TXT_HEIGHT;
      }

      words.forEach(function (word, index) {
        testString = '';
        tokenLen = context.measureText(word).width;

        if (tokenLen > max) {
          for (var k = 0; context.measureText(testString + word[k]).width <= max && k < word.length; k++) {
            testString += word[k];
          }

          sliced = word.slice(0, k);
          leftover = word.slice(k);
          words.splice(index, 1, sliced, leftover);
        }
      });
    }

    function breakText(words) {
      lines = [];
      var max = MAX_TXT_WIDTH;
      if (opts.vertical) {
        max = MAX_TXT_HEIGHT;
      }
      for (var i = 0, j = 0; i < words.length; j++) {
        lines[j] = '';

        if (opts.lineBreak === 'auto') {
          if (context.measureText(lines[j] + words[i]).width > max) {
            break;
          } else {
            while (context.measureText(lines[j] + words[i]).width <= max && i < words.length) {
              lines[j] += words[i] + ' ';
              i++;

              if (opts.allowNewLine) {
                for (var k = 0; k < newLineIndexes.length; k++) {
                  if (newLineIndexes[k] === i) {
                    j++;
                    lines[j] = '';
                    break;
                  }
                }
              }
            }
          }
          lines[j] = lines[j].trim();
        } else {
          lines[j] = words[i];
          i++;
        }
      }
    }

    function justify() {
      var maxLen, longestLineIndex, tokenLen;
      for (var i = 0; i < lines.length; i++) {
        tokenLen = context.measureText(lines[i]).width;

        if (!maxLen || tokenLen > maxLen) {
          maxLen = tokenLen;
          longestLineIndex = i;
        }
      }

      // fill lines with extra spaces
      var numWords, spaceLength, numOfSpaces, num, filler;
      var delimiter = '\u200A';
      for (i = 0; i < lines.length; i++) {
        if (i === longestLineIndex) continue;

        numWords = lines[i].trim().split(/\s+/).length;
        if (numWords <= 1) continue;

        lines[i] = lines[i].trim().split(/\s+/).join(delimiter);

        spaceLength = context.measureText(delimiter).width;
        numOfSpaces = (maxLen - context.measureText(lines[i]).width) / spaceLength;
        num = numOfSpaces / (numWords - 1);

        filler = '';
        for (var j = 0; j < num; j++) {
          filler += delimiter;
        }

        lines[i] = lines[i].trim().split(delimiter).join(filler);
      }
    }

    function underline(text, x, y) {
      var width = context.measureText(text).width;

      switch (context.textAlign) {
        case 'center':
          x -= width / 2;
          break;
        case 'right':
          x -= width;
          break;
      }

      context.beginPath();
      context.moveTo(x, y);
      context.lineTo(x + width, y);
      context.stroke();
    }

    function drawText() {
      var skipLineOnMatch = multiNewLineDelimiter + ' ';
      for (var i = 0; i < lines.length; i++) {
        textPos.y = parseInt(textPos.y) + lineHeight;
        if (lines[i] !== skipLineOnMatch) {
          context.fillText(lines[i], textPos.x, textPos.y);

          if (opts.strokeText) {
            context.strokeText(lines[i], textPos.x, textPos.y);
          }

          if (opts.textDecoration.toLocaleLowerCase() === 'underline') {
            underline(lines[i], textPos.x, textPos.y);
          }
        }
      }
    }

    // base on http://www.zhangxinxu.com/wordpress/?p=7362
    function drawTextVertical() {
      var skipLineOnMatch = multiNewLineDelimiter + ' ';
      for (var i = 0; i < lines.length; i++) {
        textPos.x = parseInt(textPos.x) + lineHeight;

        if (lines[i] !== skipLineOnMatch) {
          console.log(lines[i]);
          var arrText = lines[i].split('');
          var arrWidth = arrText.map(function (letter) {
            return context.measureText(letter).width;
          });

          console.log('arr width:', arrWidth);
          var align = context.textAlign;
          var baseline = context.textBaseline;
          var x = textPos.x;
          if (opts.verticalRL) {
            x = MAX_TXT_WIDTH - textPos.x;
          }
          var y = textPos.y + fontSize;
          console.log(x, textPos.y);

          if (align == 'left') {
            x = x + Math.max.apply(null, arrWidth) / 2;
          } else if (align == 'right') {
            x = x - Math.max.apply(null, arrWidth) / 2;
          }
          if (baseline == 'bottom' || baseline == 'alphabetic' || baseline == 'ideographic') {
            y = y - arrWidth[0] / 2;
          } else if (baseline == 'top' || baseline == 'hanging') {
            y = y + arrWidth[0] / 2;
          }

          context.textAlign = 'center';
          context.textBaseline = 'middle';
          // 开始逐字绘制
          arrText.forEach(function (letter, index) {
            // 确定下一个字符的纵坐标位置
            var letterWidth = arrWidth[index];
            // 是否需要旋转判断
            var code = letter.charCodeAt(0);
            if (code <= 256) {
              context.translate(x, y);
              // 英文字符，旋转90°
              context.rotate((90 * Math.PI) / 180);
              context.translate(-x, -y);
            } else if (index > 0 && text.charCodeAt(index - 1) < 256) {
              // offset fix
              y = y + arrWidth[index - 1] / 2;
            }
            context.fillText(letter, x, y);
            // 旋转坐标系还原成初始态
            context.setTransform(1, 0, 0, 1, 0, 0);
            // 确定下一个字符的纵坐标位置
            var letterWidth = arrWidth[index];
            y = y + letterWidth;
          });

          // 水平垂直对齐方式还原
          context.textAlign = align;
          context.textBaseline = baseline;
        }
      }
    }

    function setHorizAlign() {
      context.textAlign = opts.textAlign;

      if (opts.textAlign == 'center') {
        textPos.x += EL_WIDTH / 2;
      } else if (opts.textAlign == 'right') {
        textPos.x += EL_WIDTH - opts.paddingX;
      } else {
        textPos.x += opts.paddingX;
      }
    }

    function setVertAlign() {
      if (opts.verticalAlign == 'middle') {
        textPos.y += (EL_HEIGHT - textBlockHeight) / 2;
      } else if (opts.verticalAlign == 'bottom') {
        textPos.y += EL_HEIGHT - textBlockHeight - opts.paddingY;
      } else {
        textPos.y += opts.paddingY;
      }
    }

    function validate() {
      if (typeof text !== 'string') throw new TypeError('The second parameter must be a String.');

      if (isNaN(fontSize)) throw new TypeError('Cannot parse "font".');

      if (isNaN(lineHeight)) throw new TypeError('Cannot parse "lineHeight".');

      if (opts.textAlign.toLocaleLowerCase() !== 'left' && opts.textAlign.toLocaleLowerCase() !== 'center' && opts.textAlign.toLocaleLowerCase() !== 'right')
        throw new TypeError('Property "textAlign" must be set to either "left", "center", or "right".');

      if (opts.verticalAlign.toLocaleLowerCase() !== 'top' && opts.verticalAlign.toLocaleLowerCase() !== 'middle' && opts.verticalAlign.toLocaleLowerCase() !== 'bottom')
        throw new TypeError('Property "verticalAlign" must be set to either "top", "middle", or "bottom".');

      if (typeof opts.justifyLines !== 'boolean') throw new TypeError('Property "justifyLines" must be a Boolean.');

      if (isNaN(opts.paddingX)) throw new TypeError('Property "paddingX" must be a Number.');

      if (isNaN(opts.paddingY)) throw new TypeError('Property "paddingY" must be a Number.');

      if (typeof opts.fitParent !== 'boolean') throw new TypeError('Property "fitParent" must be a Boolean.');

      if (opts.lineBreak.toLocaleLowerCase() !== 'auto' && opts.lineBreak.toLocaleLowerCase() !== 'word') throw new TypeError('Property "lineBreak" must be set to either "auto" or "word".');

      if (typeof opts.sizeToFill !== 'boolean') throw new TypeError('Property "sizeToFill" must be a Boolean.');

      if (typeof opts.strokeText !== 'boolean') throw new TypeError('Property "strokeText" must be a Boolean.');

      if (typeof opts.renderHDPI !== 'boolean') throw new TypeError('Property "renderHDPI" must be a Boolean.');

      if (opts.textDecoration.toLocaleLowerCase() !== 'none' && opts.textDecoration.toLocaleLowerCase() !== 'underline')
        throw new TypeError('Property "textDecoration" must be set to either "none" or "underline".');
    }

    return lines;
  }

  if ('module' in root && 'exports' in module) {
    module.exports = CanvasTextWrapper;
  } else {
    root.CanvasTextWrapper = CanvasTextWrapper;
  }
})(this);
