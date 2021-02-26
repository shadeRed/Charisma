// if equal to either a command name or a command alias
module.exports = function(input, passthrough) {
    let output = { pass: true, value: null }
    input = input.toLowerCase();
    let name = passthrough.commands.aliases.get(input) ? passthrough.commands.aliases.get(input) : input;
    let command = passthrough.commands.configs.get(name);
    if (command) { output.value = name }
    else { output.pass = false }
    return output;
}