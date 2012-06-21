var ChangeBackgroundImageView = BaseChangeImageView.extend({
    _getSrcModel: function() {
        return this.model;
    },
    _afterRender: function() {
        this._overlay.setTitle('Change Background Image');
        this._overlay.setContent($('#changeBackgroundImageOperation').html());
    },
    _srcChanged: function() {
        var value = this.model.getValue();
        if (value) {
            this.$('.previewContainer img').show().attr('src', value);
        } else {
            this.$('.previewContainer img').hide();
        }
    }
})