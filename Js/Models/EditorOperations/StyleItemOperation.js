var StyleItemOperation = EditorOperation.extend({
    initialize: function() {
        EditorOperation.prototype.initialize.apply(this);
        this.on('change:property', this._propertyChanged, this);
    },
    _getInitialState: function() {
        var property = this.get('property');
        return property ? this.getTargetElement().css(property) : null;
    },
    edit: function() {
        EditorOperation.prototype.edit.apply(this);
        this.get('target').on('updated', this._targetUpdated, this);
    },
    stopEdit: function() {
        EditorOperation.prototype.stopEdit.apply(this);
        this.get('target').off('updated', this._targetUpdated, this);
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
        var property = this.get('property');
        if (property) {
            var targetElement = this.getTargetElement();
            if (targetElement.css(property) != newValue)
                targetElement.css(property, newValue);
        }
    },
    _propertyChanged: function() {
        var oldProperty = this.previous('property');
        if (oldProperty)
            this.getTargetElement().css(oldProperty, this.get('initialState'));

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
            this.set('initialState', state);
            this.set('previousState', null);
            this.apply(state);
        }

        this.trigger('stateResetted');
    },
    complete: function() {
        var previousProperty = this.get('previousProperty');
        if (previousProperty && previousProperty != this.get('property'))
            StyleOperationStateSynchronizer.remove(this, previousProperty);

        this.set('previousProperty', this.get('property'));
        EditorOperation.prototype.complete.apply(this);

        StyleOperationStateSynchronizer.update(this);
    },
    remove: function() {
        EditorOperation.prototype.remove.apply(this);

        StyleOperationStateSynchronizer.remove(this);
    },
    matchToTargetIfNew: function(change) {
        if (this.get('isNew')) {
            if (change) {
                this.apply(this.getTargetElement().css(this.get('property')));
            } else {
                this.resetState({
                    initialState: this._getInitialState(),
                    changedState: null
                });
            }
        }
    },
    _targetUpdated: function(sender) {
        if (sender != this)
            this.apply(this.getTargetElement().css(this.get('property')));
    }
})