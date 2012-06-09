var RemoveOperation = EditorOperation.extend({
    _getInitialState: function() {
        return this.getTargetElement().css('display');
    },
    edit: function() {
        EditorOperation.prototype.edit.apply(this);
        this.apply();
        this.complete();
        this.stopEdit();
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