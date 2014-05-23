
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
        return requireType(interpret(expr['left'], env), "number") + requireType(interpret(expr['right'], env), "number");

    case'-':
        return requireType(interpret(expr['left'], env), "number") - requireType(interpret(expr['right'], env), "number");

    case'*':
        return requireType(interpret(expr['left'], env), "number") * requireType(interpret(expr['right'], env), "number");

    case'/':
        return requireType(interpret(expr['left'], env), "number") / requireType(interpret(expr['right'], env), "number");

    case 'eq?':
        left = interpret(expr['left'], env);
        right = interpret(expr['right'], env);

        if (typeof left == typeof right)
            return left == right;
        else
            return false;

    case '<=':
        return requireType(interpret(expr['left'], env), "number") <= requireType(interpret(expr['right'], env), "number");

    case 'if':
        if (requireType((interpret(expr['if'], env), "boolean")))
            interpret(expr['then'], env);
        else
            interpret(expr['else'], env);
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

test("numbers", function() {
    ok(657 === interpret({name: 'num', n: '657'}));
    ok(123 === interpret({name: 'num', n: '123'}));
});

test("binops", function() {
    ok(579 === interpret({name: '+', left: {name: 'num', n: '123'}, right: {name: 'num', n: '456'}}));
    ok( 28 === interpret({name: '*', left: {name: 'num', n: '4'}, right: {name: 'num', n: '7'}}));
    ok(  3 === interpret({name: '/', left: {name: 'num', n: '9'}, right: {name: 'num', n: '3'}}));
    ok(100 === interpret({name: '-', left: {name: 'num', n: '123'}, right: {name: 'num', n: '23'}}));
});

test("identifiers", function() {
    ok(3   === interpret({name: 'id', id: 'x'}, {x: 3}));
    ok(7   === interpret({name: 'id', id: 'xyz'}, {abc: 2, xyz: 7}));
});

test("lambdas/applications", function() {
    ok(111 === interpret({name: 'app', lam: {name: 'lam', params: [], body: {name: 'num', n: '111'}}, args: []}));
    ok(3   === interpret({name: 'app', lam: {name: 'lam', params: ['x'], body: {name: 'id', id: 'x'}}, args: [{name: 'num', n: '3'}]}));
    ok(3   === interpret({name: 'app', lam: {name: 'lam', params: ['x', 'y'],
        body: {name: '/', left: {name: 'id', id: 'x'}, right: {name: 'id', id: 'y'}}},
        args: [{name: 'num', n: '21'}, {name: 'num', n: '7'}]}));
});
