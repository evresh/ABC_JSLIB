var ChangeImageView = OperationView.extend({
    _afterRender: function() {
        this._overlay.setTitle('Change Image');
        this._overlay.setContent($('#changeImageOperation').html());
    },
    _reset: function() {
        window.ImageUploadListener = $.extend({}, Backbone.Events);

        this._views = [
            this._srcView = new InputStyleView({ model: this.model.getItem('src'), disableImmediateChange: true }),
            new InputStyleView({ model: this.model.getItem('title') }),
            new InputStyleView({ model: this.model.getItem('alt') }),
            new InputStyleView({ model: this.model.getItem('width'), attrs: { size: '4' } }),
            new InputStyleView({ model: this.model.getItem('height'), attrs: { size: '4' } })
        ];

        var _this = this;
        $.each(this._views, function(i, view) {
            view.render().$el.appendTo(_this.$('.' + view.model.get('property') + 'Field').empty());
        });

        this.model.getItem('src').on('change:changedState', this._srcChanged, this);
        ImageUploadListener
            .on('imageUploadCompleted', this._imageUploadCompleted, this)
            .on('imageUploadStarted', this._imageUploadStarted, this)
            .on('imageUploadError', this._imageUploadError, this);
        this._srcChanged();
    },
    _clear: function() {
        $.each(this._views, function(i, view) {
            view.remove();
        });

        this.model.getItem('src').off('change:changedState', this._srcChanged, this);
        ImageUploadListener
            .off('imageUploadCompleted', this._imageUploadCompleted, this)
            .off('imageUploadStarted', this._imageUploadStarted, this)
            .off('imageUploadError', this._imageUploadError, this);

        this._views = this._srcView = window.ImageUploadListener = null;
    },
    _srcChanged: function() {
        this.$('.previewContainer img').attr('src', this.model.getItem('src').getValue());
    },
    _imageUploadStarted: function() {
        this._srcView.setAvailability(false);
        this.$('.previewContainer img').attr('src', '/img/loading.gif');
    },
    _imageUploadCompleted: function(imageUrl) {
        var value = this.model.getItem('src').getValue();
        if (imageUrl == value)
            this._srcChanged();
        else
            this.model.getItem('src').apply(imageUrl);

        this._srcView.setAvailability(true);
    },
    _imageUploadError: function(errorType) {
        if (errorType == 'invalidFileType')
            alert('Please select a proper file type');
        this._srcView.setAvailability(true);
        this._srcChanged();
    }
});