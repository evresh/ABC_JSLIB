var ChangeImageSRCOperation = AttributeItemOperation.extend({
    initialize: function() {
        this.set('property', 'src');
        AttributeItemOperation.prototype.initialize.apply(this);
    },
    _applyChanges: function(src) {
        AttributeItemOperation.prototype._applyChanges.call(this, src);

        if (src) {
            var _this = this;
            var img = new Image();
            img.onload = function() { _this.trigger('imageLoaded'); }
            img.src = src;
        }

        return src;
    }
})