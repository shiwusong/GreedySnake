// *********************
// 树实现
// *********************

if(Array.prototype.equals)
    console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
    // attach the .equals method to Array's prototype to call it on any array
    Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;
    // compare lengths - can save a lot of time 
    if (this.length != array.length)
        return false;
    for (var i = 0, l = this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
            return false;    
        }      
        else if (this[i] != array[i]) { 
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;  
        }      
    }    
    return true;
}
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", {enumerable: false});

//判断节点局势是否相同
if(Node.prototype.equals == null){
    Node.prototype.equals = function(node){
        if(this.a.equals(node.a)){
            if(this.b.equals(node.b)){
                return true;
            }
        }
        return false;
    } 
}
//存储a,b,c
if(Node.prototype.ini == null){
    Node.prototype.ini = function(a,b,c,d,army){
        this.a = a.concat();
        this.b = b.concat();
        this.c = c.concat();
        this.d = d;
        this.army = army;
    }
}
//判断数组是否存在这个元素
if(Array.prototype.have == null){
    Array.prototype.have = function(element){
        for(var i = 0; i < Array.length; i++){
            if(this[i][0] == element[0] && this[i][1] == element[1]){
                return true;
            }
        }
        return false;
    }
}
//拷贝
if(Node.prototype.copy == null){
    Node.prototype.copy = function(){
        var node = new Node();
        node.a = this.a;
        node.b = this.b;
        node.c = this.c;
        node.d = this.d;
        node.id = this.id;
        node.grade = this.grade;
        node.army = this.army;
        node.parent = this.parent;
        node.ChildArr =  this.ChildArr;
        return node;
    }
}
//获取当前位置的下四个位置(上下左右)
function getNextPos(pos){
    var arr = new Array();
    var p = pos.concat();
    p[1] -= 1;
    arr.push(p);
    var p = pos.concat();
    p[1] += 1;
    arr.push(p);
    var p = pos.concat();
    p[0] -= 1;
    arr.push(p);
    var p = pos.concat();
    p[0] += 1;
    arr.push(p);
    return arr;
}
function Node(){
    this.id = 0;
    this.a = new Array();
    this.b = new Array();
    this.c = new Array();
    this.d = 0;
    this.grade = 0;
    this.army = '';//当前队伍
    this.parent = null;
    this.isupdate = 0;   //是否博弈更新分值
    //上下左右四个分支
    this.ChildArr = null;

}
function creatChild(root){
    var army = root.army;
    var a = root.a.concat();
    var b = root.b.concat();
    var c = root.c.concat();
    var d = root.d;
    if(army == 'red'){
        var posarr = getNextPos(b[b.length - 1]);
        for(var i = 0; i < 4; i++){
            var node = new Node();
            id++;
            node.id = id;
            node.ini(a,b,c,d,'blue');  
            if(root.ChildArr==null)
                root.ChildArr = new Array();
            root.ChildArr[i] = node;
            node.parent = root;

            if(c.have(posarr[i])){
                node.b.push(posarr[i]);
            }
            else{
                node.b.push(posarr[i]);
                node.b.shift();
            }
            node.grade = -1 * getGrade(posarr[i],b,a,c,d);
        }
    }else{
        var posarr = getNextPos(a[a.length - 1]);
        for(var i = 0; i < 4; i++){
            var node = new Node();
            id++;
            node.id = id;
            node.ini(a,b,c,d,'red');
            if(root.ChildArr==null)
                root.ChildArr = new Array();
            root.ChildArr.push(node);
            node.parent = root;
            if(c.have(posarr[i])){
                node.a.push(posarr[i]);
            }
            else{
                node.a.push(posarr[i]);
                node.a.shift();
            }
            node.grade = getGrade(posarr[i],a,b,c,d);
            var iii = root.ChildArr[0].grade;
        }
    }
}
function creat(stack,depth){
    for(var i = 0; i < depth; i++){ //每层包含 红走一步和蓝走一步
        var len = stack.length;
        for(var j = 0; j < len; j++){
            var p = stack[j];
            creatChild(p);
            for(var k = 0; k < 4; k++){
                var temp = p.ChildArr;
                var num = temp.grade;
                if(p.ChildArr[k].grade < 0){
                    p.ChildArr[k].ChildArr = null;
                }else{
                    stack.push(p.ChildArr[k]);
                }
            }
        }
        stack.splice(0,len);
        var len = stack.length;
        for(var j = 0; j < len; j++){
            var p = stack[j];
            creatChild(p);
            for(var k = 0; k < 4; k++){
                if(p.ChildArr[k].grade < 0){
                    p.ChildArr[k].ChildArr = null;
                }else{
                    stack.push(p.ChildArr[k]);
                }
            }
        }
        stack.splice(0,len);
    }
}
// 使用极大极小算法更新grade
function maxmin(root){
    var p = root;
    var stack = new Array();
    stack.push(p);
    while(stack.length >0){
        var p = stack[stack.length - 1];
        if(p.ChildArr == null){
            p.isupdate = 1;
        }else{
            var n = 0;
            for(var i = 0; i < 4; i++){             //
                var temp = p.ChildArr[i];
                if(temp.isupdate == 1){
                    n++;
                }else{
                    stack.push(temp);               //如果孩子没有更新，那么把孩子压栈
                }
            }
            if(n==4){                               //如果四个孩子都更新了，那么更新p
                if(p.army=='red'){
                    var min = p.ChildArr[0].grade;
                    for(var i = 1; i < 4; i++){
                        if(p.ChildArr[i].grade < min){
                            min = p.ChildArr[i].grade;
                        }
                    }
                    if(p.grade < min){
                        p.grade += min/2;              //如果要更新的值更大，那么就更新。
                    }
                    p.isupdate = 1;
                }else if(p.army=='blue'){
                    var max = p.ChildArr[0].grade;
                    for(var i = 1; i < 4; i++){
                        if(p.ChildArr[i].grade > max){
                            min = p.ChildArr[i].grade;
                        }
                    }
                    if(p.grade > max){
                        p.grade += max/2;      
                    }      
                    p.isupdate = 1;
                }
            }
        }
        if(p.isupdate == 1){
            stack.splice(stack.length - 1,1); //移除
        }
    }
}


function boyistart(a,b,c,d){
    var nodes = new Node();
    nodes.ini(a,b,c,d,'blue');
    var stack = new Array();
    stack.push(nodes);
    creat(stack,4);

    maxmin(nodes);
    var k = 0;
    var max = nodes.ChildArr[0].grade;
    for(var i = 1; i < 4; i++){
        if(nodes.ChildArr[i].grade > max){
            max = nodes.ChildArr[i].grade;
            k = i;
        }
    }
    return k;
}
id = 0;