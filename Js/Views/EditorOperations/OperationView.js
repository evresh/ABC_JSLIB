var OperationView = Backbone.View.extend({
    events: function() {
        var events = {
            'click .cancelButton': '_cancel',
            'click .doneButton': '_done'
        }

        var extendedEvents = this._getExtendedEvents();
        if (extendedEvents)
            $.extend(events, extendedEvents);

        return events;
    },
    initialize: function() {
        this._overlay = new EditorOverlayView({ showFooter: true });
        this._overlay.on('close', this._overlayClosed, this);
        this._overlay.on('toggleMaximizing', this._toggleMaximizing, this);

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
        this._overlay.options.frame = this.options.frame;
        this._overlay.options.maximizable = !!this.maximizable;
        this._overlay.render();

        var overlayName = this.model.get('type') + 'Operation';
        /*
        var templateContainer = $('#' + overlayName);
        if (templateContainer.length) {
            var content = $('<div>').html(templateContainer.html());
            this._overlay.setContent(content);
        }
        */

        this._overlay.$el.addClass(overlayName);
        this.setElement(this._overlay.$el);
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
    maximized: function(value) {
        if (_.isBoolean(value))
            this._overlay.options.maximized = value;
        else
            return this._overlay.options.maximized;
    },
    _getExtendedEvents: function() { },
    _afterRender: function() { },
    _reset: function() { },
    _overlayClosed: function() {
        if (this.model.get('lastAction') == EditorOperationAction.none)
            this.model.cancel();
        this.model.set('isEditing', false);
        if (this.maximizable)
            this.maximized(false);
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
    },
    _updateOverlayPosition: function() {
        this._overlay.attachToTarget();
    },
    _toggleMaximizing: function(info) {
    }
})