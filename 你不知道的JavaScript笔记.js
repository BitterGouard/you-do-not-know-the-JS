// 现代模块
// 首先是匿名函数立即运行，返回一个对象，对象包含2个方法，一个定义模块，一个get获取模块
// 定义模块:name ：定义的模块名，字符串   deps：依赖的列表  impl 模块的实现




var MyModules = (function Manager() {
    //保存所有定义的模块
    var modules = {}
    /**
     *定义新模块，接收3个参数
     *name:模块名
     *deps:模块依赖的其他模块
     *impl:模块的定义
    **/
    function define(name, deps, impl){
        //这个 impl 相当于callback 只是一个函数名 这里不传参 在里面需要传参的地方在传. 同时在调用的时候 impl这里直接传参就行.
        //遍历依赖每一项，取出每个模块
        for (var i = 0; i < deps.length; i++) {
            // console.log('deps1', deps)
            // 让数组中存储的是字典(自定义的模块)
            deps[i] = modules[deps[i]]
            // console.log('deps11', deps)
            // console.log('modules', modules['bar'])
        }
        // console.log('deps11', deps)
        //如果不用 apply 的话, 当调用定义 foo库的时候 就不会把 bar 库传入.
        //将新模块存储进模块池，并注入依赖(新定义的库可能还需要用的其他的库,比如 foo库 就用到了bar库)
        // 这个impl 的调用,是在 define 定义里面的里面调用的
        modules[name] = impl.apply(impl, deps)  // 可以试试impl() 就是不用 apply, 这里只是为了把参数传进来(也是把库传进来) 比如 foo这个库 的impl
                                                // 这个库需要用到 bar 库 把bar库 作为参数传入 bar 就是字典{bar:{hello:hello(who)}}
                                                // impl 的返回值赋给了 mmodule[name] foo库也就是 {foo:{awesome: awesome}}
        console.log('modulesName', modules[name])
        console.log('modules', modules)

    }
    //从模块池中取出模块
    function get(name) {
        return modules[name]
    }
    //暴露api
    return {
        define: define,
        get: get,
    }
})()
MyModules.define('bar', [], function(){
    function hello(who) {
        return 'let me introduce' + who
    }
    return {
        hello: hello,
    }
})
MyModules.define('foo', ['bar'], function(bar) {
    //这个参数bar 其实是 bar库
    // 这个参数bar 写 aaa 也行, 因为函数定义的时候,这个参数已经订好了, 所以你写什么都无所谓,参数写什么都行impl的参数就是deps
    //函数定义时候的impl 就相当于callback,在定义的时候 函数名不写参数,具体里面用的时候(在定义里面) 直接把参数穿进去.
    // console.log('bar', bar) //这个bar 就是  modules[name] = impl.apply(impl, deps) 中的 deps(也就是 bar 模块, 因为foo中用到了bar模块)
    var hungry = "hippo"
    function awesome() {
        console.log( bar.hello(hungry).toUpperCase())
    }
    return {
            awesome: awesome,
        }
})

var bar = MyModules.get('bar')
var foo = MyModules.get('foo')
console.log(bar.hello('lee'))
foo.awesome()

第二部分 this

function foo() {
    console.log('this', this)
    console.log('a', a)
}
function bar() {
    var a = 3
    foo()
}
var a = 2
bar()


var obj = {
    count: 0,
    cool: function () {
        if (this.count < 1) {
            setTimeout(() => {
                this.count++
                console.log('lee')
            }, 1000)
        }
    }
}
obj.cool()


p76
function foo(num) {
    console.log('foo:' + num)
    console.log('keys', Object.keys(foo)) //函数里面第一的函数属性是看不到的 外面的可以看到.
    foo.count1 = 11                       // 但是这个属性都是存在的 只是 Object.keys(foo) 看不到
    this.count++
}
foo.count1 = 0


function foo1() {
    console.log('foo:' + num)
    // console.log('keys', Object.keys(foo))

    foo.count = 4
    console.log('foo1 ', foo1);
}



