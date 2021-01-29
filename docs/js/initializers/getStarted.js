async function getStarted() {
    var formatted = await read('markdown/getStarted.md');
    var element = document.getElementById('getStarted');
    element.innerHTML = marked(formatted);
}