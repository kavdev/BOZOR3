
function desugar_with(source) {

}

function interpret(source) {
    /* if (_is string?!?!) {
        // if (is number) else
        switch
        case "true"
        case "false"

        default
            // this is an id or unbound
    }*/
    switch (source[0]) {
    case "with":
        code = desugar_with(source);
        console.log("I'm a with!");
        var a = interpret(source[1]);
        var b = interpret(source[2]);
        console.log("a and b are: " + a + ", " + b);
        break;
    case "fn":
        break;
    case "+":
        break;
    case "-":
        break;
    case "*":
        break;
    case "/":
        break;
    case "eq?":
        break;
    case "if":
        break;
    case "fn":
        break;
    default:
        console.log("Confused.");
        break;
    }

    return 0;
}


var source = ['with', ['z','=',14], ['+', 'z', 'z']];

interpret(source);
