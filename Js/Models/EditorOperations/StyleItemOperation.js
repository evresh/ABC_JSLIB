var StyleItemOperation = EditorOperation.extend({
    _getInitialState: function() {
        return this.get('target').css(this.get('property'));
    },
    _applyChanges: function(value) {
        if (value != this.getValue()) {
            this.get('target').css(this.get('property'), value);
            return value;
        }
    },
    _discardChanges: function() {
        if (this.get('changedState'))
            this.get('target')
                .css(this.get('property'), this.get('previousState') || this.get('initialState'));
    },
    _deleteChanges: function() {
        if (this.get('changedState'))
            this.get('target').css(this.get('property'), this.get('initialState'));
    },
    getValue: function() {
        return this.get('changedState') || this.get('previousState') || this.get('initialState');
    }
})