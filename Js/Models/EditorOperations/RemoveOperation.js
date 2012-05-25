var RemoveOperation = EditorOperation.extend({
    _getInitialState: function() {
        return this.get('target').css('display');
    },
    _onEditing: function() {
        if (this.get('isEditing')) {
            this.apply();
            this.complete();
            this.set('isEditing', false);
        }
    },
    _applyChanges: function() {
        this.get('target').hide();
        return this.get('target').css('display');
    },
    _discardChanges: function() {
        if (this.get('changedState'))
            this.get('target').css('display', this.get('initialState'));
    },
    _deleteChanges: function() {
        this._discardChanges();
    }
});