var HTMLOperation = EditorOperation.extend({
    _getInitialState: function() {
        return $(this.get('target')).outerHTML();
    },
    _innerApply: function(state) {
        $(this.get('target')).outerHTML(state);
    }
})