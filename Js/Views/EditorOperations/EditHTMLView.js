var EditHTMLView = Backbone.View.extend({
    events: {
        'click .cancelButton': '_cancel',
        'click .doneButton': '_done'
    },
    initialize: function() {
        this._overlay = new EditorOverlayView();
        this._overlay.on('close', this._close, this);

        this.model
            .on('change:lastAction', this._changeVisibility, this)
            .on('change:isEditing', this._changeVisibility, this);
    },
    render: function() {
        var _this = this;

        this._overlay.render().setTitle('Edit HTML');

        this._mirror = CodeMirror(function(el) {
            _this.setElement($('<div>').html($('#editHtmlOverlay').html()));
            _this.$('.mirrorContainer').append(el);
            _this._overlay.setContent(_this.$el);
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

        return this;
    },
    _close: function() {
        if (this.model.get('lastAction') == EditorOperationAction.none)
            this.model.cancel();
        this.model.set('isEditing', false);
    },
    _changeVisibility: function() {
        var isOverlayVisible = this._overlay.$el.is(':visible');
        if (this.model.get('isEditing')) {
            switch (this.model.get('lastAction')) {
                case EditorOperationAction.complete:
                case EditorOperationAction.cancel:
                    if (isOverlayVisible)
                        this._overlay.close();
                    break;
                case EditorOperationAction.none:
                    if (!isOverlayVisible)
                        this._overlay.show({ target: this.model.get('target') });
                        this._mirror.setValue(this.model.getCurrentHTML());
                        this._mirror.focus();
                    break;
            }
        } else if (isOverlayVisible) {
            this._overlay.close();
        }
    },
    _cancel: function() {
        this.model.cancel();
    },
    _done: function() {
        this.model.complete();
    }
})