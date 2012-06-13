var AttributeItemOperation = EditorOperation.extend({
    _getInitialState: function() {
        return this.getTargetElement().attr(this.get('property'));
    },
    _applyChanges: function(value) {
        this._applyNewValue(value);
        return value;
    },
    _applyNewValue: function(newValue) {
        var targetElement = this.getTargetElement();
        var property = this.get('property');
        if (targetElement.attr(property) != newValue)
            targetElement.attr(property, newValue);
    },
    _discardChanges: function() {
        if (this.isChanged())
            this._applyNewValue(this._getPreviousState());
    },
    _deleteChanges: function() {
        this._applyNewValue(this.get('initialState'));
    }
})