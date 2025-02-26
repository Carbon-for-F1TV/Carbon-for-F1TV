function loadScript(url) {
    let script = document.createElement("script");
    script.src = browser.runtime.getURL(url);
    document.documentElement.appendChild(script);
}

loadScript("lib/jquery-3.7.1.min.js");
loadScript("carbon-for-f1tv.user.js");