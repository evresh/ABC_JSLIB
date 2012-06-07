    /*
 * jquery.event.drag - v 2.0.0
 * Copyright (c) 2010 Three Dub Media - http://threedubmedia.com
 * Open Source MIT License - http://threedubmedia.com/code/license
 */
(function(f) {
    f.fn.drag = function(b, a, d) {
        var e = typeof b == "string" ? b: "",
        k = f.isFunction(b) ? b: f.isFunction(a) ? a: null;
        if (e.indexOf("drag") !== 0) e = "drag" + e;
        d = (b == k ? a: d) || {};
        return k ? this.bind(e, d, k) : this.trigger(e)
    };
    var i = f.event,
    h = i.special,
    c = h.drag = {
        defaults: {
            which: 1,
            distance: 0,
            not: ":input",
            handle: null,
            relative: false,
            drop: true,
            click: false
        },
        datakey: "dragdata",
        livekey: "livedrag",
        add: function(b) {
            var a = f.data(this, c.datakey),
            d = b.data || {};
            a.related += 1;
            if (!a.live && b.selector) {
                a.live = true;
                i.add(this, "draginit." + c.livekey, c.delegate)
            }
            f.each(c.defaults,
            function(e) {
                if (d[e] !== undefined) a[e] = d[e]
            })
        },
        remove: function() {
            f.data(this, c.datakey).related -= 1
        },
        setup: function() {
            if (!f.data(this, c.datakey)) {
                var b = f.extend({
                    related: 0
                },
                c.defaults);
                f.data(this, c.datakey, b);
                i.add(this, "mousedown", c.init, b);
                this.attachEvent && this.attachEvent("ondragstart", c.dontstart)
            }
        },
        teardown: function() {
            if (!f.data(this, c.datakey).related) {
                f.removeData(this, c.datakey);
                i.remove(this, "mousedown", c.init);
                i.remove(this, "draginit", c.delegate);
                c.textselect(true);
                this.detachEvent && this.detachEvent("ondragstart", c.dontstart)
            }
        },
        init: function(b) {
            var a = b.data,
            d;
            if (! (a.which > 0 && b.which != a.which)) if (!f(b.target).is(a.not)) if (! (a.handle && !f(b.target).closest(a.handle, b.currentTarget).length)) {
                a.propagates = 1;
                a.interactions = [c.interaction(this, a)];
                a.target = b.target;
                a.pageX = b.pageX;
                a.pageY = b.pageY;
                a.dragging = null;
                d = c.hijack(b, "draginit", a);
                if (a.propagates) {
                    if ((d = c.flatten(d)) && d.length) {
                        a.interactions = [];
                        f.each(d,
                        function() {
                            a.interactions.push(c.interaction(this, a))
                        })
                    }
                    a.propagates = a.interactions.length;
                    a.drop !== false && h.drop && h.drop.handler(b, a);
                    c.textselect(false);
                    i.add($('.testPage')[0].contentDocument || $('.testPage')[0].contentWindow.document, "mousemove mouseup", c.handler, a);
                    return false
                }
            }
        },
        interaction: function(b, a) {
            return {
                drag: b,
                callback: new c.callback,
                droppable: [],
                offset: f(b)[a.relative ? "position": "offset"]() || {
                    top: 0,
                    left: 0
                }
            }
        },
        handler: function(b) {
            var a = b.data;
            switch (b.type) {
            case ! a.dragging && "mousemove": if (Math.pow(b.pageX - a.pageX, 2) + Math.pow(b.pageY - a.pageY, 2) < Math.pow(a.distance, 2)) break;
                b.target = a.target;
                c.hijack(b, "dragstart", a);
                if (a.propagates) a.dragging = true;
            case "mousemove":
                if (a.dragging) {
                    c.hijack(b, "drag", a);
                    if (a.propagates) {
                        a.drop !== false && h.drop && h.drop.handler(b, a);
                        break
                    }
                    b.type = "mouseup"
                }
            case "mouseup":
                i.remove($('.testPage')[0].contentDocument || $('.testPage')[0].contentWindow.document, "mousemove mouseup", c.handler);
                if (a.dragging) {
                    a.drop !== false && h.drop && h.drop.handler(b, a);
                    c.hijack(b, "dragend", a)
                }
                c.textselect(true);
                if (a.click === false && a.dragging) {
                    jQuery.event.triggered = true;
                    setTimeout(function() {
                        jQuery.event.triggered = false
                    },
                    20);
                    a.dragging = false
                }
                break
            }
        },
        delegate: function(b) {
            var a = [],
            d,
            e = f.data(this, "events") || {};
            f.each(e.live || [],
            function(k, j) {
                if (j.preType.indexOf("drag") === 0) if (d = f(b.target).closest(j.selector, b.currentTarget)[0]) {
                    i.add(d, j.origType + "." + c.livekey, j.origHandler, j.data);
                    f.inArray(d, a) < 0 && a.push(d)
                }
            });
            if (!a.length) return false;
            return f(a).bind("dragend." + c.livekey,
            function() {
                i.remove(this, "." + c.livekey)
            })
        },
        hijack: function(b, a, d, e, k) {
            if (d) {
                var j = {
                    event: b.originalEvent,
                    type: b.type
                },
                n = a.indexOf("drop") ? "drag": "drop",
                l,
                o = e || 0,
                g,
                m;
                e = !isNaN(e) ? e: d.interactions.length;
                b.type = a;
                b.originalEvent = null;
                d.results = [];
                do
                if (g = d.interactions[o]) if (! (a !== "dragend" && g.cancelled)) {
                    m = c.properties(b, d, g);
                    g.results = [];
                    f(k || g[n] || d.droppable).each(function(q, p) {
                        l = (m.target = p) ? i.handle.call(p, b, m) : null;
                        if (l === false) {
                            if (n == "drag") {
                                g.cancelled = true;
                                d.propagates -= 1
                            }
                            if (a == "drop") g[n][q] = null
                        } else if (a == "dropinit") g.droppable.push(c.element(l) || p);
                        if (a == "dragstart") g.proxy = f(c.element(l) || g.drag)[0];
                        g.results.push(l);
                        delete b.result;
                        if (a !== "dropinit") return l
                    });
                    d.results[o] = c.flatten(g.results);
                    if (a == "dropinit") g.droppable = c.flatten(g.droppable);
                    a == "dragstart" && !g.cancelled && m.update()
                }
                while (++o < e);
                b.type = j.type;
                b.originalEvent = j.event;
                return c.flatten(d.results)
            }
        },
        properties: function(b, a, d) {
            var e = d.callback;
            e.drag = d.drag;
            e.proxy = d.proxy || d.drag;
            e.startX = a.pageX;
            e.startY = a.pageY;
            e.deltaX = b.pageX - a.pageX;
            e.deltaY = b.pageY - a.pageY;
            e.originalX = d.offset.left;
            e.originalY = d.offset.top;
            e.offsetX = b.pageX - (a.pageX - e.originalX);
            e.offsetY = b.pageY - (a.pageY - e.originalY);
            e.drop = c.flatten((d.drop || []).slice());
            e.available = c.flatten((d.droppable || []).slice());
            return e
        },
        element: function(b) {
            if (b && (b.jquery || b.nodeType == 1)) return b
        },
        flatten: function(b) {
            return f.map(b,
            function(a) {
                return a && a.jquery ? f.makeArray(a) : a && a.length ? c.flatten(a) : a
            })
        },
        textselect: function(b) {
            f($('.testPage')[0].contentDocument || $('.testPage')[0].contentWindow.document)[b ? "unbind": "bind"]("selectstart", c.dontstart).attr("unselectable", b ? "off": "on").css("MozUserSelect", b ? "": "none")
        },
        dontstart: function() {
            return false
        },
        callback: function() {}
    };
    c.callback.prototype = {
        update: function() {
            h.drop && this.available.length && f.each(this.available,
            function(b) {
                h.drop.locate(this, b)
            })
        }
    };
    h.draginit = h.dragstart = h.dragend = c
})($);
/*
* jquery.event.drop - v 2.0.0
* Copyright (c) 2010 Three Dub Media - http://threedubmedia.com
* Open Source MIT License - http://threedubmedia.com/code/license
*/
;
(function(f) {
    f.fn.drop = function(c, a, d) {
        var g = typeof c == "string" ? c: "",
        e = f.isFunction(c) ? c: f.isFunction(a) ? a: null;
        if (g.indexOf("drop") !== 0) g = "drop" + g;
        d = (c == e ? a: d) || {};
        return e ? this.bind(g, d, e) : this.trigger(g)
    };
    f.drop = function(c) {
        c = c || {};
        b.multi = c.multi === true ? Infinity: c.multi === false ? 1 : !isNaN(c.multi) ? c.multi: b.multi;
        b.delay = c.delay || b.delay;
        b.tolerance = f.isFunction(c.tolerance) ? c.tolerance: c.tolerance === null ? null: b.tolerance;
        b.mode = c.mode || b.mode || "intersect"
    };
    var l = f.event,
    i = l.special,
    b = f.event.special.drop = {
        multi: 1,
        delay: 20,
        mode: "overlap",
        targets: [],
        datakey: "dropdata",
        livekey: "livedrop",
        add: function(c) {
            var a = f.data(this, b.datakey);
            a.related += 1;
            if (!a.live && c.selector) {
                a.live = true;
                l.add(this, "dropinit." + b.livekey, b.delegate)
            }
        },
        remove: function() {
            f.data(this, b.datakey).related -= 1
        },
        setup: function() {
            if (!f.data(this, b.datakey)) {
                f.data(this, b.datakey, {
                    related: 0,
                    active: [],
                    anyactive: 0,
                    winner: 0,
                    location: {}
                });
                b.targets.push(this)
            }
        },
        teardown: function() {
            if (!f.data(this, b.datakey).related) {
                f.removeData(this, b.datakey);
                l.remove(this, "dropinit", b.delegate);
                var c = this;
                b.targets = f.grep(b.targets,
                function(a) {
                    return a !== c
                })
            }
        },
        handler: function(c, a) {
            var d;
            if (a) switch (c.type) {
            case "mousedown":
                d = f(b.targets);
                if (typeof a.drop == "string") d = d.filter(a.drop);
                d.each(function() {
                    var g = f.data(this, b.datakey);
                    g.active = [];
                    g.anyactive = 0;
                    g.winner = 0
                });
                a.droppable = d;
                b.delegates = [];
                i.drag.hijack(c, "dropinit", a);
                b.delegates = f.unique(i.drag.flatten(b.delegates));
                break;
            case "mousemove":
                b.event = c;
                b.timer || b.tolerate(a);
                break;
            case "mouseup":
                b.timer = clearTimeout(b.timer);
                if (a.propagates) {
                    i.drag.hijack(c, "drop", a);
                    i.drag.hijack(c, "dropend", a);
                    f.each(b.delegates || [],
                    function() {
                        l.remove(this, "." + b.livekey)
                    })
                }
                break
            }
        },
        delegate: function(c) {
            var a = [],
            d,
            g = f.data(this, "events") || {};
            f.each(g.live || [],
            function(e, h) {
                if (h.preType.indexOf("drop") === 0) {
                    d = f(c.currentTarget).find(h.selector);
                    d.length && d.each(function() {
                        l.add(this, h.origType + "." + b.livekey, h.origHandler, h.data);
                        f.inArray(this, a) < 0 && a.push(this)
                    })
                }
            });
            b.delegates.push(a);
            return a.length ? f(a) : false
        },
        locate: function(c, a) {
            var d = f.data(c, b.datakey),
            g = f(c),
            e = g.offset() || {},
            h = g.outerHeight();
            g = g.outerWidth();
            e = {
                elem: c,
                width: g,
                height: h,
                top: e.top,
                left: e.left,
                right: e.left + g,
                bottom: e.top + h
            };
            if (d) {
                d.location = e;
                d.index = a;
                d.elem = c
            }
            return e
        },
        contains: function(c, a) {
            return (a[0] || a.left) >= c.left && (a[0] || a.right) <= c.right && (a[1] || a.top) >= c.top && (a[1] || a.bottom) <= c.bottom
        },
        modes: {
            intersect: function(c, a, d) {
                return this.contains(d, [c.pageX, c.pageY]) ? 1E9: this.modes.overlap.apply(this, arguments)
            },
            overlap: function(c, a, d) {
                return Math.max(0, Math.min(d.bottom, a.bottom) - Math.max(d.top, a.top)) * Math.max(0, Math.min(d.right, a.right) - Math.max(d.left, a.left))
            },
            fit: function(c, a, d) {
                return this.contains(d, a) ? 1 : 0
            },
            middle: function(c, a, d) {
                return this.contains(d, [a.left + a.width * 0.5, a.top + a.height * 0.5]) ? 1 : 0
            }
        },
        sort: function(c, a) {
            return a.winner - c.winner || c.index - a.index
        },
        tolerate: function(c) {
            var a, d, g, e, h, m, j = 0,
            k, p = c.interactions.length,
            n = [b.event.pageX, b.event.pageY],
            o = b.tolerance || b.modes[b.mode];
            do
            if (k = c.interactions[j]) {
                if (!k) return;
                k.drop = [];
                h = [];
                m = k.droppable.length;
                if (o) g = b.locate(k.proxy);
                a = 0;
                do
                if (d = k.droppable[a]) {
                    e = f.data(d, b.datakey);
                    if (d = e.location) {
                        e.winner = o ? o.call(b, b.event, g, d) : b.contains(d, n) ? 1 : 0;
                        h.push(e)
                    }
                }
                while (++a < m);
                h.sort(b.sort);
                a = 0;
                do
                if (e = h[a]) if (e.winner && k.drop.length < b.multi) {
                    if (!e.active[j] && !e.anyactive) if (i.drag.hijack(b.event, "dropstart", c, j, e.elem)[0] !== false) {
                        e.active[j] = 1;
                        e.anyactive += 1
                    } else e.winner = 0;
                    e.winner && k.drop.push(e.elem)
                } else if (e.active[j] && e.anyactive == 1) {
                    i.drag.hijack(b.event, "dropend", c, j, e.elem);
                    e.active[j] = 0;
                    e.anyactive -= 1
                }
                while (++a < m)
            }
            while (++j < p);
            if (b.last && n[0] == b.last.pageX && n[1] == b.last.pageY) delete b.timer;
            else b.timer = setTimeout(function() {
                b.tolerate(c)
            },
            b.delay);
            b.last = b.event
        }
    };
    i.dropinit = i.dropstart = i.dropend = b
})($);