var HTMLOperation = EditorOperation.extend({
    getCurrentHTML: function() {
        var state = this.get('changedState') || this.get('previousState') || this.get('initialState');
        return state.outerHTML();
    },
    _getInitialState: function() {
        return this.get('target');
    },
    _beforeEdit: function() {
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
        var previousState = this.get('previousState') || this.get('initialState');
        var target = this.get('changedState') || previousState;
        var parent = target.parent();
        var parentTag = parent.get(0).tagName;
        var cleanedHtml = this._stripWhite(html, parentTag);

        if (this._stripWhite(previousState.outerHTML(), parentTag) == cleanedHtml) {
            this._discardChanges();
            this.set('changedState', this.get('previousState'));
        } else if (html == '') {
            this.set('changedState', $('<span>'));
            return this._changeTarget(target, this.get('changedState'));
        } else if (this._stripWhite(target.outerHTML(), parentTag) != cleanedHtml) {
            html = this._formatContent(html, parentTag);
            try {
                var doc = target[0].ownerDocument;
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
                var newTarget = $(s.innerHTML);
                if (hasScripts) {
                    var buffer = $('<div>').hide().appendTo($(doc).find('body'));
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

                this.set('changedState', newTarget);
                return this._changeTarget(target, newTarget);
            } catch (e) {
                Debug.trace('HTMLOperation._innerApply() -> ' + e);
            }
        }
    },
    _discardChanges: function() {
        if (this.get('changedState'))
            this._changeTarget(this.get('changedState'), this.get('previousState') || this.get('initialState'));
    },
    _deleteChanges: function() {
        if (this.get('changedState'))
            this._changeTarget(this.get('changedState'), this.get('initialState'));
    },
    _changeTarget: function(target, newTarget) {
        if (target[0] != newTarget[0]) {
            target.replaceWith(newTarget);
            this.set('target', newTarget);
        }
        return newTarget;
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
            && operation.get('target')[0] == (this.get('previousState') || this.get('initialState'))[0];
    }
})