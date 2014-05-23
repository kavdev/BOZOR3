
function throwParseError(expected, expr) {
    console.log("Parse error: Expected " + expected + " found " + expr);
    throw new Error();
}

function requireType(value, type) {
    if (typeof value != type)
        throwParseError(type, value);
    return value;
}

function interpret(expr) {
    switch (expr['name']) {

    case 'num':
        return parseFloat(expr['n']);

    case 'bool':
        switch (expr['b']) {
        case 'true':
            return true;
        case 'false':
            return false;
        default:
            throwParseError('bool.b', expr);
        }

    case 'with':
        break;

    case 'fn':
        break;

    case'+':
        return requireType(interpret(expr['l']), "number") + requireType(interpret(expr['r']), "number");
        break;

    case'-':
        return requireType(interpret(expr['l']), "number") - requireType(interpret(expr['r']), "number");
        break;

    case'*':
        return requireType(interpret(expr['l']), "number") * requireType(interpret(expr['r']), "number");
        break;

    case'/':
        return requireType(interpret(expr['l']), "number") / requireType(interpret(expr['r']), "number");
        break;

    case 'eq?':
        break;

    case 'if':

        if (requireType((interpret(expr['if']), "boolean")))
            interpret(expr['then']);
        else
            interpret(expr['else']);
        break;

    case 'fn':
        break;

    default:
        console.log("Confused.");

    }

    return 0;
}

console.log(interpret({name: 'num', n: '657'}));
console.log(interpret({name: '+', l: {name: 'num', n: '123'}, r: {name: 'num', n: '456'}}));
