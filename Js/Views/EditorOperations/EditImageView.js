var EditImageView = OperationView.extend({
    _afterRender: function() {
        this._overlay.setTitle('Edit Image');
        this._overlay.setContent($('#editImageOperation').html());
        this._overlay.$el.find('.overlayFooter .leftAligned').hide().append(
            '<div id="avpw_header_wrapper"><div id="avpw_header" style="position:static;margin-left:0;height:0;"><span>Powered by </span><a href="http://www.aviary.com" target="_blank" style="vertical-align: middle;"> </a></div></div>'        );

        this._loadingDeferred = $.Deferred();
        this._imageEditor = new Aviary.Feather({
            apiKey: '4c7c79bb4',
            openType: 'inject',
            theme: 'darkblue',
            tools: 'rotate,flip,crop,blemish,colors,saturation,brightness,contrast,drawing,text,blur,sharpen',
            appendTo: 'imageEditor',
            onLoad: _.bind(this._editorLoaded, this),
            onReady: _.bind(this._editorReady, this),
            onSave: _.bind(this._imageSaved, this)
        });
    },
    _editorLoaded: function() {
        $('#avpw_photo_content').append($('#avpw_control_undoredo')).append('<div id="_aviary_error"></div>');
        $('#avpw_lftArrow').addClass('overlayButton').html('&#9664;');
        $('#avpw_rghtArrow').addClass('overlayButton').html('&#9654;');
        this._loadingDeferred.resolve();
        this._loadingDeferred = null;
    },
    _editorReady: function() {
        this.$('#imageEditor').show();
        this.$('.imageEditorLoading').hide();
        this._overlay.$el.find('.overlayFooter .leftAligned').show();
    },
    _imageSaved: function(imageId, newSrc) {
        this.model.apply(newSrc);
        this.model.complete();
    },
    _reset: function() {
        this.$('#imageEditor').hide();
        this.$('.imageEditorLoading').show();
        if (this._loadingDeferred)
            $.when(this._loadingDeferred).done(_.bind(this._launchEditor, this));
        else
            this._launchEditor();
    },
    _launchEditor: function() {
        if (this._overlay.$el.is(':visible')) {
            $('#tempEditorImage').remove();
            $('<img>').attr('id', 'tempEditorImage').attr('src', this.model.getValue()).hide().appendTo('body');

            this._imageEditor.launch({ image: 'tempEditorImage', url: this.model.getValue() });
        }
    },
    _clear: function() {
        this._imageEditor.close();
    },
    _done: function() {
        this._toggleButtons(true);
        this._imageEditor.save();
    }
});