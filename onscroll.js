
var onScrOllWrapper = function () {

    this.push = function () {
        for (var i = 0; i < arguments.length; i++) try {
            if (typeof arguments[i] === "function") arguments[i]();
            else {
                //method.apply( newThisContext, [ Param1, ..., Param N ] );
                var method = arguments[i][0];
                var args = arguments[i].slice(1)
                this[method].apply(this, args);
            }
        } catch (e) {
        }
    }

    this.version = "1.0.21";
    "undefined" !== typeof onScrOll_block && !0 === onScrOll_block && (onScrOll = null);

    this.main = function (onscrollObject,key) {


        "dual" === this.mode || "sticky_dual" === this.mode ? (this.dualSticky = "dual" === this.mode ? !1 : !0, this.dualSticky || (this.mode = "sticky_dual")) : "sticky" === this.mode && /android|bada\/|blackberry|iemobile|ip(hone|od|ad)|mobile.+firefox|opera m(ob|in)i|phone|symbian|windows (ce|phone)/i.test(navigator.userAgent) && (this.mode = "basic");
        // transfer the properties from the object to the new wrapper, to avoid this.mode,this.stuff to create problems.
        this.placeholder=onscrollObject.placeholder;
        this.code=onscrollObject.code;
        this.margin=onscrollObject.margin;
        this.marginTop=onscrollObject.marginTop;
        this.mode=onscrollObject.mode;
        this.height=onscrollObject.height;
        this.width=onscrollObject.width;
        this.reload=onscrollObject.reload;
        this.campaignId=onscrollObject.campaignId;
        this.creativeId=onscrollObject.creativeId;
        this.accountId=onscrollObject.accountId;

        this.instance = key;
        this.initialPos = this.wrapper = null;
        this.root = [];
        this.segment = 0;
        this.hasOwnProperty("iframe") || (this.iframe = !0);
        this.hasOwnProperty("interval") || (this.interval = 1E3);
        this.hasOwnProperty("reload") || (this.reload = !1);
        this.style = this.style || {
                position: "relative"
            };
        if (this.hasOwnProperty("placeholder")) {
            var a = document.getElementById(this.placeholder);
            this.wrapper = document.createElement("div");
            this.wrapper.id = "" + this.instance + "_onScrOllRoot";
            this.wrapper.style.clear = "both";
            this.wrapper.style.position = "relative";
            this.wrapper.style.left = 0;
            this.wrapper.style.top = 0;
            this.wrapper.style.margin = "0px auto";
            a.appendChild(this.wrapper)
        } else document.write("<div id='" +
            this.instance + "_onScrOllRoot' style='clear:both;position:relative;left:0;top:0;margin:0px auto;'></div>");

        //var b = this;
        //  setTimeout(function () {
            var b = this;
            b.main2(b);
        //  }, 0)
    };
    this.main2 = function (a) {
        a.wrapper || (a.wrapper = document.getElementById("" + a.instance + "_onScrOllRoot"));
        a.wrapper.style.width = this.width + "px";
        "basic" === this.mode && (a.wrapper.style.height = this.height + "px");
        a.scrollHook();
        a.bind(window, "scroll", function () {
            a.scrollHook()
        });
        a.bind(window, "resize", function () {
            a.scrollHook()
        });
        a.bind(window, "load", function () {
            a.scrollHook()
        })
    };
    this.scrollHook = function () {

        this.initialPos = this.elPos(this.wrapper);

        var a = this.getDocScroll().scrOfY,
            b = a + this.windowDims().myHeight - this.initialPos,
            c = this.getDocHeight(),
            e = c - this.initialPos - this.margin;
        if (e < this.height) "sticky" === this.mode && 1 === this.root.length && (this.root[0].style.top = "0");
        else {
            if ("sticky_reappearing" === this.mode || "sticky_dual" === this.mode) {
                var f = Math.ceil(b / this.interval);
                this.initialPos + (f - 1) * this.interval + this.height + this.margin <= this.getDocHeight() && (this.segment = f)
            }
            this.genRoot();
            if ("sticky_reappearing" === this.mode || "sticky" === this.mode || "floating" === this.mode || "sticky_dual" === this.mode)
                if (0 < b && a + this.margin < c)
                    if ("sticky_dual" === this.mode)
                        for (this.checkSegment(), b = 0; b < this.root.length; b++)
                            if (f = b, f == this.segment - 2) {
                                var k = (f + 1) * this.interval - this.height;
                                a >= this.initialPos + k ? (this.dualSticky && (this.root[b].style.position = "absolute", this.root[b].style.top = k + "px"), a >= this.initialPos + (f + 1) * this.interval ? this.resetRoot(this.segment - 1) : this.root[b].rel != this.segment - 1 && this.refreshFrame(this.segment -
                                    1)) : (this.root[b].rel != this.segment - 1 && this.refreshFrame(this.segment - 1), this.dualSticky && (this.root[b].style.position = "fixed", this.root[b].style.top = "0"))
                            } else f == this.segment - 1 && (a + this.margin + this.height >= c ? this.dualSticky && (this.root[b].style.position = "absolute", this.root[b].style.top = e - this.height + "px") : (f *= this.interval, a >= this.initialPos + f ? this.dualSticky && (this.root[b].style.position = "fixed", this.root[b].style.top = "0") : (this.root[b].style.position = "absolute", this.root[b].style.top = f + "px")));
                    else this.checkSegment(), a >= this.initialPos ? a + this.margin + this.height >= c ? (this.root[0].style.position = this.style.position, this.root[0].style.top = e - this.height + "px") : (this.root[0].style.position = "fixed", this.root[0].style.top = "0") : (this.root[0].style.position = this.style.position, this.root[0].style.top = "0");
                else this.fullResetRoot();
            else "basic" === this.mode && (0 < b && a < this.initialPos + this.height ? this.checkSegment() : this.fullResetRoot())

        }
    };
    this.fullResetRoot = function () {
        var a;
        for (a = 0; a < this.root.length; a++) this.resetRoot(a + 1)
    };
    this.resetRoot = function (a) {
        a -= 1;
        this.root[a].style.position = this.style.position;
        this.reload && (this.root[a].innerHTML = "", this.root[a].rel = -1)
    };
    this.bind = function (a, b, c) {
        a.addEventListener ? a.addEventListener(b, c, !1) : a.attachEvent("on" + b, c)
    };
    this.logData = function (a) {
        document.getElementById("onScrolllLog").innerHTML = a
    };
    this.getDocScroll = function () {
        var a = 0,
            b = 0;
        "number" === typeof window.pageYOffset ? (b = window.pageYOffset, a = window.pageXOffset) : document.body && (document.body.scrollLeft || document.body.scrollTop) ? (b = document.body.scrollTop, a = document.body.scrollLeft) : document.documentElement && (document.documentElement.scrollLeft || document.documentElement.scrollTop) && (b = document.documentElement.scrollTop, a = document.documentElement.scrollLeft);
        return {
            scrOfX: a,
            scrOfY: b
        }
    };
    this.elPos = function (a) {
        var b = 0;
        if (a.offsetParent) {
            do b += a.offsetTop; while (a = a.offsetParent)
        }
        return b
    };
    this.windowDims = function () {
        var a = 0,
            b = 0;
        "number" === typeof window.innerWidth ? (a = window.innerWidth, b = window.innerHeight) : document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight) ? (a = document.documentElement.clientWidth, b = document.documentElement.clientHeight) : document.body && (document.body.clientWidth || document.body.clientHeight) && (a = document.body.clientWidth, b = document.body.clientHeight);
        return {
            myWidth: a,
            myHeight: b
        }
    };
    this.genRoot = function () {

        for (var a = "sticky_dual" === this.mode ? this.segment : 1; this.root.length < a;) {
            this.root.push(document.createElement("div"));
            var b = this.root.length - 1;
            this.root[b].id = this.instance + "_onScrOllAd_" + b;
            this.root[b].style.position = this.style.position;
            this.root[b].style.clear = "both";
            this.root[b].style.width = this.width + "px";
            this.root[b].style.height = this.height + "px";
            this.root[b].style.top = b * this.interval + "px";
            "undefined" !== typeof this.marginTop && (this.root[b].style.marginTop = this.marginTop +
                "px");
            this.wrapper.appendChild(this.root[b])

        }
    };
    this.refreshFrame = function (a) {

        var b = this.root["sticky_dual" === this.mode ? a - 1 : 0];
        b.rel = a;
        if (!1 === this.iframe) OSAdWriter(b, this.base64_decode(this.code));
        else {
            a = "";
            if ("object" === typeof this.vars) {
                for (var c in this.vars) a += "var " + c + "=" + this.stringify(this.vars[c]) + ";";
                a && (a = "<script>" + a + "\x3c/script>")
            }
            c = "";
            "undefined" !== typeof this.extrajs && (c = "<script>" + this.extrajs + "\x3c/script>");
            var e = this.base64_decode(this.code);
            e && "undefined" !== typeof this.campaignId && "undefined" !== typeof this.creativeId &&
            "undefined" !== typeof this.accountId && (e = "<div>" + e + '<script type="text/javascript">', e += "(window._tracker = (window._tracker || [])).push({", e += "campaignId: '" + this.campaignId + "',", e += "creativeId: '" + this.creativeId + "',", e += "accountId: '" + this.accountId + "'", e += "});", e += "\x3c/script>", e += '<script src="http://cdn.onscroll.com/ms.os.js">\x3c/script>', e += "</div>");
            for (a = "<html><head><style>body{margin:0 0 0 0;padding:0 0 0 0;height:100%;}</style>" + a + c + "</head><body>" + e + "</body></html>"; b.hasChildNodes();) b.removeChild(b.lastChild);
            c = document.createElement("iframe");

            c.width = this.width + "px";
            c.height = this.height + "px";
            c.frameBorder = "0";
            c.scrolling = "no";
            b.appendChild(c);

            if (window.navigator.userAgent.match(/MSIE\s/)) c.contentWindow.contents = a, c.src = 'javascript:window["contents"]';
            else {
                var f = c.contentDocument || c.contentWindow && c.contentWindow.document || c.document;
                f.open();
                f.write(a);
                setTimeout(function () {
                    f.close()
                }, 0)
            }
        }
    };
    this.getDocHeight = function () {
        var a = document;
        return Math.max(Math.max(a.body.scrollHeight, a.documentElement.scrollHeight), Math.max(a.body.offsetHeight, a.documentElement.offsetHeight), Math.max(a.body.clientHeight, a.documentElement.clientHeight))
    };
    this.checkSegment = function () {
        var a = "sticky_dual" === this.mode ? this.segment - 1 : 0;
        ("sticky" === this.mode || "floating" === this.mode || "basic" === this.mode || this.segment) && this.root[a].rel != this.segment && this.refreshFrame(this.segment)
    };
    this.base64_decode = function (a) {
        var b, c, e, f, k, g = 0,
            l = 0;
        f = "";
        var p = [];
        if (!a) return a;
        a += "";
        do b = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(a.charAt(g++)), c = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(a.charAt(g++)), f = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(a.charAt(g++)), k = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(a.charAt(g++)), e = b << 18 | c << 12 | f << 6 | k, b = e >> 16 & 255, c =
            e >> 8 & 255, e &= 255, 64 == f ? p[l++] = String.fromCharCode(b) : 64 == k ? p[l++] = String.fromCharCode(b, c) : p[l++] = String.fromCharCode(b, c, e); while (g < a.length);
        return f = p.join("")
    };
    this.stringify = function (a) {
        switch (typeof a) {
            case "string":
                return '"' + a + '"';
            case "number":
                return isFinite(a) ? String(a) : "null";
            case "boolean":
            case "null":
                return String(a);
            case "object":
                if (!a) return "null";
                var b = [];
                if ("[object Array]" === Object.prototype.toString.apply(a)) {
                    for (var c = 0; c < a.length; c += 1) b[c] = this.stringify(a[c]) || "null";
                    return 0 === b.length ? "[]" : "[" + b.join(",") + "]"
                }
                for (c in a)
                    if (Object.prototype.hasOwnProperty.call(a, c)) {
                        var e = this.stringify(a[c]);
                        e && b.push(c + ":" + e)
                    }
                return 0 === b.length ?
                    "{}" : "{" + b.join(",") + "}"
        }
    };
    (function () {
        function a(a, h) {
            a = a || "";
            h = h || {};
            for (var q in b) b.hasOwnProperty(q) && (h.autoFix && (h["fix_" + q] = !0), h.fix = h.fix || h["fix_" + q]);
            var n = {
                comment: /^\x3c!--/,
                endTag: /^<\//,
                atomicTag: /^<\s*(script|style|noscript|iframe|textarea)[\s>]/i,
                startTag: /^</,
                chars: /^[^<]/
            }, s = {
                comment: function () {
                    var d = a.indexOf("--\x3e");
                    if (0 <= d) return {
                        content: a.substr(4, d),
                        length: d + 3
                    }
                },
                endTag: function () {
                    var d = a.match(e);
                    if (d) return {
                        tagName: d[1],
                        length: d[0].length
                    }
                },
                atomicTag: function () {
                    var d = s.startTag();
                    if (d) {
                        var b = a.slice(d.length);
                        if (b.match(RegExp("</\\s*" + d.tagName + "\\s*>", "i")) && (b = b.match(RegExp("([\\s\\S]*?)</\\s*" + d.tagName + "\\s*>", "i")))) return {
                            tagName: d.tagName,
                            attrs: d.attrs,
                            content: b[1],
                            length: b[0].length + d.length
                        }
                    }
                },
                startTag: function () {
                    var d = a.match(c);
                    if (d) {
                        var b = {};
                        d[2].replace(f, function (a, d, v, q, c) {
                            a = v || q || c || k.test(d) && d || null;
                            b[d] = a
                        });
                        return {
                            tagName: d[1],
                            attrs: b,
                            unary: !!d[3],
                            length: d[0].length
                        }
                    }
                },
                chars: function () {
                    var d = a.indexOf("<");
                    return {
                        length: 0 <= d ? d : a.length
                    }
                }
            }, d = function () {
                for (var d in n)
                    if (n[d].test(a)) {
                        g &&
                        console.log("suspected " + d);
                        var b = s[d]();
                        return b ? (g && console.log("parsed " + d, b), b.type = b.type || d, b.text = a.substr(0, b.length), a = a.slice(b.length), b) : null
                    }
            };
            h.fix && function () {
                var b = /^(AREA|BASE|BASEFONT|BR|COL|FRAME|HR|IMG|INPUT|ISINDEX|LINK|META|PARAM|EMBED)$/i,
                    q = /^(COLGROUP|DD|DT|LI|OPTIONS|P|TD|TFOOT|TH|THEAD|TR)$/i,
                    c = [];
                c.last = function () {
                    return this[this.length - 1]
                };
                c.lastTagNameEq = function (a) {
                    var d = this.last();
                    return d && d.tagName && d.tagName.toUpperCase() === a.toUpperCase()
                };
                c.containsTagName = function (a) {
                    for (var d =
                        0, b; b = this[d]; d++)
                        if (b.tagName === a) return !0;
                    return !1
                };
                var e = function (a) {
                        a && "startTag" === a.type && (a.unary = b.test(a.tagName) || a.unary);
                        return a
                    }, n = d,
                    f = function () {
                        a = "</" + c.pop().tagName + ">" + a
                    }, s = {
                        startTag: function (d) {
                            var b = d.tagName;
                            "TR" === b.toUpperCase() && c.lastTagNameEq("TABLE") ? (a = "<TBODY>" + a, g()) : h.fix_selfClose && q.test(b) && c.containsTagName(b) ? c.lastTagNameEq(b) ? f() : (a = "</" + d.tagName + ">" + a, g()) : d.unary || c.push(d)
                        },
                        endTag: function (a) {
                            c.last() ? h.fix_tagSoup && !c.lastTagNameEq(a.tagName) ? f() : c.pop() :
                            h.fix_tagSoup && (n(), g())
                        }
                    }, g = function () {
                        var d = a,
                            b = e(n());
                        a = d;
                        if (b && s[b.type]) s[b.type](b)
                    };
                d = function () {
                    g();
                    return e(n())
                }
            }();
            return {
                append: function (d) {
                    a += d
                },
                readToken: d,
                readTokens: function (a) {
                    for (var b;
                         (b = d()) && (!a[b.type] || !1 !== a[b.type](b)););
                },
                clear: function () {
                    var d = a;
                    a = "";
                    return d
                },
                rest: function () {
                    return a
                },
                stack: []
            }
        }

        if (!this.OSHtmlParser) {
            var b = function () {
                    var a = {}, b = this.document.createElement("div");
                    b.innerHTML = "<P><I></P></I>";
                    a.tagSoup = "<P><I></P></I>" !== b.innerHTML;
                    b.innerHTML = "<P><i><P></P></i></P>";
                    a.selfClose = 2 === b.childNodes.length;
                    return a
                }(),
                c = /^<([\-A-Za-z0-9_]+)((?:\s+[\w\-]+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/,
                e = /^<\/([\-A-Za-z0-9_]+)[^>]*>/,
                f = /([\-A-Za-z0-9_]+)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g,
                k = /^(checked|compact|declare|defer|disabled|ismap|multiple|nohref|noresize|noshade|nowrap|readonly|selected)$/i,
                g = !1;
            a.supports = b;
            a.tokenToString = function (a) {
                var b = {
                    comment: function (a) {
                        return "<--" + a.content + "--\x3e"
                    },
                    endTag: function (a) {
                        return "</" +
                            a.tagName + ">"
                    },
                    atomicTag: function (a) {
                        console.log(a);
                        return b.startTag(a) + a.content + b.endTag(a)
                    },
                    startTag: function (a) {
                        var b = "<" + a.tagName,
                            c;
                        for (c in a.attrs) var d = a.attrs[c],
                            b = b + (" " + c + '="' + (d ? d.replace(/(^|[^\\])"/g, '$1\\"') : "") + '"');
                        return b + (a.unary ? "/>" : ">")
                    },
                    chars: function (a) {
                        return a.text
                    }
                };
                return b[a.type](a)
            };
            a.escapeAttributes = function (a) {
                var b = {}, c;
                for (c in a) {
                    var e = a[c];
                    b[c] = e && e.replace(/(^|[^\\])"/g, '$1\\"')
                }
                return b
            };
            for (var l in b) a.browserHasFlaw = a.browserHasFlaw || !b[l] && l;
            this.OSHtmlParser =
                a
        }
    })();


    (function () {
        function a() {
        }

        function b(a, b, c) {
            var d, e = a && a.length || 0;
            for (d = 0; d < e; d++) b.call(c, a[d], d)
        }

        function c(a, b, c) {
            for (var d in a) a.hasOwnProperty(d) && b.call(c, d, a[d])
        }

        function e(a, b) {
            c(b, function (b, d) {
                a[b] = d
            });
            return a
        }

        function f(a, b) {
            a = a || {};
            c(b, function (b, d) {
                null == a[b] && (a[b] = d)
            });
            return a
        }

        function k(a) {
            try {
                return l.call(a)
            } catch (c) {
                var e = [];
                b(a, function (a) {
                    e.push(a)
                });
                return e
            }
        }

        var g = this;
        if (!g.OSAdWriter) {
            var l = Array.prototype.slice,
                p = function () {
                    function a(d, b, c) {
                        var e = h + b;
                        if (2 === arguments.length) return e = d.getAttribute(e),
                            null == e ? e : String(e);
                        null != c && "" !== c ? d.setAttribute(e, c) : d.removeAttribute(e)
                    }

                    function f(d, b) {
                        var c = d.ownerDocument;
                        e(this, {
                            root: d,
                            options: b,
                            win: c.defaultView || c.parentWindow,
                            doc: c,
                            parser: g.OSHtmlParser("", {
                                autoFix: !0
                            }),
                            actuals: [d],
                            proxyHistory: "",
                            proxyRoot: c.createElement(d.nodeName),
                            scriptStack: [],
                            writeQueue: []
                        });
                        a(this.proxyRoot, "proxyof", 0)
                    }

                    var h = "data-ps-";
                    f.prototype.write = function () {
                        [].push.apply(this.writeQueue, arguments);
                        for (var a; !this.deferredRemote && this.writeQueue.length;) a = this.writeQueue.shift(),
                            "function" === typeof a ? this.callFunction(a) : this.writeImpl(a)
                    };
                    f.prototype.callFunction = function (a) {
                        var b = {
                            type: "function",
                            value: a.name || a.toString()
                        };
                        this.onScriptStart(b);
                        a.call(this.win, this.doc);
                        this.onScriptDone(b)
                    };
                    f.prototype.writeImpl = function (a) {
                        this.parser.append(a);
                        var b;
                        for (a = [];
                             (b = this.parser.readToken()) && !/^script$/i.test(b.tagName);) a.push(b);
                        this.writeStaticTokens(a);
                        b && this.handleScriptToken(b)
                    };
                    f.prototype.writeStaticTokens = function (a) {
                        a = this.buildChunk(a);
                        if (a.actual) return a.html =
                            this.proxyHistory + a.actual, this.proxyHistory += a.proxy, this.proxyRoot.innerHTML = a.html, this.walkChunk(), a
                    };
                    f.prototype.buildChunk = function (a) {
                        var c = this.actuals.length,
                            e = [],
                            f = [],
                            g = [];
                        b(a, function (a) {
                            e.push(a.text);
                            if (a.attrs) {
                                if (!/^noscript$/i.test(a.tagName)) {
                                    var b = c++;
                                    f.push(a.text.replace(/(\/?>)/, " " + h + "id=" + b + " $1"));
                                    "ps-script" !== a.attrs.id && g.push("atomicTag" === a.type ? "" : "<" + a.tagName + " " + h + "proxyof=" + b + (a.unary ? "/>" : ">"))
                                }
                            } else f.push(a.text), g.push("endTag" === a.type ? a.text : "")
                        });
                        return {
                            tokens: a,
                            raw: e.join(""),
                            actual: f.join(""),
                            proxy: g.join("")
                        }
                    };
                    f.prototype.walkChunk = function () {
                        for (var b, c = [this.proxyRoot]; null != (b = c.shift());) {
                            var e = 1 === b.nodeType;
                            e && a(b, "proxyof") || (e && (this.actuals[a(b, "id")] = b, a(b, "id", null)), (e = b.parentNode && a(b.parentNode, "proxyof")) && this.actuals[e].appendChild(b));
                            c.unshift.apply(c, k(b.childNodes))
                        }
                    };
                    f.prototype.handleScriptToken = function (a) {
                        var b = this.parser.clear();
                        b && this.writeQueue.unshift(b);
                        a.src = a.attrs.src || a.attrs.SRC;
                        if (a.src && this.scriptStack.length) this.deferredRemote =
                            a;
                        else this.onScriptStart(a);
                        var c = this;
                        this.writeScriptToken(a, function () {
                            c.onScriptDone(a)
                        })
                    };
                    f.prototype.onScriptStart = function (a) {
                        a.outerWrites = this.writeQueue;
                        this.writeQueue = [];
                        this.scriptStack.unshift(a)
                    };
                    f.prototype.onScriptDone = function (a) {
                        a !== this.scriptStack[0] ? this.options.error({
                            message: "Bad script nesting or script finished twice"
                        }) : (this.scriptStack.shift(), this.write.apply(this, a.outerWrites), !this.scriptStack.length && this.deferredRemote && (this.onScriptStart(this.deferredRemote), this.deferredRemote =
                            null))
                    };
                    f.prototype.writeScriptToken = function (a, b) {
                        var c = this.buildScript(a);
                        a.src && (c.src = a.src, this.scriptLoadHandler(c, b));
                        try {
                            this.insertScript(c), a.src || b()
                        } catch (e) {
                            this.options.error(e), b()
                        }
                    };
                    f.prototype.buildScript = function (a) {
                        var b = this.doc.createElement(a.tagName);
                        c(a.attrs, function (a, c) {
                            b.setAttribute(a, c)
                        });
                        a.content && (b.text = a.content);
                        return b
                    };
                    f.prototype.insertScript = function (a) {
                        this.writeImpl('<span id="ps-script"/>');
                        var b = this.doc.getElementById("ps-script");
                        b.parentNode.replaceChild(a,
                            b)
                    };
                    f.prototype.scriptLoadHandler = function (a, b) {
                        function c() {
                            a = a.onload = a.onreadystatechange = a.onerror = null;
                            b()
                        }

                        var f = this.options.error;
                        e(a, {
                            onload: function () {
                                c()
                            },
                            onreadystatechange: function () {
                                /^(loaded|complete)$/.test(a.readyState) && c()
                            },
                            onerror: function () {
                                f({
                                    message: "remote script failed " + a.src
                                });
                                c()
                            }
                        })
                    };
                    return f
                }(),
                h = function () {
                    function b() {
                        var a = l.shift();
                        a && (a.stream = c.apply(null, a))
                    }

                    function c(f, g, r) {
                        function l(a) {
                            a = r.beforeWrite(a);
                            m.write(a);
                            r.afterWrite(a)
                        }

                        m = new p(f, r);
                        m.id = d++;
                        m.name =
                            r.name || m.id;
                        h.streams[m.name] = m;
                        var t = f.ownerDocument,
                            n = {
                                write: t.write,
                                writeln: t.writeln
                            };
                        e(t, {
                            write: function () {
                                return l(k(arguments).join(""))
                            },
                            writeln: function (a) {
                                return l(k(arguments).join("") + "\n")
                            }
                        });
                        var u = m.win.onerror || a;
                        m.win.onerror = function (a, b, c) {
                            r.error({
                                msg: a + " - " + b + ":" + c
                            });
                            u.apply(m.win, arguments)
                        };
                        m.write(g, function () {
                            e(t, n);
                            m.win.onerror = u;
                            r.done();
                            m = null;
                            b()
                        });
                        return m
                    }

                    function h(c, d, e) {
                        "function" === typeof e && (e = {
                            done: e
                        });
                        e = f(e, {
                            done: a,
                            error: function (a) {
                                throw a;
                            },
                            beforeWrite: function (a) {
                                return a
                            },
                            afterWrite: a
                        });
                        c = /^#/.test(c) ? g.document.getElementById(c.substr(1)) : c.jquery ? c[0] : c;
                        var k = [c, d, e];
                        c.postscribe = {
                            cancel: function () {
                                k.stream ? k.stream.abort() : k[1] = a
                            }
                        };
                        l.push(k);
                        m || b();
                        return c.postscribe
                    }

                    var d = 0,
                        l = [],
                        m = null;
                    return e(h, {
                        streams: {},
                        queue: l,
                        WriteStream: p
                    })
                }();
            g.OSAdWriter = h
        }
    })();
};
var _old_onScrOllArray = window.onScrOllArray;
window.onScrOllArray = new onScrOllWrapper(_old_onScrOllArray);
//// execute all of the queued up events - apply() turns the array entries into individual arguments
window.onScrOllArray.push.apply(window.onScrOllArray, _old_onScrOllArray);
