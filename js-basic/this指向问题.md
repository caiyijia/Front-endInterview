```js
    var a = 1,
        b = 2;

    function Add() {
        var a = 10,
            b = 20;
        console.log(this.a + this.b)
    }

    var newAdd = new Add.bind({a:100, b:200})
    new Add(); // NaN
    Add();  // 3
    new newAdd(); //NaN
    newAdd(); // 300
```

```js
Array.prototype.method = function() {
        console.log(this.length)
    }
    var arr = [1, 2, 3];
    arr.name = 'cyj';
    for(var value of arr){
        console.log(value)
    }
    for(var i in arr){
        console.log(arr[i])
    }

/*
	输出结果：
	1
	2
	3
	1
	2
	3
	cyj
	f () {
		console.lof(this.length)
	}
*/
```

