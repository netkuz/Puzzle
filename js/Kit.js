var $ = function (name, s, p, to, n) {
    return new O(name, s, p, to, n).o;
};

class O {
    constructor(name, s, p, to, n) {
        let t = to || document.body;
        if (t) {
            this.o = document.createElement(name);
            if (p)
                this.add(this.o, p);
            if (s)
                this.add(this.o.style, s);
            if (n)
                t.insertAdjacentHTML("beforeEnd", "<br/>".repeat(n));
            t.appendChild(this.o);
        }
    }
    add(o, text) {
        let pp = text.split(";");
        if (pp.length === 0)
            return;
        for (let i = 0; i < pp.length; i++) {
            if (pp[i] === "")
                continue;
            var p = pp[i].split("=");
            if (p.length < 2)
                return;
            o[p[0]] = p[1];
        }
    }

    static getHtml(o) { return o.innerHTML; }
    static html(text, to) {
        if (!to)
            to = document.body;
        if (to)
            to.insertAdjacentHTML("beforeEnd", text);
    }
    static query(s) { return document.querySelector(s); }
    static addText(text, to) {
        let o = document.createTextNode(text);
        if (!to)
            to = document.body;
        to.appendChild(o);
        return o;
    }
    static getAll(o) {
        let s = "[";
        for (let p in o)
            s += o[p] + ", ";
        s = s.substr(0, s.length - 2);
        s += "]";
        return s;
    }

    static clear(o) {
        if (!o)
            o = document.body;
        while (o.childNodes.length > 0)
            o.removeChild(o.firstChild);
    }

    static setColor(c) {
        let res = "#000";
        try {
            let p = c.indexOf('('), s = 0;
            for (let i = 0; i < 3; i++) {
                c = c.substr(p + 1);
                s += parseInt(c);
                p = c.indexOf(",");
            }
            res = s < 384 ? "#fff" : "#000";
        }
        catch (e) { }
        return res;
    }
}

function MyDiv(header) {
    let body = document.body;
    if (!body)
        return null;
    let
        prop = (header ? "innerText=" + header : ""),
        clr = O.setColor(body.style.backgroundColor),
        style = `display=block;color=${clr};font-size=14pt;text-decoration=underline;margin=4px;`,
        a = $("a", style, prop);
    style = "display=none;margin=6px;padding=6px;background-color=whitesmoke;font-size=12pt;";
    let sp = $("span", style);
    a.onclick = () => { sp.style.display = (sp.style.display == 'block' ? 'none' : 'block'); };
    this.Add = (s, v) => {
        sp.innerHTML += (sp.innerHTML !== "" ? "<br/>" : "") + s;
        if (v !== undefined)
            sp.innerHTML += `: ${v}`;
    };
}
