class CommandParameter {
    constructor() {
        this.type = '';
        this.required = true;
        this.name = '';
        this.value = '';
    }
}

class CommandConfig {
    constructor() {
        this.permissions = [''];
        this.description = '';
        this.hidden = false;
        this.nsfw = false;
        this.tags = [''];
        this.params = [[new CommandParameter()]];
    }
}

module.exports = CommandConfig;