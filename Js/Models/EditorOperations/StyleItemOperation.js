var StyleItemOperation = EditorOperation.extend({
    initialize: function() {
        EditorOperation.prototype.initialize.apply(this);
        this.on('change:property', this._propertyChanged, this);
        this.get('target').on('updated', this._targetUpdated, this);
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
        if (this.previous('property'))
            this._reset();

        this.set('initialState', this._getInitialState());
        this.unset('changedState');
        this.unset('previousState');
        this._applyChanges(this.getValue());

    },
    isCustom: function() {
        return this.get('group') == 'Custom';
    },
    complete: function() {
        if (this.get('overridedBy')) {
            this.get('overridedBy').get('originalStates').initialState = this.get('originalStates').initialState;
            this.get('overridedBy').set('overridesAny', this.get('overridesAny'));
        }

        this._setOriginalStates();
        this.unset('overridedBy');

        EditorOperation.prototype.complete.apply(this);

        this.get('target').updated(this);
    },
    remove: function() {
        this._resetInitialStateIfNeed();

        EditorOperation.prototype.remove.apply(this);

        this.get('target').updated(this);
        this.get('target').off('updated', this._targetUpdated, this);

        this.unset('overridedBy').unset('overridesAny');
    },
    _reset: function() {
        this._resetInitialStateIfNeed();

        this._deleteChanges();

        this.get('target').updated(this);
        this.unset('overridedBy').unset('overridesAny');
    },
    _resetInitialStateIfNeed: function() {
        if (!this.get('overridesAny') && !this.get('overridedBy') && this.get('originalStates'))
            this.set('initialState', this.get('originalStates').initialState);
    },
    _setOriginalStates: function() {
        this.set('originalStates', {
            initialState: this.get('initialState'),
            previousState: this.get('previousState'),
            changedState: this.get('changedState')
        });
    },
    _targetEdited: function(sender) {
        if (sender != this)
            this.apply(this.getTargetElement().css(this.get('property')));
    },
    _targetUpdated: function(sender) {
        if (sender == this)
            return;

        if (sender instanceof StyleItemOperation && (!sender.get('isTemp') || this.get('isTemp'))) {
            if (sender.get('property') == this.get('property')) {
                var lastAction = sender.get('lastAction');
                if (lastAction == EditorOperationAction.complete) {
                    if (!this.get('overridedBy')) {
                        this.set('overridedBy', sender);
                        if (this.get('isNew'))
                            this._setOriginalStates();
                        else
                            sender.set('overridesAny', true);
                    }

                    this.set('initialState', sender.getValue());
                    this.unset('previousState');
                    this.unset('changedState');
                } else if (lastAction == EditorOperationAction.remove) {
                    if (this.get('overridedBy') == sender) {
                        if (sender.get('overridedBy')) {
                            this.set('overridedBy', sender.get('overridedBy'));
                        } else {
                            this.unset('overridedBy');
                            $.extend(this.attributes, this.get('originalStates'));
                            if (!this.get('isNew'))
                                this.complete();
                        }
                    } else if (sender.get('overridedBy') == this) {
                        this.get('originalStates').initialState = sender.get('originalStates').initialState;
                        this.set('overridesAny', sender.get('overridesAny'));
                    }
                }
            }
        }
    }
})