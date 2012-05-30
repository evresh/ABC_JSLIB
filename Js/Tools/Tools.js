var Tools = {
    _hexDigits: new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"),
    RGBtoHex: function(rgb) {
        var reg = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+),*\s*(\d*)\)$/);
        return reg ? {
                r: reg[1],
                g: reg[2],
                b: reg[3],
                a: reg[4] == '' ? 255 : reg[4]
            }
            : rgb;
    },
    hex: function(x) {
        return isNaN(x) ? "00": this._hexDigits[(x - x % 16) / 16] + this._hexDigits[x % 16];
    }
}