function enter_stack(elem, data) {
    let v = decodeURIComponent(data[1])
    let pre = document.createElement("pre");
    let div = document.createElement("div")
    pre.innerText = data[0] + "=" + v;
    div.appendChild(pre);
    elem.parentNode.appendChild(div);
    basic(elem, v)
}

function generateTextarea(elem, data, name) {
    if (data === "") return;
    let div = document.createElement("div");
    let p = document.createElement("p");
    p.innerText = name
    let textarea = document.createElement("textarea");
    textarea.setAttribute("oninput", "uri_changed(this)");
    textarea.innerText = data
    textarea.id = "hash";
    div.appendChild(p);
    div.appendChild(textarea);
    elem.parentNode.appendChild(div);
    textarea.style.height = textarea.scrollHeight + 25 + 'px'
}

function parseQuery(elem, data) {
    if (data === "") return;
    let div = document.createElement("div");
    let p = document.createElement("p");
    p.innerText = "query";
    div.appendChild(p);
    elem.parentNode.appendChild(div);
    let div_query_items = document.createElement("div");
    div_query_items.setAttribute("class", "group")
    let pre = document.createElement("pre");
    pre.innerText = data;
    div_query_items.appendChild(pre)
    data.split("&").forEach(function (item) {
        if (item === "") return;
        let kv = item.split("=");
        let k = kv[0], v = kv[1];
        let div_query_item = document.createElement("div");
        let query_item_p = document.createElement("p");
        query_item_p.innerText = k;
        div_query_item.appendChild(query_item_p);
        let query_item_textarea = document.createElement("textarea");
        query_item_textarea.setAttribute("oninput", "uri_changed(this)");
        query_item_textarea.innerText = decodeURIComponent(v);
        div_query_item.appendChild(query_item_textarea);
        div_query_items.appendChild(div_query_item);
        if (decodeURI(v) === v) {
            return;
        }
        enter_stack(div_query_item, kv)
    })
    elem.parentNode.appendChild(div_query_items)
}

function uri_changed(_this) {
    _this.style.height = _this.scrollHeight + 'px'
    basic(_this, _this.value)
}

function basic(elem, data) {
    while (elem.nextElementSibling) {
        elem.nextElementSibling.remove()
    }
    if (URL.canParse(data) === false) {
        console.log("can not parse: " + data);
        return;
    }
    let parser = new URL(data);
    generateTextarea(elem, parser.host, "domain")
    generateTextarea(elem, parser.pathname, "path");
    parseQuery(elem, parser.search.substring(1));
    generateTextarea(elem, parser.hash.substring(1), "hash");
}

document.onreadystatechange = function () {
    if (document.readyState === "complete") {
        uri_changed(document.getElementById("uri"));
    }
}