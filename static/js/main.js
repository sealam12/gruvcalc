window.onerror = function (message, url, lineNo, columnNo, error) {
    document.body.innerHTML = `${message} at line ${lineNo}:${columnNo}`;
    return true;
};