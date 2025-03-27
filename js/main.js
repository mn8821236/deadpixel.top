// 更新页脚年份
document.getElementById('current-year').textContent = new Date().getFullYear();

// 获取DOM元素
const testScreen = document.getElementById('test-screen');
const controls = document.querySelector('.controls');
const startTest = document.getElementById('start-test');
const startFix = document.getElementById('start-fix');
const exitTest = document.getElementById('exit-test');

// 颜色配置
const colors = ['black', 'white', 'red', 'green', 'blue', 'yellow', 'cyan', 'magenta'];
let currentColorIndex = 0;
let isFixMode = false;
let fixInterval;

// 颜色切换函数
function changeColor() {
    testScreen.style.backgroundColor = colors[currentColorIndex];
    currentColorIndex = (currentColorIndex + 1) % colors.length;
}

// 全屏模式处理
function requestFullscreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
}

function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}

// 测试模式
function startTestMode() {
    isFixMode = false;
    testScreen.style.display = 'block';
    controls.style.display = 'block';
    document.body.style.overflow = 'hidden';
    currentColorIndex = 0;
    changeColor();
    
    if (fixInterval) {
        clearInterval(fixInterval);
        fixInterval = null;
    }
    
    requestFullscreen(document.documentElement);
}

// 修复模式
function startFixMode() {
    isFixMode = true;
    testScreen.style.display = 'block';
    controls.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    requestFullscreen(document.documentElement);
    
    // 快速切换颜色以尝试修复死像素
    fixInterval = setInterval(changeColor, 100); // 每100毫秒切换一次颜色
}

// 退出测试/修复模式
function exitTestMode() {
    testScreen.style.display = 'none';
    controls.style.display = 'none';
    document.body.style.overflow = 'auto';
    
    if (fixInterval) {
        clearInterval(fixInterval);
        fixInterval = null;
    }
    
    exitFullscreen();
}

// 事件监听器
startTest.addEventListener('click', (e) => {
    e.preventDefault();
    startTestMode();
});

startFix.addEventListener('click', (e) => {
    e.preventDefault();
    startFixMode();
});

testScreen.addEventListener('click', () => {
    if (!isFixMode) {
        changeColor();
    }
});

document.addEventListener('keydown', (e) => {
    if (testScreen.style.display === 'block') {
        if (e.key === 'Escape') {
            exitTestMode();
        } else if (e.key === ' ' && !isFixMode) {
            changeColor();
        }
    }
});

// 添加退出按钮事件监听
exitTest.addEventListener('click', (e) => {
    e.preventDefault();
    exitTestMode();
});

// 添加触摸事件处理
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

// 监听触摸开始
testScreen.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
});

// 监听触摸结束
testScreen.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
});

// 处理滑动手势
function handleSwipe() {
    // 检测下拉手势作为退出
    const deltaY = touchEndY - touchStartY;
    const deltaX = touchEndX - touchStartX;
    
    // 如果是明显的下拉手势
    if (deltaY > 100 && Math.abs(deltaX) < 50) {
        exitTestMode();
    }
    // 如果是水平滑动并且不是太大的下拉手势
    else if (Math.abs(deltaY) < 50 && !isFixMode) {
        changeColor();
    }
} 