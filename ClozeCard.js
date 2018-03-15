
var fs = require("fs");

module.exports = ClozeCard;


function ClozeCard(text, cloze) {
    this.text = text;
    this.cloze = cloze;
    this.clozeDeleted = this.text.replace(this.cloze, '_____');
    this.create = function() {
        var data = {
            text: this.text,
            cloze: this.cloze,
            clozeDeleted: this.clozeDeleted,
            type: "cloze"
        };

        fs.appendFile("log.txt", JSON.stringify(data) + ';', "utf8", function(error) {

            if (error) {
                console.log(error);
            }
        });
    };
}