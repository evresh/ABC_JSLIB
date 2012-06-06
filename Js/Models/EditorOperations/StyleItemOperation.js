var StyleItemOperation = EditorOperation.extend({
    initialize: function() {
        EditorOperation.prototype.initialize.apply(this);
        this.on('change:property', this._propertyChanged, this);
    },
    _getInitialState: function() {
        var property = this.get('property');
        return property ? this.get('target').css(property) : null;
    },
    _applyChanges: function(value) {
        this._applyNewValue(value);
        return value;
    },
    _discardChanges: function() {
        if (this.get('changedState'))
            this._applyNewValue(this._getPreviousState());
    },
    _deleteChanges: function() {
        this._applyNewValue(this.get('initialState'));
    },
    _applyNewValue: function(newValue) {
        var property = this.get('property');
        if (property)
            this.get('target').css(property, newValue);
    },
    _propertyChanged: function() {
        var oldProperty = this.previous('property');
        if (oldProperty)
            this.get('target').css(oldProperty, this.get('initialState'));

        this.set('initialState', this._getInitialState());
        this.unset('changedState');
        this.unset('previousState');
        this._applyChanges(this.getValue());
    },
    isCustom: function() {
        return this.get('group') == 'Custom';
    },
    resetState: function(state) {
        if (!_.isUndefined(state.changedState) || !_.isUndefined(state.initialState)) {
            $.extend(this.attributes, state);
            this._applyChanges(this.getValue());
        } else {
            this.apply(state);
            this.set('initialState', state);
        }

        this.trigger('stateResetted');
    },
    complete: function() {
        var previousProperty = this.get('previousProperty');
        if (previousProperty && previousProperty != this.get('property'))
            StyleOperationStateSynchronizer.remove(this, previousProperty);

        StyleOperationStateSynchronizer.update(this);

        this.set('previousProperty', this.get('property'));
        EditorOperation.prototype.complete.apply(this);
    },
    remove: function() {
        EditorOperation.prototype.remove.apply(this);

        StyleOperationStateSynchronizer.remove(this);
    },
    matchToTargetIfNew: function() {
        if (this.get('isNew')) {
            this.resetState({
                initialState: this._getInitialState(),
                changedState: null
            });
        }
    }
})