var ChangeImageOperation = OperationGroup.extend({
    initialize: function() {
        OperationGroup.prototype.initialize.apply(this);
        this.set('uploadedImages', new UserUploadedImages());
    },
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
                _this.get('target').edited(_this);
            };
            img.onerror = function() {
                _this.get('target').edited(_this);
            }
            img.src = src;
        } else {
            this.get('target').edited(this);
        }
    }
});