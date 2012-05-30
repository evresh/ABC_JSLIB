var ColorItemOperation = StyleItemOperation.extend({
    _getInitialState: function() {
        return this.get('target').css(this.get('property'));
    },
    getColor: function() {
        var value = this.getValue();
        if (value == 'transparent') {
            return value;
        } else {
            var color = Tools.RGBtoHex(value);
            if (color.a == 0)
                return 'transparent';

            return $.jPicker.ColorMethods.rgbaToHex(color).substr(0,6);
        }
    }
})