var ChangeBackgroundImageView = OperationView.extend({
    _afterRender: function() {
        this._overlay.setTitle('Change Background Image');
        this._overlay.setContent($('#changeBackgroundImageOperation').html());
    },
    _reset: function() {
        window.ImageUploadListener = $.extend({}, Backbone.Events);

        this._inputView = new InputStyleView({ model: this.model, disableImmediateChange: true });
        this._inputView.render().$el.appendTo(this.$('.srcField').empty());

        this.model.on('change:changedState', this._changed, this);
        ImageUploadListener
            .on('imageUploadCompleted', this._imageUploadCompleted, this)
            .on('imageUploadStarted', this._imageUploadStarted, this)
            .on('imageUploadError', this._imageUploadError, this);

        this._changed();
    },
    _changed: function() {
        var value = this.model.getValue();
        if (value) {
            this.$('.previewContainer img').show().attr('src', value);
        } else {
            this.$('.previewContainer img').hide();
        }
    },
    _clear: function() {
        this._inputView.remove();

        this.model.off('change:changedState', this._changed, this);
        ImageUploadListener
            .off('imageUploadCompleted', this._imageUploadCompleted, this)
            .off('imageUploadStarted', this._imageUploadStarted, this)
            .off('imageUploadError', this._imageUploadError, this);

        this._inputView = window.ImageUploadListener = null;
    },
    _imageUploadStarted: function() {
        this._inputView.setAvailability(false);
        this.$('.previewContainer img').attr('src', '/img/loading.gif');
    },
    _imageUploadCompleted: function(imageUrl) {
        var value = this.model.getValue();
        if (imageUrl == value)
            this._changed();
        else
            this.model.apply(imageUrl);
        this._inputView.setAvailability(true);
    },
    _imageUploadError: function(errorType) {
        if (errorType == 'invalidFileType')
            alert('Please select a proper file type');
        this._inputView.setAvailability(true);
        this._changed();
    }
})