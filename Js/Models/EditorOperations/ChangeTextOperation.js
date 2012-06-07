var ChangeTextOperation = EditorOperation.extend({
    _getInitialState: function() {
        return this.getTargetElement().text();
    },
    _applyChanges: function(value) {
        this.getTargetElement().text(value);
        return value;
    },
    _discardChanges: function() {
        if (_.isString(this.get('changedState')))
            this.getTargetElement().text(this._getPreviousState());
    },
    _deleteChanges: function() {
        if (this.get('changedState'))
            this.getTargetElement().text(this.get('initialState'));
    }
})