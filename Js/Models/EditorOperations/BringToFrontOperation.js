var BringToFrontOperation = StyleItemOperation.extend({
    _zIndex: 2500000,
    initialize: function() {
        this.set('property', 'z-index');
        StyleItemOperation.prototype.initialize.apply(this);
    },
    _applyChanges: function(value) {
        if (value) {
            this._applyNewValue(this._zIndex);
            return this._zIndex;
        } else {
            this._applyNewValue(this.get('initialState'));
            return this.get('initialState');
        }
    },
    getValue: function() {
        var value = this.get('changedState') || this.get('initialState');
        return value == this._zIndex;
    }
})