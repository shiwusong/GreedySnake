
//********************* 
// 全局变量 
//*********************

// canves宽度  800*800
length = 600,
// 行数列数
boxnum = 20,
// 每个格子的length
perlength = length/boxnum  //40
// 游戏是否结束。1是结束。
Gameover = 0;
// 上下文环境
ctx = $("#myCanves")[0].getContext("2d");

//********************
// 基本绘制函数
//********************

//棋盘绘制
function drawcell(){
    for(var i = 0;i<=boxnum;i++){
        ctx.moveTo(i*perlength,0);
        ctx.lineTo(i*perlength,length);
        ctx.stroke();
        ctx.moveTo(0,i*perlength);
        ctx.lineTo(length,i*perlength);
        ctx.stroke();
    }   
}
//第x行第y列格子填充颜色color（x,y从0开始计数）
function fillcolor(x,y,color){
    //ctx.beginPath()
    ctx.fillStyle=color;
    var x1 = perlength * x;
    var y1 = perlength * y;
    ctx.fillRect(x1,y1,perlength,perlength);
}
//画蛇头(用圆圈来表示)
function fillhead(x,y){
    var x1 = perlength * x + perlength/2;
    var y1 = perlength * y + perlength/2;
    ctx.beginPath();
    ctx.arc(x1,y1,perlength/2,0,2*Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x1,y1,2,0,2*Math.PI);
    ctx.stroke();
}
//清除绘制,重置table
function clear(){
    ctx.clearRect(0,0,length,length);
}
// 映射table
function iniTable(){
    for(var i = 0; i < table.length; i++){
        for(var j = 0; j < table.length; j++){
            table[i][j] = 0;
        }
    }
    for(var i = 0; i < redArmy.length; i++){
        x = redArmy[i][0];
        y = redArmy[i][1];
        table[x][y] = 1;
    }
    for(var i = 0; i < blueArmy.length; i++){
        x = blueArmy[i][0];
        y = blueArmy[i][1];
        table[x][y] = 2;
    }
    for(var i = 0; i < food.length; i++){
        x = food[i][0];
        y = food[i][1];
        table[x][y] = 3;
    }
}

//*********************
// 定义棋盘信息
//*********************

//0:空 1:红队 2:蓝队 3:食物 
table = new Array();
food = new Array();
redArmy = new Array();
blueArmy = new Array();
//初始化置table = 0
for(var i = 0; i < boxnum; i++){
    table[i] = new Array();
    for(var j = 0; j < boxnum; j++){
        table[i][j] = 0;
    }
}
// 删除第一个元素
function delInArmy(Army){
    Army.shift();
}
// 在最后位置添加一个元素
function addInArmy(Army,element){
    Army.push(element);
}
function delInArray(element,Arr){
    var i = getPos(element,Arr);
    if(i>=0){
        Arr.splice(i,1);
    }
}
// 判断两个元素是否一样
function isSame(a,b){
    if(a[0] == b[0] && a[1] == b[1]){
        return true;
    }
    return false;
}
// 判断元素是否在数组里面
function ishave(element,Arr){
    for(var i = 0; i < Arr.length; i++){
        if(isSame(element,Arr[i])){
            return true;
        }
    }
    return false;
} 
// 获取某元素在数组的位置
function getPos(element,Army){
    for(var i = 0; i < Army.length; i++)
    {
        //if(Army[i][0] == element[0] && Army[i][1] == element[1])
        if(isSame(Army[i],element))
        {
            return i;
        }
    }
    return -1;
}
// 获取一个随机位置
function getRandomPos(){
    var pos = Array();
    pos[0] = Math.floor(Math.random() * boxnum);
    pos[1] = Math.floor(Math.random() * boxnum);
    return pos;
}

