
/* 
    方向键控制蛇的移动方向
    绑定按键事件
        -- keydown 按下
        -- keyup   松开
    键盘事件只能绑定给可以获取焦点的元素或者是document
        -- 焦点：例如点击input的框，就算获取焦点
        -- event.keyCode获取按键的ASCII码
        -- event.key获取对应按键的名字（推荐使用）
*/
// 获取蛇的容器
const snake = document.getElementById("snake")
// 蛇的身体
const snakeBody = snake.getElementsByTagName("div")

// 用数组储存合法的按钮
const keyArr = ["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"]
 // 获取分数
const scoreSpan = document.getElementById("score") 
// 获取等级
const levelSpan = document.getElementById("level")
// 创建变量储存当前分数和等级 
let score = 0
let level = 0
/* 
    禁止掉头
        1- 身体超过两节
        2- 按的方向不能是相反的方向
    处理：
        掉头的时候保持原来的方向不变 -- 不修改dir的值
*/
// 定义一个变量存储移动方向
let dir;
// 创建一个变量记录按键状态
let keyActive = true;

const reObj = {
    ArrowDown:"ArrowUp",
    ArrowUp:"ArrowDown",
    ArrowRight:"ArrowLeft",
    ArrowLeft:"ArrowRight"
}

document.addEventListener("keydown",(event)=>{
// 判断用户输入的按键是否合法
    if(keyActive && keyArr.includes(event.key)){
        // 蛇的身体大于1节的时候，才需要处理掉头问题
        if(snakeBody.length < 2 || reObj[dir] !== event.key){
             // 设置方向
             dir = event.key; 
             keyActive = false; // 将按键设置为禁用状态，无法重复按同一个按键
        } 
            // 判断蛇是否掉头
            /* 
                例如，按下ArrowUp的时候，dir在reObj里面的取值是ArrowDown，跟实际的event.key相反，
                此时把实际的event.key赋值给dir，让蛇按预定方向行走

                此时蛇在往上走，event.key是ArrowDown; 当按下ArrowDown的时候，dir的值和event.key相等，
                于是就不会执行判断后面的代码，实现蛇无法掉头的效果。
            */             
    }
})
 // 获取食物
 const food = document.getElementById("food")
    // 食物的坐标应该在0~290之间,且必须是10的倍数
    function changeFood(){
        // 要生成的是0~29之间的随机数,在乘以10,保证是10的倍数
        const x = Math.floor(Math.random()*29)*10
        const y = Math.floor(Math.random()*29)*10
        // 设置食物的坐标
        food.style.left = x + "px"
        food.style.top = y + "px"            
    }
    // 每次开始游戏都使食物的位置随机更新
    changeFood()

    // 开始游戏之前，蛇的位置也随机出现
    function snakePosition(){
        const x = Math.floor(Math.random()*29)*10
        const y = Math.floor(Math.random()*29)*10
        snakeBody[0].style.left = x + "px"
        snakeBody[0].style.top = y + "px"            
    }
    snakePosition()
    
/* 
    通过改变蛇尾的位置，实现蛇身体的跟随移动
*/

// 定时器控制移动速度，每过一段时间判断dir来决定移动方向
let timer;
timer = setTimeout(function move(){
    // 在move函数生效后，将按键打开，此时可以再次改变方向
    keyActive = true;
    // 蛇头
    const head = snakeBody[0];
    // 获取蛇头的偏移量
    let x = head.offsetLeft;
    let y = head.offsetTop;
    // 根据传入的键决定移动方向,若传入别的键位,就会停止
    switch (dir) {
        // .offsetTop/Left -- 获取元素相对于父元素的对应方向的偏移量
        case "ArrowUp":
                y-= 10 
            break;
        case "ArrowDown":
                y+= 10
            break;
        case "ArrowLeft":
                x-= 10 
            break;
        case "ArrowRight":
                x+= 10 
            break;
    }
   

    // 检查蛇是否吃到了食物 --- 判断他们的坐标是否相等
    if( 
        head.offsetTop == food.offsetTop && 
        head.offsetLeft == food.offsetLeft){
        // 吃到食物后改变食物的位置
        changeFood()
        // 增加蛇的身体
        snake.insertAdjacentHTML("beforeend","<div/>")
        // 吃到了食物之后，分数+1 -- 自增
        score++
        scoreSpan.textContent = score;
        // 吃到x个食物后，等级+1; 控制最大等级，防止速度随等级增加而导致过快
        if(score % 3 == 0 && level < 10){
            level++
            levelSpan.textContent = level + 1
        }
    }
    
    /* 
        判断游戏结束的条件
            1- 撞墙(触碰到边界)
            2- 撞自己(蛇头坐标等于任一蛇身坐标)
    */
    // 判断撞墙
    if(x < 0 || x > 290 || y < 0 || y > 290){
        
        let flag = confirm('游戏结束，要再来一局吗？')
        if(flag){
            location.reload();
        } else{
            alert("下次加油")
            return // return可以直接结束函数，后面的代码不会再执行
        }
    } 
    // 判断是否撞到自己,需要一个一个判断蛇身坐标和蛇头坐标是否相等
    // 从i = 1开始判断，即蛇有两节身体的时候才开始判断是否与自己碰撞
    for(let i = 1;i < snakeBody.length; i++){
        if(snakeBody[i].offsetLeft == x && 
           snakeBody[i].offsetTop == y ){
            let flag = confirm('游戏结束，要再来一局吗？')
            if(flag){
                location.reload();
            } else{
            alert("下次加油")
            return // return可以直接结束函数，后面的代码不会再执行
        }
    }
}
    // 获取尾巴
    // 游戏开始的时候，snakeBody里面只有蛇头一个元素，此时蛇尾相当于蛇头
    // snakeBody是一个实时更新的伪数组
    const tail = snakeBody[snakeBody.length-1]
    // 移动蛇的位置
    tail.style.left = x+"px";   
    tail.style.top = y+"px";
    /* 
        吃到食物后，创建了一个新的蛇身div，样式和旧的蛇头重叠，
        在后面的移动中，操作的都是新的蛇身div，
        因此在下一次向右移动中，新的蛇身div将会向右移动10px。


        但是，旧蛇头div的坐标没有变化，而蛇身的移动是以旧蛇头位置的偏移量
        为基础的，此时旧蛇头的坐标一直保持不变，导致下一次向右移动的更新时，更新的
        仍然是蛇身div相对于旧蛇头的偏移量，导致蛇身看起来没有移动

        所以需要把新的蛇身div，设置成蛇头，动态更新蛇头的位置

    */
    snake.insertAdjacentElement("afterbegin",tail)
    
    // 动态控制蛇行速度，最小速度是80
    setTimeout(move,200-level*12)

},300)

