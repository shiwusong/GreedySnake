/*
 *
 need jquery
 *
 greedySnake - v1.0.0(2017-11-19)
 *
 石悟松
*/
function GreedySnake(){
    var greedySnake = {
        'entity' : null,        //数据
        'draw' : null,          //绘制模块
        'rule' : null,          //规则模块
    }

    /* 
        @model 数据模块
    */
    {
        var a = {
            'config' : null,       //配置信息
            'gameinfo' : null,      //游戏数据
        }

        var a1 = {
            'Height' : 400,         //canvas高度
            'Width' : 400,          //canvas宽度
            'CellYnum' : 20,        //格子数量(y轴)
            'CellXnum' : 20,        //格子数量(x轴)
            'ArmyColor' : ['red','gray'],   //对应 蛇0:红色， 蛇1:灰色
            'FoodColor' : ['pink'],         //对应 食物0:粉色
            'BarrierColor' : ['black'],      //对应 障碍0:黑色
            'DisplayTable' : 0,     //是否显示棋盘(0:不显示 1:显示)
            'MinMulNum' : 2,        //可以咬断的最小倍数(蛇0长度为4，蛇1长度为6，则蛇0可以咬断蛇1尾部长度为2的地方)
            'CutGrade' : 2,         //咬断的基础分(咬断总分 = 基础分 * 咬断长度)
            'FoodGrade' : [2],      //食物0的基础分为2
            'FoodNum' : [4],        //食物0的数量为4
            'WinGrade' : 100,       //获胜的分数
        }
        a.config = a1;

        var a2 = {
            'Army' : null,          //蛇的基本信息(like [[[0,1],[0,2]],[]])
            'Food' : null,          //food的基本信息(like [[[0,1],[0,2]],[]])
            'Barrier' : null,       //障碍物的基本信息(like [[[0,1],[0,2]],[]])
            'Gameover' : 0,         //游戏是否结束(0:未结束 1:结束)
            'Grade' : [0,0],         //当前得分情况
        };
        (function(){
            a2.Army = [[[0,0]],[[0,0]]]
            a2.Food = [[[0,0]]]
            // a2.Barrier = []
        })()
        a.gameinfo = a2;
    }
    greedySnake.entity = a;

    /*
        @model 绘制模块
    */
    {
        var b = {
            'CanvasId' : null,      //canvas id，用于获取上下文环境
            'Ctx'   : null,         //上下文环境
            'Table' : null,         //描述全局的二维数组
            'CellHeight' : null,    //格子高度
            'CellWidth' : null,     //格子宽度

            'drawcell' : null,      //棋盘绘制
            'fillcolor' : null,     //填充颜色
            'fillhead' : null,      //画蛇头
            'clear' : null,         //清除绘制
            'reTable' : null,       //映射a2数据到table数组
            'draw' : null,          //绘制
            
        };
        (function(){
            b.CanvasId = 'myCanves'
            b.CellHeight = a1.Height / a1.CellYnum;
            b.CellWidth = a1.Width / a1.CellXnum;
            b.Ctx = $("#" + b.CanvasId)[0].getContext("2d");

            b.Table = new Array();
            for(var i = 0; i < a1.CellXnum; i++){
                b.Table[i] = new Array();
                for(var j = 0; j < a1.CellYnum; j++){
                    b.Table[i][j] = 0;
                }
            }

        })();

        b.drawcell = function(){
            var ctx = b.Ctx;
            ctx.beginPath()
            for(var i = 0; i <= a1.CellXnum; i++){
                ctx.moveTo(i * b.CellWidth, 0);
                ctx.lineTo(i * b.CellWidth, a1.Height);
                ctx.stroke();
            }
            for(var i = 0; i <= a1.CellYnum; i++){
                ctx.moveTo(0, i * b.CellHeight);
                ctx.lineTo(a1.Width, i * b.CellHeight);
                ctx.stroke();
            }
        }

        //第x行第y列格子填充颜色color（x,y从0开始计数）
        b.fillcolor = function(x,y,color){
            var ctx = b.Ctx;
            ctx.beginPath()
            ctx.fillStyle=color;
            var x1 = b.CellWidth * x;
            var y1 = b.CellHeight * y;
            ctx.fillRect(x1,y1,b.CellWidth,b.CellHeight);
        }

        //画蛇头(用圆圈来表示)
        b.fillhead = function(x,y){
            var ctx = b.Ctx;
            var x1 = b.CellWidth * x + b.CellWidth/2;
            var y1 = b.CellHeight * y + b.CellHeight/2;
            ctx.beginPath();
            ctx.arc(x1,y1,b.CellWidth/2,0,2*Math.PI);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(x1,y1,2,0,2*Math.PI);
            ctx.stroke();
        }

        //清除绘制
        b.clear = function(){
            var ctx = b.Ctx;
            ctx.clearRect(0,0,a1.Width,a1.Height);
        }

        //映射a2数据到table数组
        b.reTable = function(){
            //army 10
            //food 20
            //barrier 30

            //Table置0
            for(var i = 0; i < b.Table.length; i++){
                for(var j = 0; j < b.Table[0].length; j++){
                    b.Table[i][j] = 0;
                }
            }

            //置army（蛇0 = 10 蛇1 = 11，以此类推）
            if(a2.Army != null)
            for(var i = 0; i < a2.Army.length; i++){
                if(a2.Army[i] != null)
                for(var j = 0; j < a2.Army[i].length; j++){
                    b.Table[a2.Army[i][j][0]][a2.Army[i][j][1]] = 10 + i;
                }
            }

            //置food（食物0 = 20 食物1 = 21，以此类推）
            if(a2.Food != null)
            for(var i = 0; i < a2.Food.length; i++){
                if(a2.Food[i] != null)
                for(var j = 0; j < a2.Food[i].length; j++){
                    b.Table[a2.Food[i][j][0]][a2.Food[i][j][1]] = 20 + i;
                }
            }

            //置barrier （障碍0 = 30 障碍1 = 31，以此类推）
            if(a2.Barrier != null)
            for(var i = 0; i < a2.Barrier.length; i++){
                if(a2.Barrier[i] != null)
                for(var j = 0; j < a2.Barrier[i].length; j++){
                    b.Table[a2.Barrier[i][j][0]][a2.Barrier[i][j][1]] = 30 + i;
                }
            }
        }

        //绘制
        b.draw = function(){
            b.clear();      //清除之前的绘制
            b.reTable();    //重置table信息

            //绘制基本信息
            for(var i = 0; i < b.Table.length; i++){
                for(var j = 0; j < b.Table[i].length; j++){
                    var num = b.Table[i][j];
                   
                    if(num >= 10 && num < 20){          //当标记为蛇的时候
                        var key = num % 10;
                        b.fillcolor(i,j,a1.ArmyColor[key]);
                    }else if(num >= 20 && num < 30){    //当标记为食物的时候
                        var key = num % 10;
                        b.fillcolor(i,j,a1.FoodColor[key]);
                    }else if(num >= 30 && num <40){     //当标记为障碍的时候
                        var key = num % 10;
                        b.fillcolor(i,j,a1.BarrierColor[key]);
                    }
                }
            }

            //绘制蛇头
            for(var i = 0; i < a2.Army.length; i++){
                if(a2.Army[i] != null){
                    var point = a2.Army[i][a2.Army[i].length - 1];
                    b.fillhead(point[0],point[1]);
                }
            }
            
        }
    }
    greedySnake.draw = b;

    /*
        @model 规则模块
    */
    {
        var c = {
            //rule
            'rule' : [],            //规则集合
            'regular' : null,       //规则
            'iniGame' : null,       //初始化游戏
            //common func
            'getRandomPos' : null,  //获取一个随机位置 返回值 like [0,1]
            'equalsPoint' : null,   //判断两点是否相同
            'havePoint' : null,     //判断数组是否拥有这个点（数组是二维数组）
            'getPointPos' : null,   //获取某元素在数组的位置
        }



        //获取一个随机位置 返回值 like [0,1]
        c.getRandomPos = function(){
            var pos = Array();
            pos[0] = Math.floor(Math.random() * a1.CellXnum);
            pos[1] = Math.floor(Math.random() * a1.CellYnum);
            return pos;
        }

        //判断两点是否相同
        c.equalsPoint = function(point0,point1){
            if(point0[0] == point1[0] && point0[1] == point1[1]){
                return true;
            }
            return false;
        }

        //判断数组是否拥有这个点（数组是二维数组）
        c.havePoint = function(arr,point){
            for(var i = 0; i < arr.length; i++){
                if(c.equalsPoint(arr[i], point)){
                    return true;
                }
            }
            return false;
        }

        //获取某元素在数组的位置
        c.getPointPos = function(arr,point){
            for(var i = 0; i < arr.length; i++){
                if(c.equalsPoint(arr[i], point)){
                    return i;
                }
            }
            return -1;
        }

        //优先规则判定（数值越小，优先级越大。0优先级最大）
        //0.越界
        c.rule[0]= function(Strategy,isMove){
            var table = b.Table;
            var info = a2;
            for(var i = 0; i < info.Army.length; i++){
                b.reTable();
                var army = info.Army[i];
                if(army != null){       //如果蛇还存在
                    if(isMove[i] == 0){ //如果蛇没有移动过，开始判定
                        //获取移动后的蛇头位置
                        var pos = army[army.length - 1].concat();
                        if(Strategy[i] == 'up'){
                            pos[1] = pos[1] - 1; 
                        }else if(Strategy[i] == 'under'){
                            pos[1] = pos[1] + 1; 
                        }else if(Strategy[i] == 'left'){
                            pos[0] = pos[0] - 1; 
                        }else if(Strategy[i] == 'right'){
                            pos[0] = pos[0] + 1; 
                        }

                        if(pos[0] <0 || pos[0] >= a1.CellXnum){
                            info.Army[i] = null;    //越界，蛇死亡
                            isMove[i] = 1;
                        }
                        if(pos[1] <0 || pos[1] >= a1.CellYnum){
                            info.Army[i] = null;    //越界，蛇死亡
                            isMove[i] = 1;
                        }
                    }
                }else{
                    isMove[i] = 1;
                }
            }
        }
        //1.正常行走
        c.rule[1] = function(Strategy,isMove){
            var table = b.Table;
            var info = a2;
            for(var i = 0; i < info.Army.length; i++){
                b.reTable();
                var army = info.Army[i];
                if(army != null){       //如果蛇还存在
                    if(isMove[i] == 0){ //如果蛇没有移动过，开始判定
                        //获取移动后的蛇头位置
                        var pos = army[army.length - 1].concat();
                        if(Strategy[i] == 'up'){
                            pos[1] = pos[1] - 1; 
                        }else if(Strategy[i] == 'under'){
                            pos[1] = pos[1] + 1; 
                        }else if(Strategy[i] == 'left'){
                            pos[0] = pos[0] - 1; 
                        }else if(Strategy[i] == 'right'){
                            pos[0] = pos[0] + 1; 
                        }

                        if(table[pos[0]][pos[1]] == 0){
                            army.shift();           //移动了一步
                            army.push(pos);   
                            isMove[i] = 1;      
                        }
                    }else{
                        isMove[i] = 1;
                    }
                }
            }
        }
        //2.吃食物
        c.rule[2] = function(Strategy,isMove,newfood){
            var table = b.Table;
            var info = a2;
            for(var i = 0; i < info.Army.length; i++){
                b.reTable();
                var army = info.Army[i];
                if(army != null){       //如果蛇还存在
                    if(isMove[i] == 0){ //如果蛇没有移动过，开始判定
                        //获取移动后的蛇头位置
                        var pos = army[army.length - 1].concat();
                        if(Strategy[i] == 'up'){
                            pos[1] = pos[1] - 1; 
                        }else if(Strategy[i] == 'under'){
                            pos[1] = pos[1] + 1; 
                        }else if(Strategy[i] == 'left'){
                            pos[0] = pos[0] - 1; 
                        }else if(Strategy[i] == 'right'){
                            pos[0] = pos[0] + 1; 
                        }

                        if(table[pos[0]][pos[1]] >= 20 && table[pos[0]][pos[1]] < 30){ //如果是食物
                            var key = table[pos[0]][pos[1]] % 10;
                            info.Grade[i] += a1.FoodGrade[key]; //得到吃该食物的分值
                            army.push(pos);     //长度＋1   
                            isMove[i] = 1;
                            newfood[key] += 1;
                            info.Food[key].splice(c.getPointPos(info.Food[key],pos),1);//把该食物从食物列表中删除
                        }
                    }
                }else{
                    isMove[i] = 1;
                }
            }
        }
        //3.截断对方
        c.rule[3] = function(Strategy,isMove){
            var table = b.Table;
            var info = a2;
            for(var i = 0; i < info.Army.length; i++){
                b.reTable();
                var army = info.Army[i];
                if(army != null){       //如果蛇还存在
                    if(isMove[i] == 0){ //如果蛇没有移动过，开始判定
                        //获取移动后的蛇头位置
                        var pos = army[army.length - 1].concat();
                        if(Strategy[i] == 'up'){
                            pos[1] = pos[1] - 1; 
                        }else if(Strategy[i] == 'under'){
                            pos[1] = pos[1] + 1; 
                        }else if(Strategy[i] == 'left'){
                            pos[0] = pos[0] - 1; 
                        }else if(Strategy[i] == 'right'){
                            pos[0] = pos[0] + 1; 
                        }

                        if(table[pos[0]][pos[1]] >= 10 && table[pos[0]][pos[1]] < 20){ //如果是蛇
                            var key = table[pos[0]][pos[1]] % 10;
                            if(key != i){   //如果是敌方蛇
                                var len = c.getPointPos(info.Army[key],pos);
                                if(len == -1) alert('something error in eatting！');
                                if(len == info.Army[key].length - 1 && isMove[key] == 1){
                                    info.Army[i] = null;
                                    isMove[i] = 1;
                                    info.Army[key] = null;
                                    isMove[key] = 1;
                                }else{
                                    if(isMove[key] == 1) len++;
                                    if(army.length >= len * 2){
                                        info.Army[key].splice(0,len + 1);   //咬断了
                                        army.shift();
                                        army.push(pos);
                                        info.Grade[i] += a1.CutGrade * len;
                                        isMove[i] = 1;
                                    }
                                    else{
                                        info.Army[i] = null;    //没有咬断，自己死了
                                        isMove[i] = 1;
                                    }
                                }
                            }

                              
                        }
                    }
                }else{
                    isMove[i] = 1;
                }
            }
        }
        //4.碰撞自己身体
        c.rule[4] = function(Strategy,isMove){
            var table = b.Table;
            var info = a2;
            for(var i = 0; i < info.Army.length; i++){
                b.reTable();
                var army = info.Army[i];
                if(army != null){       //如果蛇还存在
                    if(isMove[i] == 0){ //如果蛇没有移动过，开始判定
                        //获取移动后的蛇头位置
                        var pos = army[army.length - 1].concat();
                        if(Strategy[i] == 'up'){
                            pos[1] = pos[1] - 1; 
                        }else if(Strategy[i] == 'under'){
                            pos[1] = pos[1] + 1; 
                        }else if(Strategy[i] == 'left'){
                            pos[0] = pos[0] - 1; 
                        }else if(Strategy[i] == 'right'){
                            pos[0] = pos[0] + 1; 
                        }

                        if(c.havePoint(army,pos)){ //如果是自己身体
                            info.Army[i] = null;    //那就死了
                            isMove[i] = 1;
                        }
                    }
                }else{
                    isMove[i] = 1;
                }
            }
        }

        //规则
        c.regular = function(Strategy){
            //初始化isMove, 所有蛇都没有行动
            var isMove = new Array();
            for(var i = 0; i < a2.Army.length; i++){
                isMove[i] = 0;
            }
            var newfood = new Array();        //需要新增的食物
            for(var i = 0; i < a2.Food.length; i++){
                newfood[i] = 0; 
            }
            while(true){
                var over = 1;
                for(var i = 0; i < isMove.length; i++){
                    if(isMove[i] == 0){
                        over = 0;
                    }
                }
                if(over == 1) break;    //如果所有蛇都移动过了，那么退出判断
                c.rule[0](Strategy,isMove);
                c.rule[1](Strategy,isMove);
                c.rule[2](Strategy,isMove,newfood);
                c.rule[3](Strategy,isMove);
                c.rule[4](Strategy,isMove);
            }

            var allnewfood = 0;
            for(var i = 0; i < newfood.length; i++){
                allnewfood += newfood[i];
            }

            //增加食物
            var arr = new Array();
            var i = 0;
            while(true){
                var pos = c.getRandomPos();
                b.reTable();
                if(b.Table[pos[0]][pos[1]] == 0){
                    arr.push(pos);
                    i++;
                }
                if(i>=allnewfood){
                    break;
                }
            }
            var k = 0;
            for(var i = 0; i < newfood.length; i++){
                for(var j = 0; j < newfood[i]; j++){
                    a2.Food[i].push(arr[k++]);
                }
            }
            //判断游戏是否结束
            var over = 1;//如果所有蛇都死了，游戏结束
            for(var i = 0; i < a2.Army.length; i++){
                if(a2.Army[i] != null){
                    over = 0;
                }
            }
            if(over == 1) a2.Gameover = 1;
            var over = 1;//如果分数大于获胜分数，游戏结束
            for(var i = 0; i < a2.Army.length; i++){
                if(a2.Grade[i] >= a1.WinGrade){
                    a2.Gameover = 1;
                }
            }

        }

        //初始化游戏
        c.iniGame = function(){

            var allfoodnum = 0;
            for(var i = 0; i < a1.FoodNum.length; i++){
                allfoodnum += a1.FoodNum[i];
            }
            //需要随机点的数量
            var rNum = allfoodnum + a2.Army.length;
            var arr = new Array();
            var i = 0;
            while(true){
                var pos = c.getRandomPos();
                if(b.Table[pos[0]][pos[1]] == 0){
                    arr.push(pos);
                    i++;
                    b.Table[pos[0]][pos[1]] = 1;
                }
                if(i>=rNum){
                    break;
                }
            }
            var n = 0;
            //初始化蛇位置
            for(var i = 0; i < a2.Army.length; i++){
                a2.Army[i][0] = (arr[n++]);
            }
            a2.Army[0][0] = [0,0];
            a2.Army[1][0] = [0,10];
            //初始化食物位置
            for(var i = 0; i < a2.Food.length; i++){
                for(var j = 0; j < a1.FoodNum[i]; j++){
                    a2.Food[i][j] = (arr[n++]);
                }
            }
        }
    }
    greedySnake.rule = c;


    c.iniGame();
    b.draw();

    Strategy = [['under'],['up']];
    time = function(){
        if(a2.Gameover!=1){
            c.regular(Strategy);
            b.draw();
        }
        int = setTimeout('time()',500);
    }
    var int = setTimeout('time()',500);
    
}
GreedySnake();

$(document).keydown(function(event){
　　　　if(event.keyCode == 87){
　　　　　　Strategy[0] = 'up'
　　　　}
        if(event.keyCode == 83){
　　　　　　Strategy[0] = 'under'
　　　　}
        if(event.keyCode == 65){
　　　　　　Strategy[0] = 'left'
　　　　}
        if(event.keyCode == 68){
　　　　　　Strategy[0] = 'right'
　　　　}

　　　　if(event.keyCode == 38){
　　　　　　Strategy[1] = 'up'
　　　　}
        if(event.keyCode == 40){
　　　　　　Strategy[1] = 'under'
　　　　}
        if(event.keyCode == 37){
　　　　　　Strategy[1] = 'left'
　　　　}
        if(event.keyCode == 39){
　　　　　　Strategy[1] = 'right'
　　　　}
　　});

var move=function(e){
    e.preventDefault && e.preventDefault();
    e.returnValue=false;
    e.stopPropagation && e.stopPropagation();
    return false;
        }
        var keyFunc=function(e){
    if(37<=e.keyCode && e.keyCode<=40){
    return move(e);
    }
    }
// a = [1,2,3];
// print(a);
// b = $.extend(true,[],a);
// b[0] = 100;
// print(b);
