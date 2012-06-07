var ColorItemOperation = StyleItemOperation.extend({
    _getInitialState: function() {
        return this.getTargetElement().css(this.get('property'));
    },
    getColor: function() {
        var value = this.getValue();
        if (value == 'transparent' || value.substr(0,1) == '#') {
            return value.replace('#', '');
        } else {
            var color = Tools.RGBtoHex(value);
            if (color.a == 0)
                return 'transparent';

            return $.jPicker.ColorMethods.rgbaToHex(color).substr(0,6);
        }
    }
})