p80
function foo() {
    var a = 2
    this.bar()
    console.log('this', this);
}
// var a =  10
function bar() {
    var a = 20
    console.log('a', this.a); //this.a是访问不到 a = 20 的
}


function foo() {
    console.log(this.a)
}
var a = 2
(function() {
    'use strict'
    foo()
})()

p82
var a = 200
function baz() {
    console.log('baz')
    bar()
}

function bar() {
    console.log('bar')
    var a = 111
    foo()
}
function foo() {
    console.log('foo', this.a)
}
baz()  // foo 200

p85

function foo() {
    console.log('this', this.a);
}
var obj3 = {
    a: 3,
    foo: foo
}
var obj2 = {
    a: 2,
    obj3: obj3
}
var obj1 = {
    a: 1,
    obj2: obj2
}
obj1.obj2.obj3.foo()


p86

function foo() {
    console.log('this', this, this.a);
}

function doFoo(fn) {
    console.log('doFoo this', this)
    foo()
}
var obj = {
    a: 2,
    foo: foo,
}
var a = 'opps, global'
doFoo(obj.foo)


p88

function foo() {
    console.log('thisa', this.a)
}
var obj = {
    a: 2,
}
var  a = 'lee'

var bar = function () {
    foo.call(window)
}
bar()

p89
下面的foo 测试 arguments 对象
function foo(something) {
    console.log('thisa', this.a)
    console.log('something', something, typeof something)
    // for (var i = 0; i < something.length; i++) {
    //     var some = something[i]
    //     console.log('some', some)  // 这个some 就是我下面的 s,他才是真正的 传进来的数组
    // }
    var some = something[0]  // 这个 0 其实是arguments 对象的 key
    for (var i = 0; i < some.length; i++) {
        var s = some[i]
        console.log('s', s)
    }
}
var obj = {
    a: 2,
}
var bar = function () {
    return foo.call(obj, arguments)  // call
}
var b = bar([3,4,5],[1,1,1])   //试试 [3,4,5],[1,1,1]


原书代码级arguments
function foo(something, fuck, shit, bitch, stupid) {
    console.log('fucks', arguments) // 这个arguments 其实就是foo.apply(obj, arguments) 里面的 arguments
    console.log('thisa', something, fuck, shit, bitch)
    // console.log('something', something, typeof something)
    // for (var i = 0; i < something.length; i++) {
    //     var some = something[i]
    //     console.log('some', some)  // 这个some 就是我下面的 s,他才是真正的 传进来的数组
    // }
    // var some = something[0]  // 这个 0 其实是arguments 对象的 key
    // for (var i = 0; i < some.length; i++) {
    //     var s = some[i]
    //     console.log('s', s)
    // }
}

var obj = {
    a: 2,
}
var bar = function () {
    console.log('arguments是', arguments)
    return foo.apply(obj, arguments)  // apply: bar 在接受参数时候,把所有接受的参数放到arguments里面,arguments 是一个类数组的对象,这个arguments的
                                      //key 就是 0 1 2 这样的(规定), 它的 value 就是你传入的参数的值,这个arguments 和你传入的的数组([11])是不一样的概念
                                      //apply 会把这个arguments 数组拍平, 在把参数一个一个的传给你的函数(这里就是foo函数),()书中的源码只要了一个参数
                                      //所以 something, fuck, shit, bitch, stupid等参数就对应着 argument 的值;(超出 arguments 的参数就是undefined)
                                      // 这些参数的名字是可以改的(随便起), 也证明了函数在调用的时候,参数名字不重要(可以自己随便起)
}
var b = bar([11],4, 5, 6)  // 这么传的话 参数就只有一个 那就是 4
console.log(b)



var log =  function () {
    console.log('arguments', arguments, Object.keys(arguments))
    console.log('arguments11111', arguments[0],arguments[1],arguments[2])
    console.log.apply(console, arguments)
}
