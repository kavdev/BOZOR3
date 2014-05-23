
function throwParseError(expected, expr) {
    console.log("Parse error: Expected " + expected + " found " + expr + " (" + typeof expr + ")");
    throw new Error();
}

function requireType(value, type) {
    if (typeof value != type)
        throwParseError(type, value);
    return value;
}

function interpret(expr, env) {
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

    case'+':
        return requireType(interpret(expr['l']), "number") + requireType(interpret(expr['r']), "number");

    case'-':
        return requireType(interpret(expr['l']), "number") - requireType(interpret(expr['r']), "number");

    case'*':
        return requireType(interpret(expr['l']), "number") * requireType(interpret(expr['r']), "number");

    case'/':
        return requireType(interpret(expr['l']), "number") / requireType(interpret(expr['r']), "number");

    case 'eq?':

        left = interpret(expr['l']);
        right = interpret(expr['r']);

        if (typeof left == typeof right)
            return left == right;
        else
            return false;

    case 'if':

        if (requireType((interpret(expr['if']), "boolean")))
            interpret(expr['then']);
        else
            interpret(expr['else']);
        break;

    case 'fn':
        console.log("Returning a fn");
        return {args: expr['args'], body: expr['body'], env: env};

    case 'app':
        if (env == null)
            env = {};

        var closure = requireType(interpret(expr['fn']), "object");
        if (closure['args'].length != expr['args'].length)
            throw 'Mismatched argument lengths';
        for (var i = 0; i < closure['args'].length; ++ i)
            env[closure['args'][i]] = interpret(expr['args'][i]);
        return interpret(closure['body'], env);

    case 'id':
        return env[expr['s']];

    default:
        console.log("Confused? " + expr['name']);

    }

    return 0;
}

console.log(interpret({name: 'num', n: '657'}));
console.log(interpret({name: '+', l: {name: 'num', n: '123'}, r: {name: 'num', n: '456'}}));
console.log(interpret({name: 'id', s: 'x'}, {x: 3}));
console.log(interpret({name: 'app', fn: {name: 'fn', args: [], body: {name: 'num', n: '111'}}, args: []}));
console.log(interpret({name: 'app', fn: {name: 'fn', args: ['x'], body: {name: 'id', s: 'x'}}, args: [{name: 'num', n: '3'}]}));
