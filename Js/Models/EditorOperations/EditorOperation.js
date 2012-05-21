var EditorOperation = Backbone.Model.extend({
    defaults: {
        type: '',
        initialState: null,
        changedState: null
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
        if (!_.isEqual(state, this.get('initialState'))) {
            this.set('changedState', state);
            this._innerApply(state);
        }
    },
    cancel: function() {
        this.unset('changedState');
        this._innerApply(this.get('initialState'));
        this.trigger('cancel');
    }
});