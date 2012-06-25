var StyleItemOperation = SynchronizedOperation.extend({
    initialize: function() {
        SynchronizedOperation.prototype.initialize.apply(this);
        this.on('change:property', this._propertyChanged, this);
    },
    _getInitialState: function() {
        var property = this.get('property');
        return property ? this.getTargetElement().css(property) : null;
    },
    edit: function() {
        EditorOperation.prototype.edit.apply(this);
        this.get('target').on('edited', this._targetEdited, this);
    },
    stopEdit: function() {
        EditorOperation.prototype.stopEdit.apply(this);
        this.get('target').off('edited', this._targetEdited, this);
    },
    _applyChanges: function(value) {
        this._applyNewValue(value);
        return value;
    },
    _discardChanges: function() {
        if (this.isChanged())
            this._applyNewValue(this._getPreviousState());
    },
    _deleteChanges: function() {
        this._applyNewValue(this.get('initialState'));
    },
    _applyNewValue: function(newValue) {
        var property = this.previous('property') || this.get('property');
        if (property) {
            var targetElement = this.getTargetElement();
            if (targetElement.css(property) != newValue)
                targetElement.css(property, newValue);
        }
    },
    _propertyChanged: function() {
        if (this.previous('property')) {
            this._resetInitialStateIfNeed();

            this._deleteChanges();

            this._raiseTargetUpdatedEvent();
            this.unset('overridedBy').unset('overridesAny');
        }

        this.get('target')
            .off(this._getTargetUpdatedEvent(this.previous('property') || null), this._targetUpdated, this)
            .on(this._getTargetUpdatedEvent(), this._targetUpdated, this);

        this.set('initialState', this._getInitialState());
        this.unset('changedState');
        this.unset('previousState');
        this._applyChanges(this.getValue());

    },
    isCustom: function() {
        return this.get('group') == 'Custom';
    },
    _targetEdited: function(sender) {
        if (sender != this)
            this.apply(this.getTargetElement().css(this.get('property')));
    }
})