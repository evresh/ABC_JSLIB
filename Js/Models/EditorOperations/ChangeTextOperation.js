var ChangeTextOperation = EditorOperation.extend({
    _getInitialState: function() {
        return this.get('target').text();
    },
    _applyChanges: function(value) {
        this.get('target').text(value);
        return value;
    },
    _discardChanges: function() {
        if (_.isString(this.get('changedState')))
            this.get('target').text(this._getPreviousState());
    },
    _deleteChanges: function() {
        if (this.get('changedState'))
            this.get('target').text(this.get('initialState'));
    }
})