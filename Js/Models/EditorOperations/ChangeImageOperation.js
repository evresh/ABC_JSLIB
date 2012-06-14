var ChangeImageOperation = OperationGroup.extend({
    _getInitialItems: function() {
        return new Backbone.Collection([
            new ChangeImageSRCOperation({ target: this.get('target') })
                .on('imageLoaded', this._imageLoaded, this),
            new AttributeItemOperation({ property: 'title', target: this.get('target') }),
            new AttributeItemOperation({ property: 'alt', target: this.get('target') }),
            new StyleItemOperation({ property: 'width', target: this.get('target') }),
            new StyleItemOperation({ property: 'height', target: this.get('target') })
        ]);
    },
    _imageLoaded: function() {
        this.get('target').updated(this);
    }
});