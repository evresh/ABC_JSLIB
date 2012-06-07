var RemoveOperation = EditorOperation.extend({
    _getInitialState: function() {
        return this.getTargetElement().css('display');
    },
    _onEditing: function() {
        if (this.get('isEditing')) {
            this.apply();
            this.complete();
            this.set('isEditing', false);
        }
    },
    _applyChanges: function() {
        this.getTargetElement().hide();
        return this.getTargetElement().css('display');
    },
    _deleteChanges: function() {
        if (this.get('changedState'))
            this.getTargetElement().css('display', this.get('initialState'));
    }
});