var OperationView = Backbone.View.extend({
    events: {
        'click .cancelButton': '_cancel',
        'click .doneButton': '_done'
    },
    initialize: function() {
        this._overlay = new EditorOverlayView();
        this._overlay.on('close', this._overlayClosed, this);

        if (this.model)
            this.setModel(this.model);
    },
    setModel: function(model) {
        if (this.model) {
            this.model.off('change:isEditing', this._changeVisibility, this);
        }

        this.model = model;
        this.model.on('change:isEditing', this._changeVisibility, this);
    },
    render: function() {
        var templateId = this.model.get('type') + 'Operation';
        var content = $('<div>').html($('#' + templateId).html());
        this._overlay.options.frame = this.options.frame;
        this._overlay.render().setContent(content);
        this.setElement(content);
        this._afterRender();

        return this;
    },
    show: function() {
        this._overlay.show({ target: this.model.get('target') });
        this._reset();
    },
    close: function(skipEvent) {
        return this._overlay.close(skipEvent);
    },
    _afterRender: function() { },
    _reset: function() { },
    _overlayClosed: function() {
        if (this.model.get('lastAction') == EditorOperationAction.none)
            this.model.cancel();
        this.model.set('isEditing', false);
    },
    _changeVisibility: function() {
        var isOverlayVisible = this._overlay.$el.is(':visible');
        if (this.model.get('isEditing')) {
            if (!isOverlayVisible)
                this.show();
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