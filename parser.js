/*
 * The Parser
 *
 * Translates concrete syntax to abstract syntax.
 *
 * SYMBOL == [a-zA-Z]+\w*
 * EXPR == any one of the parse clauses
 *
 * TODO: lamC, check for reserved sym in id, appC, binop, and if
 */
function parse(cs) {
    var operators = ["+", "-", "*", "/", "eq?", "<="];
    var reserved_keywords = ["fn", "if", "with", "true", "false"].concat(operators);
    
    var parsed = {};

    num_regex = /^(\d+)$/;
    bool_regex = /(^true$|^false$)/;
    id_regex = /^([a-zA-Z]+\w*)$/;

    // number
    if (num_regex.test(cs)) {
        parsed = parse_num(num_regex, cs, reserved_keywords);
    }
    // boolean
    else if (bool_regex.test(cs)) {
        parsed = parse_bool(bool_regex, cs, reserved_keywords);
    }
    // id
    else if (id_regex.test(cs)) {
        parsed = parse_id(id_regex, cs, reserved_keywords);
    }
    // lam
    else if (cs[0] == "fn") {
        parsed = form_lam(cs, reserved_keywords);
    }
    // if
    else if (cs[0] == "if") {
        parsed = form_if(cs, reserved_keywords);
    }
    // with
    else if (cs[0] == "with") {
        parsed = desugar_with(cs, reserved_keywords);
    }
    // binop
    else if (operators.indexOf(cs[0]) >= 0) {
        parsed = form_binop(cs, reserved_keywords);
    }
    // app
    else {
        parsed = form_app(cs, reserved_keywords);
    }
    // Parsing error
    //else {
    //   throw new SyntaxError("Parse: Unable to parse syntax [or feature unimplemented]: " + cs); 
    //}
    
    return parsed;
}

// Parses numbers
function parse_num(regex, cs, reserved) {
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
    
    console.log(matchx);
    
    container["name"] = "bool";
    container["b"] = matchx[1];

    return container;
}

// Parses ids
function parse_id(regex, cs, reserved) {
    var container = {};
    var matchx = regex.exec(cs);
    
    // Check for reserved symbols
    if (reserved.indexOf(matchx) >= 0) {
        throw new SyntaxError("Parse: Identifier is a reserved symbol: " + matchx);
    }
    
    container["name"] = "id";
    container["id"] = matchx[1];

    return container;
}

// Forms an if object
function form_if(cs, reserved) {
    var container = {};
    
    container["name"] = "if";
    container["cond"] = parse(cs[1]);
    container["then"] = parse(cs[2]);
    container["else"] = parse(cs[3]);
    
    return container
}

// Desugars with statements into apps
function desugar_with(cs, reserved) {
    var container = {};
        
    var assignments = cs[1];
    var body = cs[2];
    var params = [];
    var args = [];
    
    // found assignments
    if (assignments[0] != null) {
        // Go through each assignments and fill the params and args lists
        assignments.forEach(function (assignment) {
            var param = assignment[0];
            var arg = assignment[2];

            params.push(parse(param));
            args.push(parse(arg));
        });
    }

    container["name"] = "app";
    container["lam"] = {};
    container["lam"]["name"] = "lam";
    container["lam"]["params"] = params;
    container["lam"]["body"] = parse(body);
    container["args"] = args;
    
    return container;
}

// Forms a lambda object
function form_lam(cs, reserved) {
    var container = {};
    var idlist = cs[1];
    var params = [];
    var params_set = {};
    
    idlist.forEach(function (id) {
        params.push(parse(id));
    });
    
    // Check that there aren't any duplicate paramaters
    params_set = new Set(params);
    
    if (params.length != params_set.size) {
        throw new SyntaxError("Parse: Duplicate parameters: [" + params.join(", ") + "]");
    }
    
    container["name"] = "lam";
    container["params"] = params;
    container["body"] = parse(cs[2]);
    
    return container;
}

// Forms a binop
function form_binop(cs, reserved) {
    var container = {};
    
    container["name"] = "binop";
    container["op"] = cs[0];
    container["left"] = parse(cs[1]);
    container["right"] = parse(cs[2]);
    
    return container;
}

// Forms an application
function form_app(cs, reserved) {
    var container = {};
    var expr_list = cs.slice(1);
    var args = [];
    
    try {
        expr_list.forEach(function (expr) {
            args.push(parse(expr));
        });
    }
    catch (TypeError) {
        throw new SyntaxError("Parse: Unable to parse syntax: " + cs); 
    }
    
    container["name"] = "app";
    container["lam"] = parse(cs[0]);
    container["args"] = args;
    
    if (reserved.indexOf(container["lam"]) >= 0) {
        throw new SyntaxError("Parse: Identifier is a reserved symbol: " + container["lam"]);
    }
    
    return container;
}