//绘制
function draw(){
    clear();
    iniTable();
    for(var i = 0; i < table.length; i++){
        for(var j = 0; j < table[0].length; j++){
            if(table[i][j] == 1){
                fillcolor(i,j,'red');
            }
            else if(table[i][j] == 2){
                fillcolor(i,j,'blue');
            }
            else if(table[i][j] == 3){
                fillcolor(i,j,'yellow');
            }
        }
    }
    head1 = redArmy[redArmy.length - 1];
    head2 = blueArmy[blueArmy.length - 1];
    fillhead(head1[0],head1[1]);
    fillhead(head2[0],head2[1]);
}
//规则
function regular(redStrategy,blueStrategy){
    //'up' 'under' 'left' 'right'
    var redheadpos = redArmy[redArmy.length-1].concat();
    var blueheadpos = blueArmy[blueArmy.length-1].concat();
    if(redStrategy == 'up'){
        redheadpos[1] = redheadpos[1] - 1; 
    }else if(redStrategy == 'under'){
        redheadpos[1] = redheadpos[1] + 1; 
    }else if(redStrategy == 'left'){
        redheadpos[0] = redheadpos[0] - 1; 
    }else if(redStrategy == 'right'){
        redheadpos[0] = redheadpos[0] + 1; 
    }
    if(blueStrategy == 'up'){
        blueheadpos[1] = blueheadpos[1] - 1; 
    }else if(blueStrategy == 'under'){
        blueheadpos[1] = blueheadpos[1] + 1; 
    }else if(blueStrategy == 'left'){
        blueheadpos[0] = blueheadpos[0] - 1; 
    }else if(blueStrategy == 'right'){
        blueheadpos[0] = blueheadpos[0] + 1; 
    
    //1.越界 
    if(redheadpos[0]<0 || redheadpos[0] >=boxnum || redheadpos[1]<0 || redheadpos[1] >= boxnum){
        Gameover = 1;
        alert('红方越界，蓝方胜！');
    }
    if(blueheadpos[0]<0 || blueheadpos[0] >=boxnum || blueheadpos[1]<0 || blueheadpos[1] >= boxnum){
        Gameover = 1;
        alert('蓝方越界，红方胜！');
    }
    //2.正常行走
    if(isSame(redheadpos,blueheadpos) == false){
        if(table[redheadpos[0]][redheadpos[1]] == 0){
            delInArmy(redArmy);
            addInArmy(redArmy,redheadpos);
        }
        if(table[blueheadpos[0]][blueheadpos[1]] == 0){
            delInArmy(blueArmy);
            addInArmy(blueArmy,blueheadpos);
        }
    }
    //3.吃食
    if(isSame(redheadpos,blueheadpos) == false){
        if(table[redheadpos[0]][redheadpos[1]] == 3){
            addInArmy(redArmy,redheadpos);
            table[redheadpos[0]][redheadpos[1]] == 1
            delInArray(redheadpos,food);//清除食物
            //添加食物
            var p = getRandomPos();
            while(table[p[0]][p[1]] != 0){
                p = getRandomPos();
            }
            table[p[0]][p[1]] = 3;
            food.push(p);
        }
        if(table[blueheadpos[0]][blueheadpos[1]] == 3){
            addInArmy(blueArmy,blueheadpos);
            table[blueheadpos[0]][blueheadpos[1]] == 2
            delInArray(blueheadpos,food);//清除食物
            //添加食物
            var p = getRandomPos();
            while(table[p[0]][p[1]] != 0){
                p = getRandomPos();
            }
            table[p[0]][p[1]] = 3;
            food.push(p);
        }
    }
    //4.碰撞敌方
    if(isSame(redheadpos,blueheadpos)){
        Gameover = 1;
        if(redArmy.length >= blueArmy.length * 4){
            alert("红方把蓝方吃掉，红方胜！");
        }else if(redArmy.length * 4 <= blueArmy.length){
            alert("蓝方把红方吃掉，蓝方胜！")
        }
        else{
            alert("头碰头，相煎何太急。平局！");
        }
    }
    if(table[redheadpos[0]][redheadpos[1]] == 2){
        var pos = getPos(redheadpos,blueArmy) + 1;
        if(pos!=-1){
            if(redArmy.length >= pos * 2){
                // 截断敌方身体
                for(var i = 0; i < pos; i++){
                    // table[blueArmy[0][0]][blueArmy[0][1]] = 0;
                    delInArmy(blueArmy);
                }
                delInArmy(redArmy);
                addInArmy(redArmy,redheadpos);
            }else{
                Gameover = 1;
                alert('红方碰撞蓝方身体，未能截断。蓝方胜！');
            }
        }else{
            delInArmy(redArmy);
            addInArmy(redArmy,redheadpos);
        }
    }
    if(table[redheadpos[0]][redheadpos[1]] == 1){
        Gameover = 1;
        alert('红方碰撞自己身体，自杀。蓝方胜！');
    }
    if(table[blueheadpos[0]][blueheadpos[1]] == 1){
        var pos = getPos(blueheadpos,redArmy) + 1;
        if(pos!=0){
            if(blueArmy.length >= pos * 2){
                // 截断敌方身体
                for(var i = 0; i < pos; i++){
                    //table[redArmy[0][0]][redArmy[0][1]] = 0;
                    delInArmy(redArmy);
                }
                delInArmy(blueArmy);
                addInArmy(blueArmy,blueheadpos);
            }else{
                Gameover = 1;
                alert('蓝方碰撞红方身体，未能截断。红方胜！');
            }
        }else{
            delInArmy(blueArmy);
            addInArmy(blueArmy,blueheadpos);
        }
    }
    if(table[blueheadpos[0]][blueheadpos[1]] == 2){
        Gameover = 1;
        alert('蓝方碰撞自己身体，自杀。红方胜！');
    }
}
//初始化数据
function initialGame(){
    var arr = new Array();
    var i = 0;
    while(true){
        var pos = getRandomPos();
        if(ishave(pos,arr)==false){
            arr.push(pos);
            i++;
        }
        if(i>=6){
            break;
        }
    }
    redArmy.push(arr[0]);
    blueArmy.push(arr[1]);
    food = arr.splice(2,arr.length - 2).concat();
}






//*********************
// game开始
//*********************
//drawcell();
initialGame();
// clear();
draw();
function start(speed){
    var a = redArmy.concat();
    var b = blueArmy.concat();
    var c = food.concat();
    //（各自算法得到策略）
    redStrategy = redAlg(a,b,c,boxnum);
    blueStrategy = blueAlg(a,b,c,boxnum);
    //consconsole.log(redStrategy,blueStrategy)
    if(redStrategy == null){
        Gameover = 1;
        alert('红方无路可走，蓝方胜！');
    }
    if(blueStrategy == null){
        Gameover = 1;
        alert('蓝方无路可走，红方胜！');
    }
    //
    // if(Gameover == 1){
    //     clearInterval(int);
    // }
    regular(redStrategy,blueStrategy);
    draw();
    printlen();
    if(Gameover != 1){
        int = setTimeout('start('+speed+')',speed);
    }
}
