
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
        }

    case'+':
        return requireType(interpret(expr['left']), "number") + requireType(interpret(expr['right']), "number");

    case'-':
        return requireType(interpret(expr['left']), "number") - requireType(interpret(expr['right']), "number");

    case'*':
        return requireType(interpret(expr['left']), "number") * requireType(interpret(expr['right']), "number");

    case'/':
        return requireType(interpret(expr['left']), "number") / requireType(interpret(expr['right']), "number");

    case 'eq?':
        left = interpret(expr['left']);
        right = interpret(expr['right']);

        if (typeof left == typeof right)
            return left == right;
        else
            return false;

    case '<=':
        return requireType(interpret(expr['left']), "number") <= requireType(interpret(expr['right']), "number");

    case 'if':
        if (requireType((interpret(expr['if']), "boolean")))
            interpret(expr['then']);
        else
            interpret(expr['else']);
        break;

    case 'lam':
        return {args: expr['params'], body: expr['body'], env: env};

    case 'app':
        if (env == null)
            env = {};

        var closure = requireType(interpret(expr['lam']), "object");
        if (closure['args'].length != expr['args'].length)
            throw 'Mismatched argument lengths';
        for (var i = 0; i < closure['args'].length; ++ i)
            env[closure['args'][i]] = interpret(expr['args'][i]);
        return interpret(closure['body'], env);

    case 'id':
        return env[expr['id']];

    default:
        console.log("Confused? " + expr['name']);

    }

    return 0;
}

console.log(interpret({name: 'num', n: '657'}));
console.log(interpret({name: '+', left: {name: 'num', n: '123'}, right: {name: 'num', n: '456'}}));
console.log(interpret({name: 'id', id: 'x'}, {x: 3}));
console.log(interpret({name: 'app', lam: {name: 'lam', params: [], body: {name: 'num', n: '111'}}, args: []}));
console.log(interpret({name: 'app', lam: {name: 'lam', params: ['x'], body: {name: 'id', id: 'x'}}, args: [{name: 'num', n: '3'}]}));
