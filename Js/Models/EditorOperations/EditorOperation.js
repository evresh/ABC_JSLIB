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
        initialState: null,
        changedState: null,
        previousState: null,
        lastAction: EditorOperationAction.none,
        isEditing: false,
        switchedTo: null
    },
    initialize: function() {
        this.set('initialState', this._getInitialState());
        this.on('change:isEditing', this._onEditing, this);
    },
    _getInitialState: function() {
        return null;
    },
    _beforeEdit: function() {},
    _onEditing: function() {
        if (this.get('isEditing')) {
            this._beforeEdit();
            if (!this.get('isNew'))
                this.set('previousState', this.get('changedState'));
            this.unset('switchedTo');
        }
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
    apply: function(data) {
        var newState = this._applyChanges(data);
        if (newState) {
            this.set('changedState', newState);
            return true;
        }
    },
    complete: function() {
        this.set('isNew', false);
        this.set('lastAction', EditorOperationAction.complete);
        this.set('isEditing', false);
    },
    cancel: function(skipDOMChange) {
        this._discardChanges(skipDOMChange);
        this.set('changedState', this.get('previousState'));
        this.set('lastAction', EditorOperationAction.cancel);
        this.set('isEditing', false);
    },
    remove: function() {
        this._deleteChanges();
        this.unset('changedState');
        this.unset('previousState');
        this.set('lastAction', EditorOperationAction.remove);
        this.set('isEditing', false);
    },
    isOverriding: function(operation) {
        return false;
    },
    switchTo: function(newType) {
        if (EditorOperations.isValidTypeForOperation(this, newType)) {
            var newOperation = EditorOperations.create(newType, this.get('target'));
            newOperation.set('initialState', this.get('previousState') || this.get('initialState'));
            newOperation.set('changedState', this.get('changedState'));
            this.set('switchedTo', newOperation);
            this.cancel(true);
        } else {
            Debug.trace('EditorOperationAction.switchTo() -> invalid operation type');
        }
    }
});