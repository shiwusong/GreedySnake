//********************
// 蓝方算法
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
blueGla = {
    'food':[0,0]
}
function blueAlg(a,b,c,d){

    var e = a.concat();
    a = b.concat();
    b = e.concat();

    //a是红方蛇的位置，数据结构类似[[0,1],[0,2]]            [0,2]是蛇头
    //b是蓝方蛇的位置，数据结构类似[[5,3],[6,3],[6,2]]      [6,2]是蛇头
    //c是食物的位置,数据结构类似[[3,3],[4,4]]
    //d是棋盘格数，默认20
    var strategy = ['up','under','left','right'];
    var key = -1;
    //蛇头的位置
    var pos = a[a.length - 1].concat();
    
    // 你的代码
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
    return strategy[key];
}