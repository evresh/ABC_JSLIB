var EditorOperationAction = {
    none: 0,
    cancel: 1,
    complete: 2,
    remove: 3
}
var EditorOperation = Backbone.Model.extend({
    defaults: {
        id: new Date().getTime(),
        variant: '',
        initialState: null,
        changedState: null,
        previousState: null,
        lastAction: EditorOperationAction.none,
        isEditing: false
    },
    initialize: function() {
        this.set('initialState', this._getInitialState());
        this.on('change:isEditing', this._onEditing, this);
    },
    isAllowed: function() {
        return true;
    },
    _getInitialState: function() {
        return null;
    },
    _beforeEdit: function() {},
    _onEditing: function() {
        if (this.get('isEditing')) {
            this._beforeEdit();
            this.set('previousState', this.get('changedState'));
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
        if (newState)
            this.set('changedState', newState);
    },
    complete: function() {
        this.set('lastAction', EditorOperationAction.complete);
    },
    cancel: function() {
        this._discardChanges();
        this.set('changedState', this.get('previousState'));
        this.set('lastAction', EditorOperationAction.cancel);
    },
    remove: function() {
        this._deleteChanges();
        this.unset('changedState');
        this.unset('previousState');
        this.set('lastAction', EditorOperationAction.remove);
    }
});