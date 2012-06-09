var HTMLOperation = EditorOperation.extend({
    getValue: function() {
        var state = this.get('changedState') || this._getPreviousState();
        return state.outerHTML();
    },
    _getInitialState: function() {
        return this.getTargetElement();
    },
    edit: function() {
        EditorOperation.prototype.edit.apply(this);
        if (this.get('changedState')) {
            var state = this.get('changedState');
            state.each(function() {
                if (!(this.tagName == 'SCRIPT' || $(this).closest('body').length))
                    state = state.not($(this));
            });
            this.set('changedState', state);
        }
    },
    _applyChanges: function(html) {
        var previousState = this._getPreviousState();
        var targetElement = this.get('changedState') || previousState;
        var parent = targetElement.parent();
        var parentTag = parent.get(0).tagName;
        var cleanedHtml = this._stripWhite(html, parentTag);

        if (!!html && !cleanedHtml)
            return;

        if (this._stripWhite(previousState.outerHTML(), parentTag) == cleanedHtml) {
            this._discardChanges();
            this.set('changedState', this.get('previousState'));
        } else if (html == '') {
            this.set('changedState', $('<span>'));
            return this._changeTarget(targetElement, this.get('changedState'));
        } else if (this._stripWhite(targetElement.outerHTML(), parentTag) != cleanedHtml) {
            html = this._formatContent(html, parentTag);
            try {
                var doc = this.get('target').getDocument()[0];
                var s = doc.createElement(parent.get(0).tagName);
                s.innerHTML = html;
                var hasScripts = false;
                for (var i = 0; i < s.childNodes.length; i++) {
                    if (s.childNodes[i].tagName === 'SCRIPT') {
                        hasScripts = true;
                        var script = doc.createElement('script'),
                        elem = s.childNodes[i],
                        head = doc.getElementsByTagName("head")[0] || doc.documentElement,
                        data = (elem.text || elem.textContent || elem.innerHTML || '');
                        script.type = 'text/javascript'
                        try {
                            script.appendChild(doc.createTextNode(data));
                        } catch(e) {
                            script.text = data;
                        }
                        head.insertBefore(script, head.firstChild);
                        head.removeChild(script);
                    }
                }
                var newTargetElement = $(s.innerHTML);
                if (hasScripts) {
                    var buffer = $('<div>').hide().appendTo($(doc).find('body'));
                    var brokenScripts = false;
                    try {
                        buffer.append(newTargetElement);
                    } catch (e) {
                        brokenScripts = true;
                    }
                    buffer.remove();
                    if (brokenScripts)
                        return;
                }

                this.set('changedState', newTargetElement);
                return this._changeTarget(targetElement, newTargetElement);
            } catch (e) {
                Debug.trace('HTMLOperation._innerApply() -> ' + e);
            }
        }
    },
    _discardChanges: function(skipDOMChange) {
        if (this.get('changedState'))
            this._changeTarget(this.get('changedState'), this._getPreviousState(), skipDOMChange);
    },
    _deleteChanges: function() {
        if (this.get('changedState'))
            this._changeTarget(this.get('changedState'), this.get('initialState'));
    },
    _changeTarget: function(targetElement, newTargetElement, skipDOMChange) {
        if (targetElement[0] != newTargetElement[0]) {
            if (!skipDOMChange)
                targetElement.replaceWith(newTargetElement);
            this.get('target').set('element', newTargetElement);
        }
        return newTargetElement;
    },
    _stripWhite: function(content, tag) {
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
    },
    _formatContent: function(content, tag) {
        var s = document.createElement(tag);
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
        s.innerHTML = s.innerHTML.replace(/<br mce_bogus="1">/g, "");
        return s.innerHTML;
    },
    isOverriding: function(operation) {
        return this.get('type') == operation.get('type')
            && operation.get('target').get('element')[0] == (this._getPreviousState())[0];
    }
})