var HTMLOperation = EditorOperation.extend({
    _getInitialState: function() {
        return $(this.get('target')).outerHTML();
    },
    _innerApply: function(state) {
        var target = this.get('target');
        if (target.get(0).tagName == 'HEAD') {
            return false;
        } else if (state == '') {
            this._replaceTarget($('<span>'));
            return true;
        } else if (this._stripWhite(target.outerHTML()) != this._stripWhite(state)) {
            state = this._formatContent(state);
            if (state) {
                try {
                    var frameDoc = $('iframe')[0].contentDocument || $('iframe')[0].contentWindow.document;
                    var parent = target.parent();
                    var s = document.createElement(parent.get(0).tagName);
                    s.innerHTML = state;
                    var hasScripts = false;
                    for (var i = 0; i < s.childNodes.length; i++) {
                        if (s.childNodes[i].tagName === 'SCRIPT') {
                            hasScripts = true;
                            var script = frameDoc.createElement('script'),
                            elem = s.childNodes[i],
                            head = frameDoc.getElementsByTagName("head")[0] || frameDoc.documentElement,
                            data = (elem.text || elem.textContent || elem.innerHTML || '');
                            script.type = 'text/javascript'
                            try {
                                script.appendChild(frameDoc.createTextNode(data));
                            } catch(e) {
                                script.text = data;
                            }
                            head.insertBefore(script, head.firstChild);
                            head.removeChild(script);
                        }
                    }
                    var newTarget = $(s.innerHTML);
                    if (hasScripts) {
                        var buffer = $('<div>').hide().appendTo($(frameDoc).find('body'));
                        var brokenScripts = false;
                        try {
                            buffer.append(newTarget);
                        } catch (e) {
                            brokenScripts = true;
                        }
                        buffer.remove();
                        if (brokenScripts)
                            return false;
                    }

                    this._replaceTarget(newTarget);
                    return true;
                } catch (e) {
                    Debug.trace('HTMLOperation._innerApply() -> ' + e);
                }
            }
        }
    },
    _replaceTarget: function(newTarget) {
        this.get('target').replaceWith(newTarget);
        this.set('target', newTarget);
    },
    _stripWhite: function(content) {
        try {
            var tag = this.get('target').parent().get(0).tagName;
            var node = document.createElement(tag);
            node.innerHTML = content;
            function strip(n) {
                if (n.nodeType == 8) {
                    n.parentNode.removeChild(n);
                } else if (n.nodeType == 3) {
                    if (n.nodeValue.replace(/([\t\r\n]*)/g, '') == '')
                        n.parentNode.removeChild(n);
                    else if (n.parentNode && n.parentNode.tagName === 'SCRIPT')
                        n.nodeValue = n.nodeValue.replace(/([\t\r\n])/g, "\\$1");
                    else
                        n.nodeValue = n.nodeValue.replace(/[\t\r\n]/g, '').replace(/ +/g, ' ');
                } else {
                    for (var i = n.childNodes.length - 1; i >= 0; i--)
                        strip(n.childNodes[i]);
                }
            }
            strip(node);
            return node.innerHTML;
        } catch(e) {
            Debug.trace('HTMLOperation._stripWhite() -> ' + e);
        }
    },
    _formatContent: function(content) {
        try {
            var target = this.get('target');
            var s = document.createElement(target.parent().get(0).tagName);
            s.innerHTML = content;
            for (var i = 0; i < s.childNodes.length; i++) {
                if (s.childNodes[i].nodeType == 3 && s.childNodes[i].nodeValue.replace(/(\r|\n|\t)/g, '') == '')
                    s.removeChild(s.childNodes[i--]);
                else
                    break;
            }
            for (var i = 0; i < s.childNodes.length; i++) {
                if (s.childNodes[i].nodeType == 3 && s.childNodes[i].nodeValue.replace(/(\r|\n|\t)/g, '') != '') {
                    var n = document.createElement('span');
                    n.innerHTML = s.childNodes[i].nodeValue.replace(/ +/g, ' ');
                    s.replaceChild(n, s.childNodes[i]);
                }
            }
            return s.innerHTML;
        } catch(e) {
            Debug.trace('HTMLOperation._formatContent() -> ' + e);
        }
    }
})