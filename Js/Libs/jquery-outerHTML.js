jQuery.fn.outerHTML = function(html) {
    if (jQuery.isEmptyObject(this)) return '';
    if (html === undefined) {
        var str = "";
        this.each(function() {
            if (this.outerHTML !== undefined) str += this.outerHTML;
            else str += jQuery('<div></div>').append(this.cloneNode(true)).html();
        });
        return str;
    } else {
        if (this.get(0).outerHTML !== undefined) this.get(0).outerHTML = html;
        else this.replaceWith(html);
        return this;
    }
}
