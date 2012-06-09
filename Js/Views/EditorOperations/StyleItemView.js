var StyleItemView = Backbone.View.extend({
    events: {
        'click .styleValue': '_edit',
        'click .editStyleButton': '_edit',
        'click .saveStyleButton': '_save',
        'click .cancelStyleButton': '_cancel',
        'keyup .editStyleValue': '_onEditValue'
    },
    initialize: function() {
        this.model.on('change:isEditing', this._onEditing, this);
        this.model.on('stateResetted', this._refresh, this);
    },
    render: function() {
        this.$el.html(_.template($('#styleItem').html(), {
            name: this.model.get('property'),
            value: this.model.getValue(),
            isCustom: this.model.isCustom()
        }));
        this._onEditing();
        this.$('.editStyleValue').off('blur').blur(_.bind(this._setNeedToSave, this));

        return this;
    },
    _edit: function() {
        this.model.edit();
    },
    _onEditing: function() {
        var isEditing = this.model.get('isEditing');
        this.$('.styleValue,.editStyleButton').toggleClass('invisible', isEditing);
        this.$('.editStyleValue,.saveStyleButton,.cancelStyleButton').toggleClass('invisible', !isEditing);
        if (!isEditing)
            this._checkNeedToSave();

        this._refresh();
    },
    _save: function() {
        this._needToSave = false;
        this.model.apply(this.$('.editStyleValue').val());
        this.model.complete();
    },
    _cancel: function() {
        this._needToSave = false;
        this.model.cancel();
    },
    _refresh: function() {
        var value = this.model.getValue();
        this.$('.styleValue').html(value);
        this.$('.editStyleValue').val(value);
    },
    _onEditValue: function(e) {
        this._needToSave = false;
        if (e.keyCode == 13) // Enter
            this._save();
        else if (e.keyCode == 27) // Esc
            this._cancel();
        else
            this.model.apply(this.$('.editStyleValue').val());
    },
    _setNeedToSave: function() {
        this._needToSave = true;
    },
    _checkNeedToSave: function() {
        if (this._needToSave) {
            this._needToSave = false;
            this._save();
        }
    }
})