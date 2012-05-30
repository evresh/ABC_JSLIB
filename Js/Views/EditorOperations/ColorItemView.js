var ColorItemView = StyleItemView.extend({
    render: function() {
        this.$el.html(_.template($('#colorItem').html(), {
            name: this.model.get('property')
        }));

        this._onEditing();

        return this;
    },
    _onEditing: function() {
        var isEditing = this.model.get('isEditing');
        var _this = this;
        if (isEditing) {
            var c = this.model.getColor();
            this.$('.picker').jPicker({
                    color: {
                        active: new $.jPicker.Color({
                            ahex: c == 'transparent' ? '00000000' : c
                        })
                    }
                },
                function(color, context) {
                    _this._setValueFromPicker(color);
                    _this.model.complete();
                },
                function(color, context) {
                    _this._setValueFromPicker(color);
                    _this._refresh();
                },
                function(color, context) {
                    _this._cancel();
                }
            );
        } else {
            this._refresh();
            this.$('table.jPicker').remove();
        }
    },
    _refresh: function() {
        var value = this.model.getColor();
        if (value != 'transparent')
            value = '#' + value;
        this.$('.styleColor').toggleClass('noColor', value == 'transparent').css('background', value);
        this.$('.colorValue').html(value);
    },
    _setValueFromPicker: function(color) {
        var all = color.val('all');
        var clr = 'transparent';
        if (all)
            clr = 'rgba(' + all.r + ',' + all.g + ',' + all.b + ',' + all.a + ')';
        this.model.apply(clr);
    }
})