// jQuery
$(document).ready(function () {
    $.getScript(parser.js);

    var num_cs = "584";
    var num_res = parse(num_cs);
    var num_test = (num_res["name"] == "num") && (num_res["n"] == "584");
    
    var bool_cs1 = "true";
    var bool_res1 = parse(bool_cs1);
    var bool_test1 = (bool_res1["name"] == "bool") && (bool_res1["b"] == "true");
    
    var bool_cs2 = "false";
    var bool_res2 = parse(bool_cs2);
    console.log("bool2: ");
    console.log(bool_cs2);
    console.log(bool_res2);
    var bool_test2 = (bool_res2["name"] == "bool") && (bool_res2["b"] == "false");
    
    var id_cs1 = "alpha";
    var id_res1 = parse(id_cs1);
    var id_test1 = (id_res1["name"] == "id") && (id_res1["id"] == "alpha");
    
    var id_cs_exn = "97alpgha";
    var id_test_exn = false;
    
    try {
        parse(id_cs_exn);
    } catch(SyntaxError) {
        id_test_bad = true;
    }
    
    var with_cs = ["with", [["a", "=", 5], ["b", "=", 6]], ["+", "a", "b"]];
    var with_res = parse(with_cs);
    var with_test = (with_res["name"] == "app") &&
        (with_res["lam"]["name"] == "lam") &&
        (with_res["lam"]["params"][0]["name"] == "id") &&
        (with_res["lam"]["params"][0]["id"] == "a") &&
        (with_res["lam"]["params"][1]["name"] == "id") &&
        (with_res["lam"]["params"][1]["id"] == "b") &&
        (with_res["lam"]["body"]["name"] == "binop") &&
        (with_res["lam"]["body"]["op"] == "+") &&
        (with_res["lam"]["body"]["left"]["name"] == "id") &&
        (with_res["lam"]["body"]["left"]["id"] == "a") &&
        (with_res["lam"]["body"]["right"]["name"] == "id") &&
        (with_res["lam"]["body"]["right"]["id"] == "b") &&
        (with_res["args"][0]["name"] == "num") &&
        (with_res["args"][0]["n"] == "5") &&
        (with_res["args"][1]["name"] == "num") &&
        (with_res["args"][1]["n"] == "6");
    
    console.log("Parse Tests:\n\t" +
                    "num: " + num_test + "\n\t" +
                    "bool1: " + bool_test1 + "\n\t" +
                    "bool2: " + bool_test2 + "\n\t" +
                    "id1: " + id_test1 + "\n\t" +
                    "id2: " + id_test_bad + "\n\t" +
                    "with: " + with_test + "\n\t");
});