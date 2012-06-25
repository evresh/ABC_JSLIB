var SynchronizedOperation = EditorOperation.extend({
    initialize: function() {
        EditorOperation.prototype.initialize.apply(this);
        this.get('target').on(this._getTargetUpdatedEvent(), this._targetUpdated, this);
    },
    complete: function() {
        if (this.get('overridedBy')) {
            this.get('overridedBy').get('originalStates').initialState = this.get('originalStates').initialState;
            this.get('overridedBy').set('overridesAny', this.get('overridesAny'));
        }

        this._setOriginalStates();
        this.unset('overridedBy');

        EditorOperation.prototype.complete.apply(this);

        this._raiseTargetUpdatedEvent();
    },
    remove: function() {
        if (this.get('lastAction') == EditorOperationAction.remove)
            return;

        this._resetInitialStateIfNeed();

        var wasNew = this.get('isNew');
        EditorOperation.prototype.remove.apply(this);

        if (!wasNew)
            this._raiseTargetUpdatedEvent();

        this.get('target').off(this._getTargetUpdatedEvent(), this._targetUpdated, this);

        this.unset('overridedBy').unset('overridesAny');
    },
    _getTargetUpdatedEvent: function(property) {
        return 'target_' + ((_.isUndefined(property) ? this.get('property') : property) || '') + '_updated';
    },
    _raiseTargetUpdatedEvent: function() {
        this.get('target').trigger(this._getTargetUpdatedEvent(), this);
    },
    _targetUpdated: function(sender) {
        if (sender == this)
            return;

        if (sender.get('property') == this.get('property') && (!sender.get('isTemp') || this.get('isTemp'))) {
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
                        this.set(this.get('originalStates'));
                        if (!this.get('isNew'))
                            this.complete();
                    }
                } else if (sender.get('overridedBy') == this) {
                    this.get('originalStates').initialState = sender.get('originalStates').initialState;
                    this.set('overridesAny', sender.get('overridesAny'));
                }
            }
        }
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
    }
})

SynchronizedOperation.counter = 0;