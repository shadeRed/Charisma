class Item {
    constructor() {
        this.emoji = '';
        this.value = 0;
        this.shoppable = true;
        this.trees = {
            growth: 0,
            harvest: 0,
            fail: 0,
            death: 0,
            yield: [0, 0]
        },

        this.tags = [''];
    }
}

module.exports = Item;