
/* hello */
const interval = 50;
const bodyElem = document.getElementsByTagName("body")[0];
const terminalElem = document.getElementById("terminal-output");
const htmlElem = document.getElementById("html-output");
const styleElem = document.createElement("style");

// code block states
let isHtml = false;
let isCss = false;

// character states
let isInComment = false;
let isInInteger = false;
let isInString = false;
let prevAsterisk = false;
let prevSlash = false;

let terminalString = "";
let htmlString = "";
let preformatted_string;
let s;



bodyElem.appendChild(styleElem);

const message = `
@
/*
 * ...                  
 *
 * ...hello? 
 *
 * Oh hey! What's up?  It's me.. elliottprogrammer!
 */
 
 /* I'm just here programming.. trying some stuff out..  */
  
 /* The text I'm writing here in this window..,   */
 /* I am also writing simultaneously into the DOM <style> element. */ 
 
 
 /* So that means I can control the css styles here on this page, */
 /* right now, in real time.. */

 /* Confusing? ..  Here.. Let me show you..  */

 /* Let's change the background color of this window.. */
 
#terminal-output {
    background-color: #fff;
}

/* Uhh.. I don't like that..  */

/* Let's change it back!  */

#terminal-output {
    background-color: #222;
    border: 1px solid cyan;
}

/* You see?.. Ok, so let's play around a little..  */

/* How about I move this window around..? */

#terminal {
    transform: translate(-80%, 30%);
}

/* Whoa!!!  Lol!  */

/* Ok.., now I'll move it back. */

#terminal {
    transform: translate(0, 0);
}
 
/* And now lets write some HTML to the DOM..  */
~<h1>Bryan Elliott0</h1>
`;

const message2 = `
~<h1>Bryan Elliott Resume</h1>
<p>This is a paragraph</p>
`

function htmlToDomElements(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}

const syntaxHighlightCSS = (terminalText, char) => {
    let styledText = terminalText;

    if (char.match(/[\r\n]/)) {
        styledText = terminalText.replace(/^(\/\/[^\r\n]*)$[\r\n]{1}$/m, "<em class=\"comment\">$1</em>\n");
    }
    if (char == '/') {
        // comments
        styledText = terminalText.replace(/(\/\*[^\/]+\*\/)$/, "<em class=\"comment\">$1</em>");
    }
    if (char == '{') {
        // css selectors
        styledText = terminalText.replace(/^([#.a-zA-Z][^{]+)\{$/m, "<span class=\"selector\">$1</span> "+char);
    }
    if (char == ';') {
        // match css prop: value
        let matches = terminalText.match(/([a-z-]+)(?=:):([^;]+)(?=;$)/);
        if (matches) {
            // match numbers & units
            let styledValue = matches[2].replace(/([0-9.]+(?:%|px|em|rem|vh|vh|pt|pc|vmin|vmax))/g, "<span class=\"int\">$1</span>");
            // match #hex colors
            styledValue = styledValue.replace(/(#[0-9a-zA-Z]{6}|#[0-9a-zA-Z]{3})/, "<span class=\"hex\">$1</span>");
            // Build styled css prop: value
            styledText = terminalText.replace(/([a-z-]+)(?=:):([^;]+)(?=;$)/, "<span class=\"key\">$1</span>: <span class=\"value\">"+styledValue.trim()+"</span>"); 
        }
    }

    return styledText;
}

// write char
const writeChar = (char) => {
    
    // flag to set writing html status
    if (char === '~') {
        isCss = false;
        isHtml = !isHtml;
        char = '';
    }
    // flag to set writing css status
    if (char === '@') {
        isCss = !isCss;
        char = '';
    }


    if (isCss) {
        // write to <style> element
        styleElem.innerHTML += char;
        // write to terminal
        terminalElem.innerHTML += char;
        // syntax highlight terminal css text
        terminalElem.innerHTML = syntaxHighlightCSS(terminalElem.innerHTML, char);
    } else if (isHtml) {
        terminalElem.innerHTML += char;
        htmlString += char;
        if (char.match(/[\r\n]/)) {
            // htmlElem.innerHTML = htmlElem.innerHTML + htmlToDomElements(htmlString); 
            htmlElem.appendChild(htmlToDomElements(htmlString));
            htmlString = '';
        }
    } else {
        terminalString += char;
    }

    // set states    
    prevAsterisk = (char == "*");
    prevSlash = (char == "/") && !isInComment;
    openInteger = (char.match(/[0-9]/) || (isInInteger && char.match(/[\.\%pxems]/))) ? true : false;
    if (char == '"') { isInString = !isInString; }

    // write char to terminal
    //terminalElem.innerHTML = terminalString;
    

}

// write all the chars
var randomPause = Math.floor(Math.random() * 6) + 3;
const writeChars = (message, index, interval) => { 
    if (index < message.length) {
        terminalElem.scrollTop = terminalElem.scrollHeight;
        writeChar(message[index++]);
        if( index == randomPause) {
            randomPause = Math.floor(Math.random() * 40) + (index + 4);
            setTimeout(() => {
                writeChars(message, index, interval);
            }, interval + 180);
        } else {
            setTimeout(() => {
                writeChars(message, index, interval);
            }, interval);
        }
        
    }
}

writeChars(message, 0, 20);