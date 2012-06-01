var EditHTMLView = OperationView.extend({
    _afterRender: function() {
        var _this = this;

        this._overlay.setTitle('Edit HTML');

        this._mirror = CodeMirror(function(el) {
            _this.$('.mirrorContainer').append(el);
        },
        {
            mode: 'text/html',
            lineNumbers: true,
            lineWrapping: false,
            reindentOnLoad: true,
            onChange: function() {
                _this.model.apply(_this._mirror.getValue());
            },
            onFocus: function() {
            }
        });
    },
    _reset: function() {
        this._mirror.setValue(this.model.getValue());
        this._mirror.refresh();
        this._mirror.focus();
    }
})