//********************
// 红方算法
//********************
/*坐标方向
  x0 x1 x2 x3 x4 x5 x6 x7
y0 
y1 1
y2 1                 2
y3          3     2  2
y4
y5
*/
// 全局变量
redGla = {
    'mixfood':[0,0],
    // 吃掉食物的基础分值
    'grade1' : 10,
    // 吃掉对手的基础分值
    'grade2' : 300,
    // 距离加权函数
    'distance' :　function(dis,d){//dis是距离 d是边界长度
        return (d * 2 - dis);
    },
    //既定点
    'point' : [-1,-1]
}


function redAlg(a,b,c,d){
    //a是红方蛇的位置，数据结构类似[[0,1],[0,2]]            [0,2]是蛇头
    //b是蓝方蛇的位置，数据结构类似[[5,3],[6,3],[6,2]]      [6,2]是蛇头
    //c是食物的位置,数据结构类似[[3,3],[4,4]]
    //d是棋盘格数，默认20
    var strategy = ['up','under','left','right'];
    var key = -1;
    //蛇头的位置
    var pos = a[a.length - 1].concat();
    
    // 你的代码
    var kk =  boyistart(a,b,c,d);



    var gradearr = new Array();
    var posarr = new Array();
    var pos = a[a.length - 1].concat();
    pos[1] -= 1;
    posarr.push(pos);
    var pos = a[a.length - 1].concat();
    pos[1] += 1;
    posarr.push(pos);
    var pos = a[a.length - 1].concat();
    pos[0] -= 1;
    posarr.push(pos);
    var pos = a[a.length - 1].concat();
    pos[0] += 1;
    posarr.push(pos);

    for(var i = 0; i < 4; i++){
        gradearr.push(getGrade(posarr[i],a,b,c,d));
    }
    var key0 = [0,0];
    for(var i = 0; i < 4; i++){
        if(gradearr[i] >= key0[0]){
            key0[0] = gradearr[i];
            key0[1] = i;
        }
    }
    key = key0[1];
    return strategy[kk];
}

// 两点间的距离


//
function getGrade(pos,Army,Food){//pos 是下一步的蛇头位置
    function have(array,pos){   //array 是否有点pos
        for(var i = 0; i < array.length; i++){
            if(pos[0] == array[i][0] && pos[1] == array[i][1]){
                return true;
            }
        }
        return false;
    }
    function Dis(a,b){      //a,b两点间的距离
        var x = a[0] - b[0];
        var y = a[1] - b[1];
        if(x < 0) x = x * -1;
        if(y < 0) y = y * -1;
        return x + y;
    }
    function kill(pos,a,b){ //a是否能在pos位置截断b
        var nn = 0;
        for(var i = 0; i < b.length; i++){
            if(b[i][0] == pos[0] && b[i][1] == pos[1]){
                nn = i;
                break;
            }
        } 
        if(nn == 0) return false;
        if(a.length >= nn*2) return true;
        return false;
    }
    var ID = 0;
    var MAX = 1000000;   //获胜分数
    var EATG = 10;       //食物分数
    var KILLG = 100;     //截断分数

    var grade = 0;
    //0.死亡情况
    //01越界
    if(pos[0] < 0 || pos[0] >= d || pos[1] < 0 || pos[1] >= d){
        grade = MAX * -1;
        return grade;
    }
    //02碰撞自己身体
    if(have(Army[ID],pos)){
        grade = MAX * -1;
        return grade;
    }
    //03碰撞敌方身体
    for(var i = 0;i < Army.length;i++){
        if(i != ID && Army[i] != null){
            if(have(Army[i],pos) && kill(pos,Army[ID],b) == false){
                grade = MAX * -1;
                return grade;
            }
            if(have(Army[i],pos) && kill(pos,Army[ID],Army[i])){
                grade = MAX;
                return grade;
            }
            if(Dis(Army[ID],Army[i][Army[i].length - 1]) == 1){
                grade = MAX/2 * -1;
                return grade;
            }
        }
    }

    // 1.计算食物的价值

    // 每个食物代表的价值
    var foodgrade = new Array();

    var fooddisRed = new Array();
    for(var i = 0; i < c.length; i++){
        foodgrade[i] = 0.1;
        fooddisRed[i] = [Dis(pos,c[i]),i];
        // foodgrade[i] = (i + 1) * redGla.grade1;
    } 
    for(var i = 0; i < c.length ; i++){
        for(var j = i + 1; j < c.length ; j++){
            if(fooddisRed[j][0] < fooddisRed[i][0]){
                var temp = fooddisRed[j].concat();
                fooddisRed[j] = fooddisRed[i].concat();
                fooddisRed[i] = temp.concat();
            }
        }
    }
    for(var i = 0; i < c.length; i++){
        if(fooddisRed[i][0] < (Dis(c[fooddisRed[i][1]],b[b.length -1]) - 1)){
            foodgrade[fooddisRed[i][1]] = redGla.grade1;
            break;
        }
    }
    for(var i = 0; i < c.length; i++){
        grade +=  redGla.distance(fooddisRed[i][0],d) * foodgrade[fooddisRed[i][1]];//距离价值 * 分值
    }

    //2.截断对方的价值

    var eatdis = new Array();
    for(var i = 0; i < b.length; i++){
        eatdis.push([Dis(pos,b[i]),i,0]);
        if(eatdis[i][1] >= eatdis[i][0] && a.length >= (i + 1) * 2){
            eatdis[i][2] = redGla.grade2 * ( i + 1);
        }
    }
    if(eatdis[b.length - 1][2] != 0 && a.length >= b.length*4){
        eatdis[b.length - 1][2] = 1000;
    }
    for(var i = b.length - 1; i > 0 ; i--){
        // console.log('len:'+b.length);
        // console.log('dis:'+eatdis[i][0]);
        if(eatdis[i][2] != 0){
            grade +=  redGla.distance(eatdis[i][0],d) * eatdis[i][2];//距离价值 * 分值
            grade +=  redGla.distance(eatdis[Math.floor(b.length/2)][0],d) * eatdis[i][2];//距离价值 * 分值
            break;
        }
        //grade +=  redGla.distance(eatdis[i][0],d) * eatdis[i][2];//距离价值 * 分值
    }

    return grade;
}