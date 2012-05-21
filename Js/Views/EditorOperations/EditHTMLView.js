var EditHTMLView = Backbone.View.extend({
    render: function() {
        var _this = this;

        var overlay = new EditorOverlayView().render().setTitle('Edit HTML');
        overlay.on('close', this._close, this);

        var mirror = CodeMirror(function(el) {
            overlay.setContent(el);
            overlay.show({ target: _this.model.get('target') });
        },
        {
            mode: 'text/html',
            lineNumbers: true,
            lineWrapping: false,
            reindentOnLoad: true,
            onChange: function() {
            },
            onFocus: function() {
            }
        });
        mirror.setValue(this.model.get('changedState') || this.model.get('initialState'))
    },
    _close: function() {
        this.model.cancel();
    }
})