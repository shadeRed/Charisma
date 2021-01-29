function getSyntax(command, name) {
    var syntax = [`//${name}`]
    for (var p = 0; p < command.params.length; p++) {
        var insert = command.params[p].type;
        if (command.params[p].name) { insert = command.params[p].name }
        if (command.params[p].required) { syntax.push(`<${insert}>`) }
        else { syntax.push(`[${insert}]`) }
    }

    return syntax.join(' ');
}

async function commandQuery() {
    var commandQuery = document.getElementById('commandQuery');
    var tags = new Array();
    var commands = JSON.parse(await read('commands.json'));

    for (c in commands) {
        if (commands[c].tags) {
            for (var t = 0; t < commands[c].tags.length; t++) {
                var has = false;
                for (var tt = 0; tt < tags.length; tt++) { if (commands[c].tags[t] == tags[tt]) { has = true } }
                if (!has) { tags.push(commands[c].tags[t]) }
            }
        }

        var commandElement = document.createElement('div');
        commandElement.setAttribute('class', 'command');
        commandElement.setAttribute('name', c);

        var commandTop = document.createElement('div');
        commandTop.setAttribute('class', 'command-top');

        var nsfwSpan = document.createElement('span');
        nsfwSpan.setAttribute('class', 'command-nsfw');
        nsfwSpan.innerText = 'nsfw';
        if (!commands[c].nsfw) { nsfwSpan.style.display = 'none' }
        commandTop.appendChild(nsfwSpan);

        var commandName = document.createElement('span');
        commandName.setAttribute('class', 'command-name');
        commandName.innerText = c;
        commandTop.appendChild(commandName);

        var commandUsage = document.createElement('span');
        commandUsage.setAttribute('class', 'command-usage');
        commandUsage.innerText = getSyntax(commands[c], c);
        commandTop.appendChild(commandUsage);

        commandElement.appendChild(commandTop);

        var commandBottom = document.createElement('div');
        commandBottom.setAttribute('class', 'command-bottom');

        var commandDescription = document.createElement('p');
        commandDescription.setAttribute('class', 'command-description');
        commandDescription.innerText = commands[c].description;
        commandBottom.appendChild(commandDescription);

        if (commands[c].tags) {
            var commandTagsContainer = document.createElement('div');
            commandTagsContainer.setAttribute('class', 'command-tags-container');

            var commandTagsLabel = document.createElement('span');
            commandTagsLabel.setAttribute('class', 'command-tags-label');
            commandTagsLabel.innerText = 'tags';
            commandTagsContainer.appendChild(commandTagsLabel);
            var commandTags = document.createElement('div');
            commandTags.setAttribute('class', 'command-tags');
            for (var t = 0; t < commands[c].tags.length; t++) {
                var commandTag = document.createElement('span');
                commandTag.setAttribute('class', 'command-tag');
                commandTag.innerText = commands[c].tags[t];
                commandTags.appendChild(commandTag);
            }

            commandTagsContainer.appendChild(commandTags);
            commandBottom.appendChild(commandTagsContainer);
        }

        commandElement.appendChild(commandTop);
        commandElement.appendChild(commandBottom);
        commandQuery.appendChild(commandElement);
    }

    var queryTags = document.getElementById('queryTags');
    for (var t = 0; t < tags.length; t++) {
        var checkbox = document.createElement('input');
        checkbox.setAttribute('type', 'checkbox');
        checkbox.setAttribute('id', `${tags[t]}-tag`);
        
        var label = document.createElement('label');
        label.setAttribute('for', `${tags[t]}-tag`);
        label.innerText = tags[t];

        var span = document.createElement('span');
        span.setAttribute('class', 'queryTag');
        span.addEventListener('click', function() { filterTags(commands, tags) });
        span.appendChild(checkbox);
        span.appendChild(label);

        queryTags.appendChild(span);
    }
}

function filterTags(commands, tags) {
    var activeTags = new Array();
    for (var t = 0; t < tags.length; t++) {
        var checkbox = document.getElementById(`${tags[t]}-tag`);
        if (checkbox.checked) { activeTags.push(tags[t]) }
    }

    var commandQuery = document.getElementById('commandQuery');
    var commandElements = commandQuery.getElementsByClassName('command');

    for (var c = 0; c < commandElements.length; c++) {
        commandElements[c].classList.remove('hidden');
        var isVisible = true;
        var command = commands[commandElements[c].getAttribute('name')];
        for (var a = 0; a < activeTags.length; a++) {
            var hasTag = false;
            if (!command.tags) { command.tags = [] }
            for (var t = 0; t < command.tags.length; t++) {
                if (command.tags[t] == activeTags[a]) {
                    hasTag = true;
                }
            }

            if (!hasTag) {
                isVisible = false;
            }
        }

        if (!isVisible) {
            commandElements[c].classList.add('hidden');
        }
    }
}