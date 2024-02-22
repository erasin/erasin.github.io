import { loadJs, loadCss } from './utils.js'

export async function katex_render(math_node) {
  loadJs('https://cdn.jsdelivr.net/npm/webfontloader@1.6.28/webfontloader.js', () => {
    window.WebFontConfig = {
      custom: {
        families: [
          'KaTeX_AMS',
          'KaTeX_Caligraphic:n4,n7',
          'KaTeX_Fraktur:n4,n7',
          'KaTeX_Main:n4,n7,i4,i7',
          'KaTeX_Math:i4,i7',
          'KaTeX_Script',
          'KaTeX_SansSerif:n4,n7,i4',
          'KaTeX_Size1',
          'KaTeX_Size2',
          'KaTeX_Size3',
          'KaTeX_Size4',
          'KaTeX_Typewriter',
        ],
      },
    };
  });
  loadCss('https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.css');
  loadJs('https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.js', () => {
    loadJs('https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/contrib/auto-render.min.js', () => {
      math_node.forEach(function(item, _index) {
        renderMathInElement(item, {
          delimiters: [
            {
              left: '$$',
              right: '$$',
              display: true,
            },
            {
              left: '$',
              right: '$',
              display: false,
            },
            {
              left: '\\(',
              right: '\\)',
              display: false,
            },
            {
              left: '\\[',
              right: '\\]',
              display: true,
            },
          ],
          ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'],
          ignoredClasses: ['tag'],
        });
      });
    });
  });
}
