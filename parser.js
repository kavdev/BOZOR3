$(document).ready(function () {
    var num_cs = "584";
    var num_res = parse(num_cs);
    var num_test = (num_res["name"] == "num") && (num_res["n"] == "584");
    
    var bool_cs1 = "true";
    var bool_res1 = parse(num_cs);
    var bool_test1 = (bool_res1["name"] == "bool") && (bool_res1["b"] == "true");
    
    var bool_cs2 = "false";
    var bool_res2 = parse(num_cs);
    var bool_test2 = (bool_res2["name"] == "bool") && (bool_res2["b"] == "false");
    
    var id_cs1 = "alpha";
    var id_res1 = parse(num_cs);
    var id_test1 = (id_res1["name"] == "id") && (id_res1["id"] == "alpha");
    
    var id_cs_exn = "97alpgha";
    var id_res_exn = "";
    var id_test_exn = false;
    
    try {
        parse(num_cs);
    } catch(SyntaxError) {
        id_test_bad = true;
    }
    
    var with_cs = "{with {a = 5}\n{b = 6}\n{+ a b}}";
    var with_res = parse(with_cs);
    var with_test = (with_res["name"] == "app") &&
        (with_res["lam"]["name"] == "fun") &&
        (with_res["lam"]["params"][0] == "a") &&
        (with_res["lam"]["params"][1] == "b") &&
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
                    "bool: " + (bool_test1 && bool_test2) + "\n\t" +
                    "bool: " + (id_test1 && id_test_exn) + "\n\t" +
                    "with: " + with_test + "\n\t");
});

/*
 * The Parser
 *
 * Translates concrete syntax to abstract syntax.
 *
 * SYMBOL == [a-zA-Z]+\w*
 * EXPR == any one of the parse clauses
 */
function parse(cs) {
    var operators = ["+", "-", "*", "/", "eq?", "<="];
    var reserved_keywords = ["fn" "if" "with" "true" "false"].concat(operators);
    
    var parsed = {};

    num_regex = /^(\d+)$/;
    bool_regex = /^[true|false]$/;
    lam_regex = /^$/;
    id_regex = //;
    if_regex = /^$/;
    binop_regex = /^$/;
    app_regex = /^$/;
    
    // {with {SYMBOL = EXPR} EXPR} -> app
    with_regex = /^{\s*with((?:\s*{[a-zA-Z]+\w*\s+=\s+.+})+)\s*([\s\S]+)\s*}$/;
    
    // number
    if (num_regex.test(cs)) {
        parsed = parse_num(num_regex, cs, reserved_keywords);
    }
    // boolean
    else if (bool_regex.test(cs)) {
        parsed = parse_bool(bool_regex, cs, reserved_keywords);
    }
    // lamda
    //else if (lam_regex.test(cs)) {
    //	parsed = parse_lam(lam_regex, cs, reserved_keywords);
    //}
    // id
    else if (id_regex.test(cs)) {
        parsed = parse_id(id_regex, cs, reserved_keywords);
    }
    // with
    //else if (with_regex.test(cs)) {
    //	parsed = desugar_with
    //}
    // Parsing error
    else {
        new SyntaxError("Parse: Unable to parse syntax [or feature unimplemented]: " + cs);
    }
}

// Parses numbers
function parse_num(regex, cs) {
    var container = {};
    var matchx = regex.exec(cs);
    
    container["name"] = "num";
    container["n"] = matchx[1];

    return container;
}

// Parses booleans
function parse_bool(regex, cs, reserved) {
    var container = {};
    var matchx = regex.exec(cs);
    
    container["name"] = "bool";
    container["b"] = matchx[1];

    return container;
}

function parse_lam(regex, cs, reserved) {
    
}

// Parses ids
function parse_id(regex, cs, reserved) {
    var container = {};
    var matchx = regex.exec(cs);
    
    container["name"] = "id";
    container["id"] = matchx[1];

    return container;
}

// Desugars with statements into apps
function desugar_with(regex, cs, reserved) {
    var container = {};
    var matchx = regex.exec(cs);
        
    var assignments = matchx[1].match(/({[a-zA-Z]+\w*\s+=\s+.+})/g);
    var body = matchx[2];
    var params = [];
    var args = [];
    
    // Go through each assignments and fill the params and args lists
    assignments.forEach(function (assignment) {
        var groups = assignment.match(/{([a-zA-Z]+\w*)\s+=\s+(.+)}/);
        var param = groups[1];
        var arg = groups[2];
        
        params.push(param);
        args.push(arg);
    });

    return parse_app("{{fn {" + params.join(" ") + "} " + body + "} " + args.join(" ") + "}");
}