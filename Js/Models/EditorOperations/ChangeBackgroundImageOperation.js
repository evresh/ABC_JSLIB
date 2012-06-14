var ChangeBackgroundImageOperation = StyleItemOperation.extend({
    initialize: function() {
        this.set('property', 'background-image');
        StyleItemOperation.prototype.initialize.apply(this);
    },
    _applyChanges: function(value) {
        if (!value) {
            value = 'none';
        } else if (value.toLowerCase() != 'none' && value.indexOf('url(') != 0) {
            value = 'url(' + value + ')';
        }

        return StyleItemOperation.prototype._applyChanges.call(this, value);
    },
    getValue: function() {
        var value = StyleItemOperation.prototype.getValue.apply(this);
        if (value.toLowerCase() == 'none')
            return '';
        return value.replace(/^url\(('|")?(.*?)("|')?\)$/, '$2');
    }
})