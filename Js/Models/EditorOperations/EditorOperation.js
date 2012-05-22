var EditorOperationStatus = {
    none: 0,
    cancelled: 2,
    completed: 3
}
var EditorOperation = Backbone.Model.extend({
    defaults: {
        type: '',
        initialState: null,
        changedState: null,
        status: EditorOperationStatus.none,
        isOpen: false
    },
    initialize: function() {
        this.set('initialState', this._getInitialState());
    },
    isAllowed: function() {
        return true;
    },
    _getInitialState: function() {
        //throw new Error('Initial state should be initialized');
    },
    _innerApply: function(state) {
        alert('Not implemented yet');
    },
    apply: function(state) {
        if (this._innerApply(state))
            this.set('changedState', state);
    },
    complete: function() {
        this.set('status', EditorOperationStatus.completed);
    },
    cancel: function() {
        this.unset('changedState');
        this._innerApply(this.get('initialState'));
        this.set('status', EditorOperationStatus.cancelled);
    }
});