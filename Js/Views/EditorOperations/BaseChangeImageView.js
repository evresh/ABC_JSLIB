var BaseChangeImageView = OperationView.extend({
    _templateSelector: null,
    _srcView: null,
    _getExtendedEvents: function() {
        return {
            'click .loadUploadedImages': '_loadUploadedImages',
            'click .uploadedImage span': '_uploadedImageClick'
        };
    },
    _getSrcModel: function() {
    },
    _getUploadedImages: function() {
        return this.model.get('uploadedImages');
    },
    _srcChanged: function() {
        this.$('.previewContainer img').attr('src', this._getSrcModel().getValue());
    },
    _showInternal: function() {
        this.$('.uploadedImages')
            .find('.loadUploadedImages').show().end()
            .find('.loadingImage, .warningMessage').hide().end()
            .find('ul').empty().end();

        this._srcView = new InputStyleView({ model: this._getSrcModel(), disableImmediateChange: true });
        this._srcView.render().$el.appendTo(this.$('.srcField').empty());

        window.ImageUploadListener = $.extend({}, Backbone.Events);

        this._getSrcModel().on('change:changedState', this._srcChanged, this);
        this._getUploadedImages()
            .on('reset', this._uploadedImagesResetted, this)
            .on('add', this._addUploadedImage, this);

        ImageUploadListener
            .on('imageUploadCompleted', this._imageUploadCompleted, this)
            .on('imageUploadStarted', this._imageUploadStarted, this)
            .on('imageUploadError', this._imageUploadError, this);

        this._srcChanged();
    },
    _removeListeners: function() {
        OperationView.prototype._removeListeners.apply(this);

        this._getSrcModel().off('change:changedState', this._srcChanged, this);
        this._getUploadedImages()
            .off('reset', this._uploadedImagesResetted, this)
            .off('add', this._addUploadedImage, this);

        ImageUploadListener
            .off('imageUploadCompleted', this._imageUploadCompleted, this)
            .off('imageUploadStarted', this._imageUploadStarted, this)
            .off('imageUploadError', this._imageUploadError, this);
    },
    _clear: function() {
        OperationView.prototype._clear.apply(this);

        this._srcView.remove();

        this._srcView = window.ImageUploadListener = null;
    },
    _imageUploadStarted: function() {
        this._srcView.setAvailability(false);
        this.$('.previewContainer img').attr('src', '/img/loading.gif');
    },
    _imageUploadCompleted: function(imageUrl) {
        var value = this._getSrcModel().getValue();
        if (imageUrl == value)
            this._srcChanged();
        else
            this._getSrcModel().apply(imageUrl);

        this._srcView.setAvailability(true);
        this._getUploadedImages().addImage(imageUrl);
    },
    _imageUploadError: function(errorType) {
        if (errorType == 'invalidFileType')
            alert('Please select a proper file type');
        this._srcView.setAvailability(true);
        this._srcChanged();
    },
    _loadUploadedImages: function() {
        this.$('.uploadedImages .loadUploadedImages').hide();
        this.$('.uploadedImages .loadingImage').show();
        this._getUploadedImages().fetch();
    },
    _uploadedImagesResetted: function() {
        var images = this._getUploadedImages();
        var _this = this;

        this.$('.uploadedImages .loadingImage').hide();
        if (!images.size()) {
            this.$('.uploadedImages .warningMessage').show();
        } else {
            images.each(function(image) {
                _this._addUploadedImage(image);
            });
        }
    },
    _addUploadedImage: function(image) {
        if (!this.$('.uploadedImages .loadUploadedImages').is(':visible'))
            this.$('.uploadedImages ul').append('<li class="uploadedImage"><span><img src="' + image.get('src') + '" /></span></li>');
    },
    _uploadedImageClick: function(e) {
        this._getSrcModel().apply($(e.currentTarget).find('img').attr('src'));
    }
});