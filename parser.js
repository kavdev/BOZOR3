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
    
    // IMPORTANT!
    expr_regex = /([a-zA-Z]+\w*|\d+|{[\s\S]+?})/; // fails on nested {}...
    
    num_regex = /^(\d+)$/;
    bool_regex = /^[true|false]$/;
    lam_regex = /^$/;
    id_regex = /^[a-zA-Z]+\w*$/;
    if_regex = /^$/;
    binop_regex = /^$/;
    app_regex = /^$/;
    
    // {with {SYMBOL = EXPR} EXPR} -> app
    with_regex = /^{\s*with((?:\s*{[a-zA-Z]+\w*\s+=\s+.+})*)\s*([\s\S]+)\s*}$/;
    
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
    
    // found assignments
    if (assingments != null) {
        // Go through each assignments and fill the params and args lists
        assignments.forEach(function (assignment) {
            var groups = assignment.match(/{([a-zA-Z]+\w*)\s+=\s+(.+)}/);
            var param = groups[1];
            var arg = groups[2];
            
            params.push(param);
            args.push(arg);
        });
    }

    return parse_app("{{fn {" + params.join(" ") + "} " + body + "} " + args.join(", ") + "}");
}