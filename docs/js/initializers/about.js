async function about() {
    var markdown = await read('markdown/about.md');
    var element = document.getElementById('about');
    element.innerHTML = marked(markdown);
}