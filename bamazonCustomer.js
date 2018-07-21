var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    user: "root",
    password: ("root"),
    database: "bamazon"
})

connection.connect(function (err) {
    if (err) throw err;
    console.log("jackpot, i am in");
    table();
})

var table = function () {
    connection.query("SELECT * FROM products", function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].itemid + " || " + res[i].productname + " || " +
                res[i].departmentname + " || " + "$" + res[i].price + " || " +
                res[i].stockquantity + "\n");
        }
        question(res);
    })
}

var question = function (res) {
    inquirer.prompt([{
        type: "input",
        name: "purchase",
        message: "Type the name of the product you want to buy"
    }]).then(function (answer) {
        var correct = false;
        for (var i = 0; i < res.length; i++) {
            if (res[i].productname == answer.purchase) {
                correct = true;
                var product = answer.purchase;
                var id = i;
                inquirer.prompt({
                    type: "input",
                    name: "howMany",
                    message: "How many are you buying?",
                    validate: function (value) {
                        if (isNaN(value) == false) {
                            return true;
                        } else {
                            return false
                        }
                    }

                }).then(function (answer) {
                    if ((res[id].stockquantity - answer.howMany) > 0) {
                        connection.query("UPDATE products SET stockquantity='" +
                            (res[id].stockquantity - answer.howMany)
                            + "' WHERE productname='" + product
                            + "'", function (err, res2) {
                                console.log("Purchased");
                                table();
                            })

                    } else {
                        console.log("Lol nope");
                        question(res);
                    }
                })
            }
        }

    })

}


