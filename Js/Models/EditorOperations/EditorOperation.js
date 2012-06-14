var EditorOperationAction = {
    none: 0,
    cancel: 1,
    complete: 2,
    remove: 3
}
var EditorOperation = Backbone.Model.extend({
    defaults: {
        isNew: true,
        type: '',
        target: null,
        initialState: null,
        changedState: null,
        previousState: null,
        lastAction: EditorOperationAction.none,
        isEditing: false,
        switchedTo: null
    },
    initialize: function() {
        if (!this.get('initialState'))
            this.set('initialState', this._getInitialState());
        this.on('change:changedState', this._stateChanged, this);
    },
    _getInitialState: function() {
        return null;
    },
    _getPreviousState: function() {
        if (!_.isUndefined(this.get('previousState')) && !_.isNull(this.get('previousState')))
            return this.get('previousState');

        return this.get('initialState');
    },
    _applyChanges: function(data) {
        alert('Not implemented yet');
    },
    _discardChanges: function() {
        alert('Not implemented yet');
    },
    _deleteChanges: function() {
        alert('Not implemented yet');
    },
    _stateChanged: function() {
        if (this.get('isEditing'))
            this.get('target').updated(this);
    },
    getTargetElement: function() {
        return this.get('target').get('element');
    },
    apply: function(data) {
        var newState = this._applyChanges(data);
        if (!_.isUndefined(newState)) {
            this.set('changedState', newState);
            return true;
        }
    },
    complete: function() {
        this.set('isNew', false);
        this.set('previousState', this.get('changedState'));
        this.set('lastAction', EditorOperationAction.complete);
        this.stopEdit();

        this.trigger('action', this);
    },
    cancel: function(skipDOMChange) {
        this._discardChanges(skipDOMChange);
        this.set('changedState', this.get('previousState'));
        this.set('lastAction', EditorOperationAction.cancel);
        this.stopEdit();

        this.trigger('action', this);
    },
    remove: function() {
        this._deleteChanges();
        this.unset('changedState');
        this.unset('previousState');
        this.set('lastAction', EditorOperationAction.remove);
        this.stopEdit();
        this.set('isNew', true);

        this.trigger('action', this);
    },
    isOverriding: function(operation) {
        return false;
    },
    switchTo: function(newType) {
        var newOperation = EditorOperation.createMain(newType, this.get('target'));
        if (newOperation) {
            newOperation.set('initialState', this._getPreviousState());
            newOperation.set('changedState', this.get('changedState'));
            this.set('switchedTo', newOperation);
            this.cancel(true);
        }
    },
    getValue: function() {
        if (this.isChanged())
            return this.get('changedState');

        return this._getPreviousState();
    },
    edit: function() {
        this.set('isEditing', true);
        this.unset('switchedTo');
    },
    stopEdit: function() {
        this.set('isEditing', false);
    },
    isChanged: function() {
        return !_.isUndefined(this.get('changedState')) && !_.isNull(this.get('changedState'));
    }
});