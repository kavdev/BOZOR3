
var source = ['with', ['z','=',14], ['+', 'z', 'z']];


function interpret(source) {
	switch (source[0]) {
	case "with":
		console.log("I'm a with!");
		var a = interpret(source[1]);
		var b = interpret(source[2]);
		console.log("a and b are: " + a + ", " + b);
		break;
	default:
		console.log("Confused.");
		break;
	}
}

interpret(source);
