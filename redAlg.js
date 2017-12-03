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
    'food':[0,0]
}
function have(array,pos){
    for(var i = 0; i < array.length; i++){
        if(pos[0] == array[i][0] && pos[1] == array[i][1]){
            return true;
        }
    }
    return false;
}
function kill(pos,a,b){
    var nn = -1;
    for(var i = 0; i < b.length; i++){
        if(b[i][0] == pos[0] && b[i][1] == pos[1]){
            nn = i;
            break;
        }
    } 
    if(nn == -1) return false;
    if(a.length >= (nn+1)*2) return true;
    return false;

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
    
    
    //可行走的方向
    var able = [0,0,0,0];
    //右行
    pos = a[a.length - 1].concat();
    pos[0] += 1;
    if(pos[0]<d && have(b,pos) == false && have(a,pos) == false){
        able[3] = 1;
    }
    if(kill(pos,a,b)) able[3] = 1;
    //左行
    pos = a[a.length - 1].concat();
    pos[0] -= 1;
    if(pos[0]>=0 && have(b,pos)==false && have(a,pos) == false){
        able[2] = 1;
    }
    if(kill(pos,a,b)) able[2] = 1;
    //上行
    pos = a[a.length - 1].concat();
    pos[1] -= 1;
    if(pos[1]>=0 && have(b,pos)==false && have(a,pos) == false){
        able[0] = 1;
    }
    if(kill(pos,a,b)) able[0] = 1;
    //下行
    pos = a[a.length - 1].concat();
    pos[1] += 1;
    if(pos[1]<d && have(b,pos)==false && have(a,pos) == false){
        able[1] = 1;
    }
    if(kill(pos,a,b)) able[1] = 1;
    //最好的方向
    var good = [0,0,0,0];
    pos = a[a.length - 1].concat();
    if(have(c,redGla.food) == false){
        var num = Math.floor(Math.random()*c.length);
        redGla.food = c[num].concat();
        //console.log('red:'+getPos(redGla.food,c));
    }
    if(redGla.food[0]>pos[0]){
        good[3] = 1;
    }
    if(redGla.food[0]<pos[0]){
        good[2] = 1;
    }
    if(redGla.food[1]>pos[1]){
        good[1] = 1;
    }
    if(redGla.food[1]<pos[1]){
        good[0] = 1;
    }

    for(var i = 0;i < 4; i++){
        if(able[i] == 1 && good[i] == 1){
            while(true){
                var r = Math.floor(Math.random()*4);
                if(able[r] == 1 && good[r] == 1){
                    key = r;
                    break;
                }
            }
            break;
        }
    }
    if(key == -1){
        var bb = 50;
        while(true){
            var r = Math.floor(Math.random()*4);
            if(able[r] == 1){
                key = r;
                break;
            }
            bb--;
            if(bb<=0){
                break;
            }
        }
    }
    return strategy[key];
}