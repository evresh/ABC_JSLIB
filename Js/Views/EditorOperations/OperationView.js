var OperationView = Backbone.View.extend({
    events: {
        'click .cancelButton': '_cancel',
        'click .doneButton': '_done'
    },
    initialize: function() {
        this._overlay = new EditorOverlayView();
        this._overlay.on('close', this._close, this);

        if (this.model)
            this.setModel(this.model);
    },
    setModel: function(model) {
        if (this.model) {
            this.model
                .off('change:lastAction', this._changeVisibility, this)
                .off('change:isEditing', this._changeVisibility, this);
        }

        this.model = model;
        this.model
            .on('change:lastAction', this._changeVisibility, this)
            .on('change:isEditing', this._changeVisibility, this);
    },
    render: function() {
        var variant = this.model.get('variant');
        var templateId = variant.substr(0, 1).toLowerCase() + variant.substr(1) + 'Operation';
        var content = $('<div>').html($('#' + templateId).html());
        this._overlay.options.frame = this.options.frame;
        this._overlay.render().setContent(content);
        this.setElement(content);
        this._afterRender();

        return this;
    },
    _afterRender: function() { },
    _reset: function() { },
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
                    if (!isOverlayVisible) {
                        this._overlay.show({ target: this.model.get('target') });
                        this._reset();
                    }
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