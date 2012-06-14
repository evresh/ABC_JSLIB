var ChangeImageOperation = OperationGroup.extend({
    _getInitialItems: function() {
        return new Backbone.Collection([
            new AttributeItemOperation({ property: 'src', target: this.get('target') })
                .on('change:changedState', this._processImage, this),
            new AttributeItemOperation({ property: 'title', target: this.get('target') }),
            new AttributeItemOperation({ property: 'alt', target: this.get('target') }),
            new StyleItemOperation({ property: 'width', target: this.get('target') }),
            new StyleItemOperation({ property: 'height', target: this.get('target') })
        ]);
    },
    _processImage: function() {
        var src = this.getItem('src').getValue();
        if (src) {
            var _this = this;
            var img = new Image();
            img.onload = function() {
                _this.get('target').updated(_this);
            };
            img.onerror = function() {
                _this.get('target').updated(_this);
            }
            img.src = src;
        } else {
            this.get('target').updated(this);
        }
    }
});