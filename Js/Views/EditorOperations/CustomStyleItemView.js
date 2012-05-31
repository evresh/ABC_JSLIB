var CustomStyleItemView = StyleItemView.extend({
    events: function() {
        return $.extend({}, StyleItemView.prototype.events, {
            'keyup .editStyleName': '_onEditName'
        });
    },
    render: function() {
        StyleItemView.prototype.render.apply(this);
        this.$('.editStyleName').off('blur').blur(_.bind(this._setNeedToSave, this));

        return this;
    },
    _onEditing: function(model) {
        var isEditing = this.model.get('isEditing');
        this.$('.styleValue,.editStyleButton').toggleClass('invisible', isEditing);
        this.$('.styleName').toggleClass('invisible', isEditing);
        this.$('.editStyleName').toggleClass('invisible', !isEditing);
        this.$('.editStyleValue,.saveStyleButton,.cancelStyleButton').toggleClass('invisible', !isEditing);
        if (!isEditing) {
            if (!this.model.get('property') && !this.model.getValue() && model) {
                this._cancel();
            } else {
                this._checkNeedToSave();
                this._refresh();
            }
        } else if (!this.model.get('property')) {
            this.$('.editStyleName').focus();
        } else {
            this.$('.editStyleValue').focus();
        }
    },
    _refresh: function() {
        var value = this.model.getValue();
        this.$('.styleValue').html(value);
        this.$('.editStyleValue').val(value);

        var name = this.model.get('property');
        this.$('.styleName').html(name);
        this.$('.editStyleName').val(name);
    },
    _onEditName: function(e) {
        this._needToSave = false;
        this.model.set('property', this.$('.editStyleName').val());
    },
    _cancel: function() {
        this._needToSave = false;
        this.model.remove();
        this.remove();
    }
})