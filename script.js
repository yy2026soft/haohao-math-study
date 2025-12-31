// 易明浩数学学习乐园脚本
let currentOperation = '';
let currentDifficulty = 10;
let currentAnswer = 0;
let multiplicationSongTimer = null; // 乘法表儿歌定时器
let currentQuestionNumber = 1; // 当前题号
let totalQuestions = 50; // 总题数
let correctCount = 0; // 答对题数
let wrongCount = 0; // 答错题数
let currentQuestion = null; // 当前题目数据
let stamps = 0; // 印章积分
let nextRewardCount = 10; // 下一个奖励需要的答对题数

// 答题记录相关
let quizHistory = []; // 答题历史记录
let currentSession = null; // 当前答题会话

// 页面切换功能
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
}

// 返回主页面
function backToMain() {
    showPage('mainPage');
}

// 显示学习历史
function showHistory() {
    showPage('historyPage');
    updateHistoryDisplay();
    updateStatisticsOverview();
}

// 加法探险
function startAddition() {
    currentOperation = 'addition';
    resetQuizState();
    showPage('questionPage');
    generateQuestion();
}

// 减法迷宫
function startSubtraction() {
    currentOperation = 'subtraction';
    resetQuizState();
    showPage('questionPage');
    generateQuestion();
}

// 乘法城堡
function startMultiplication() {
    currentOperation = 'multiplication';
    resetQuizState();
    showPage('questionPage');
    generateQuestion();
}

// 除法海洋
function startDivision() {
    currentOperation = 'division';
    resetQuizState();
    showPage('questionPage');
    generateQuestion();
}

// 初始化答题记录
function initQuizHistory() {
    const saved = localStorage.getItem('ultraMathHistory');
    if (saved) {
        quizHistory = JSON.parse(saved);
    } else {
        quizHistory = [];
        saveQuizHistory();
    }
}

// 保存答题记录
function saveQuizHistory() {
    localStorage.setItem('ultraMathHistory', JSON.stringify(quizHistory));
}

// 开始新的答题会话
function startNewSession() {
    currentSession = {
        id: Date.now(),
        date: new Date().toISOString(),
        operation: currentOperation,
        difficulty: currentDifficulty,
        questions: [],
        correctCount: 0,
        wrongCount: 0,
        totalCorrect: 0,
        totalStamps: 0
    };
}

// 记录题目答案
function recordQuestion(question, userAnswer, isCorrect) {
    if (!currentSession) return;
    
    const record = {
        question: question.question,
        userAnswer: userAnswer,
        correctAnswer: question.answer,
        isCorrect: isCorrect,
        timestamp: new Date().toISOString()
    };
    
    currentSession.questions.push(record);
    if (isCorrect) {
        currentSession.correctCount++;
        currentSession.totalCorrect++;
    } else {
        currentSession.wrongCount++;
    }
}

// 结束答题会话
function endSession() {
    if (!currentSession) return;
    
    currentSession.endTime = new Date().toISOString();
    currentSession.totalStamps = currentSession.totalCorrect >= 10 ? 1 + Math.floor((currentSession.totalCorrect - 10) / 10) * 2 : 0;
    
    // 添加到历史记录
    quizHistory.unshift(currentSession);
    
    // 保持最近100条记录
    if (quizHistory.length > 100) {
        quizHistory = quizHistory.slice(0, 100);
    }
    
    saveQuizHistory();
    currentSession = null;
}

// 重置答题状态
function resetQuizState() {
    currentQuestionNumber = 1;
    correctCount = 0;
    wrongCount = 0;
    currentQuestion = null;
    stamps = 0;
    nextRewardCount = 10;
    startNewSession();
}

// 显示99乘法表
function showMultiplicationTable() {
    showPage('multiplicationTablePage');
    generateMultiplicationTable();
}

// 显示学习历史
function showHistory() {
    showPage('historyPage');
    updateHistoryDisplay();
    updateStatisticsOverview();
}

// 生成99乘法表
function generateMultiplicationTable(tableId = 'multiplicationTable') {
    const tableContainer = document.getElementById(tableId);
    if (!tableContainer) return;
    
    tableContainer.innerHTML = '';
    
    // 创建彩虹色渐变背景
    const colors = [
        'linear-gradient(135deg, #ff9ff3 0%, #feca57 100%)',
        'linear-gradient(135deg, #48dbfb 0%, #0abde3 100%)',
        'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
        'linear-gradient(135deg, #54a0ff 0%, #5f27cd 100%)',
        'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)',
        'linear-gradient(135deg, #feca57 0%, #ff9ff3 100%)',
        'linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%)',
        'linear-gradient(135deg, #fd79a8 0%, #fcb045 100%)'
    ];
    
    // 创建美观的表格布局
    for (let i = 1; i <= 9; i++) {
        const rowContainer = document.createElement('div');
        rowContainer.className = 'multiplication-row';
        
        // 行标题
        const rowHeader = document.createElement('div');
        rowHeader.className = 'row-header';
        rowHeader.textContent = i;
        rowHeader.style.background = colors[i - 1];
        rowContainer.appendChild(rowHeader);
        
        // 添加这一行的乘法口诀
        const cellsContainer = document.createElement('div');
        cellsContainer.className = 'cells-container';
        
        for (let j = 1; j <= i; j++) {
            const cell = document.createElement('div');
            cell.className = 'multiplication-cell';
            cell.style.background = colors[j - 1];
            cell.innerHTML = `
                <div class="cell-top">${i} × ${j}</div>
                <div class="cell-bottom">${i * j}</div>
            `;
            cell.onclick = function() {
                speakMultiplication(i, j, i * j);
                highlightCell(this);
            };
            cellsContainer.appendChild(cell);
        }
        
        rowContainer.appendChild(cellsContainer);
        tableContainer.appendChild(rowContainer);
    }
}

// 朗读乘法口诀
function speakMultiplication(a, b, result) {
    const formula = `${a}乘以${b}等于${result}`;
    speakText(formula);
}

// 高亮单元格
function highlightCell(cell) {
    // 移除所有高亮
    document.querySelectorAll('.multiplication-cell').forEach(c => {
        c.classList.remove('highlighted');
    });
    
    // 添加高亮
    cell.classList.add('highlighted');
    
    // 1秒后移除高亮
    setTimeout(() => {
        cell.classList.remove('highlighted');
    }, 1000);
}

// 播放99乘法表儿歌
function playMultiplicationSong() {
    if (multiplicationSongTimer) {
        return; // 如果正在播放，不重复开始
    }
    
    const playBtn = document.querySelector('.play-song-btn');
    const stopBtn = document.getElementById('stopSongBtn');
    
    // 切换按钮显示
    playBtn.style.display = 'none';
    stopBtn.style.display = 'flex';
    
    let currentIndex = 0;
    
    const lyrics = [
        "小朋友们，跟我一起念乘法口诀吧！一一得一",
        "一二得二，一三得三，一四得四，一五得五",
        "一六得六，一七得七，一八得八，一九得九",
        "二二得四，二三得六，二四得八，二五一十",
        "二六十二，二七十四，二八十六，二九十八",
        "三三得九，三四十二，三五一十五",
        "三六十八，三七二十一，三八二十四，三九二十七",
        "四四十六，四五二十，四六二十四",
        "四七二十八，四八三十二，四九三十六",
        "五五二十五，五六三十，五七三十五",
        "五八四十，五九四十五",
        "六六三十六，六七四十二，六八四十八，六九五十四",
        "七七四十九，七八五十六，七九六十三",
        "八八六十四，八九七十二",
        "九九八十一，乘法口诀记心间！"
    ];
    
    // 播放第一句介绍
    speakText("小朋友们，跟我一起念乘法口诀吧！");
    
    // 延迟开始播放，让介绍语说完
    setTimeout(() => {
        // 开始播放儿歌
        multiplicationSongTimer = setInterval(() => {
            if (multiplicationSongTimer === null) {
                // 如果已经停止，不再继续
                return;
            }
            
            if (currentIndex < lyrics.length) {
                speakText(lyrics[currentIndex]);
                
                // 高亮对应的表格单元
                highlightCurrentLyric(currentIndex);
                
                currentIndex++;
            } else {
                // 播放完成
                stopMultiplicationSong();
                setTimeout(() => {
                    speakText("乘法表儿歌播放完毕！浩浩小朋友真棒！");
                }, 500);
            }
        }, 4000); // 改为4秒播放一句，速度更慢
    }, 2000); // 等待2秒后开始播放
}

// 停止播放99乘法表儿歌
function stopMultiplicationSong() {
    if (multiplicationSongTimer) {
        clearInterval(multiplicationSongTimer);
        multiplicationSongTimer = null;
    }
    
    // 停止当前正在播放的语音
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
    }
    
    // 切换按钮显示
    const playBtn = document.querySelector('.play-song-btn');
    const stopBtn = document.getElementById('stopSongBtn');
    
    if (playBtn) playBtn.style.display = 'flex';
    if (stopBtn) stopBtn.style.display = 'none';
    
    // 清除所有高亮
    document.querySelectorAll('.multiplication-card').forEach(c => {
        c.classList.remove('highlighted');
    });
}

// 根据当前歌词高亮对应的表格单元
function highlightCurrentLyric(lyricIndex) {
    // 清除所有高亮
    document.querySelectorAll('.multiplication-card').forEach(c => {
        c.classList.remove('highlighted');
    });
    
    // 根据歌词索引高亮对应的乘法表单元
    let targetCells = [];
    
    if (lyricIndex === 0) {
        // 第一行：一一到一九
        targetCells = Array.from(document.querySelectorAll('.table-cell')).filter(cell => 
            cell.textContent.includes('1×') && !cell.classList.contains('header')
        );
    } else if (lyricIndex === 1) {
        // 第二行：一二到一九
        targetCells = Array.from(document.querySelectorAll('.table-cell')).filter(cell => 
            cell.textContent.includes('×1') && !cell.classList.contains('header')
        );
    } else {
        // 其他行根据模式匹配
        const patterns = [
            ['2×2=', '2×3=', '2×4=', '2×5='],
            ['2×6=', '2×7=', '2×8=', '2×9='],
            ['3×3=', '3×4=', '3×5='],
            ['3×6=', '3×7=', '3×8=', '3×9='],
            ['4×4=', '4×5=', '4×6='],
            ['4×7=', '4×8=', '4×9='],
            ['5×5=', '5×6=', '5×7='],
            ['5×8=', '5×9='],
            ['6×6=', '6×7=', '6×8=', '6×9='],
            ['7×7=', '7×8=', '7×9='],
            ['8×8=', '8×9='],
            ['9×9=']
        ];
        
        const patternIndex = Math.min(lyricIndex - 2, patterns.length - 1);
        if (patterns[patternIndex]) {
            targetCells = Array.from(document.querySelectorAll('.table-cell')).filter(cell => 
                patterns[patternIndex].some(pattern => cell.textContent.includes(pattern))
            );
        }
    }
    
    // 高亮目标单元格
    targetCells.forEach(cell => {
        cell.classList.add('highlight');
    });
}

// 生成题目
function generateQuestion() {
    let num1, num2, question;
    
    switch (currentOperation) {
        case 'addition':
            num1 = Math.floor(Math.random() * currentDifficulty) + 1;
            num2 = Math.floor(Math.random() * currentDifficulty) + 1;
            // 确保答案也在难度范围内
            while (num1 + num2 > currentDifficulty) {
                num1 = Math.floor(Math.random() * currentDifficulty) + 1;
                num2 = Math.floor(Math.random() * currentDifficulty) + 1;
            }
            currentAnswer = num1 + num2;
            question = `${num1} + ${num2} =`;
            break;
            
        case 'subtraction':
            num1 = Math.floor(Math.random() * currentDifficulty) + 1;
            num2 = Math.floor(Math.random() * Math.min(num1, currentDifficulty)) + 1;
            currentAnswer = num1 - num2;
            question = `${num1} - ${num2} =`;
            break;
            
        case 'multiplication':
            // 乘法限制一下难度，确保结果在范围内
            let maxMultiplicand = Math.min(currentDifficulty, 10);
            if (currentDifficulty <= 5) {
                maxMultiplicand = currentDifficulty;
            }
            num1 = Math.floor(Math.random() * maxMultiplicand) + 1;
            num2 = Math.floor(Math.random() * maxMultiplicand) + 1;
            // 确保答案在难度范围内
            while (num1 * num2 > currentDifficulty) {
                num1 = Math.floor(Math.random() * maxMultiplicand) + 1;
                num2 = Math.floor(Math.random() * maxMultiplicand) + 1;
            }
            currentAnswer = num1 * num2;
            question = `${num1} × ${num2} =`;
            break;
            
        case 'division':
            // 除法确保能整除，且结果在范围内
            let maxDivisor = Math.min(currentDifficulty, 10);
            if (currentDifficulty <= 5) {
                maxDivisor = currentDifficulty;
            }
            num2 = Math.floor(Math.random() * maxDivisor) + 1;
            currentAnswer = Math.floor(Math.random() * maxDivisor) + 1;
            // 确保被除数在难度范围内
            while (num2 * currentAnswer > currentDifficulty) {
                num2 = Math.floor(Math.random() * maxDivisor) + 1;
                currentAnswer = Math.floor(Math.random() * maxDivisor) + 1;
            }
            num1 = num2 * currentAnswer;
            question = `${num1} ÷ ${num2} =`;
            break;
            
        default:
            return;
    }
    
    // 保存当前题目数据
    currentQuestion = {
        num1: num1,
        num2: num2,
        answer: currentAnswer,
        question: question,
        tries: 0 // 答题尝试次数
    };
    
    updateQuestionDisplay();
}

// 更新题目显示
function updateQuestionDisplay() {
    if (!currentQuestion) return;
    
    // 更新题目文本
    document.getElementById('questionText').textContent = currentQuestion.question;
    
    // 更新进度显示
    const progressText = `第 ${currentQuestionNumber} 题 / 共 ${totalQuestions} 题`;
    let progressElement = document.getElementById('progressText');
    if (!progressElement) {
        progressElement = document.createElement('div');
        progressElement.id = 'progressText';
        progressElement.className = 'progress-text';
        document.querySelector('.question-container').insertBefore(progressElement, document.querySelector('.ultra-character'));
    }
    progressElement.textContent = progressText;
    
    // 更新统计
    updateStatistics();
    
    // 清空答案框并聚焦
    document.getElementById('answerInput').value = '';
    document.getElementById('answerInput').focus();
    
    // 更新奥特曼角色
    updateUltraCharacter();
}

// 更新答题统计
function updateStatistics() {
    let statsElement = document.getElementById('statistics');
    if (!statsElement) {
        statsElement = document.createElement('div');
        statsElement.id = 'statistics';
        statsElement.className = 'statistics';
        document.querySelector('.question-container').appendChild(statsElement);
    }
    
    statsElement.innerHTML = `
        <div class="stat-item">✅ 答对: ${correctCount} 题</div>
        <div class="stat-item">❌ 答错: ${wrongCount} 题</div>
        <div class="stat-item stamp-item">🏆 印章: ${stamps} 个</div>
    `;
}

// 更新山海经角色
function updateUltraCharacter() {
    const character = document.getElementById('ultraCharacter');
    const characters = ['🐲', '🐉', '🦅', '🦁', '🐢', '🦊', '🐴', '🐺', '🦌'];
    const randomCharacter = characters[Math.floor(Math.random() * characters.length)];
    character.textContent = randomCharacter;
}

// 改变难度
function changeDifficulty() {
    currentDifficulty = parseInt(document.getElementById('difficulty').value);
    console.log('难度已更改为：', currentDifficulty);
    // 如果当前在答题页面，重新生成题目
    if (document.getElementById('questionPage').classList.contains('active')) {
        generateQuestion();
    }
}

// 删除了语音输入功能

// 提交答案
function submitAnswer() {
    const userAnswer = parseInt(document.getElementById('answerInput').value);
    
    if (isNaN(userAnswer)) {
        showFeedback('请输入一个数字', false);
        return;
    }
    
    if (!currentQuestion) {
        generateQuestion();
        return;
    }
    
    currentQuestion.tries++;
    const isCorrect = userAnswer === currentQuestion.answer;
    
    // 记录答题
    recordQuestion(currentQuestion, userAnswer, isCorrect);
    
    if (isCorrect) {
        // 答对了
        correctCount++;
        
        // 检查是否达到奖励条件
        let rewardMessage = '';
        if (correctCount === nextRewardCount) {
            if (correctCount === 10) {
                stamps += 1;
                rewardMessage = '太棒了，可以找妈妈要积分奖励了，1个印章，再答对10道题奖励2个印章哦！';
                nextRewardCount = 20;
            } else if (correctCount === 20) {
                stamps += 2;
                rewardMessage = '太棒了，可以找妈妈要积分奖励了，2个印章哦！';
                nextRewardCount = 30;
            } else if (correctCount === 30) {
                stamps += 2;
                rewardMessage = '太棒了，可以找妈妈要积分奖励了，2个印章哦！';
                nextRewardCount = 40;
            } else if (correctCount === 40) {
                stamps += 2;
                rewardMessage = '太棒了，可以找妈妈要积分奖励了，2个印章哦！';
                nextRewardCount = 50;
            }
            
            // 播放奖励语音
            if (rewardMessage) {
                playSound('correct');
                createStarBurst();
                setTimeout(() => {
                    speakText(rewardMessage);
                }, 1000);
            }
        } else {
            // 播放正确语音和动画
            playSound('correct');
            createStarBurst();
            setTimeout(() => {
                speakText('浩浩小朋友你真棒！');
            }, 500);
        }
        
        // 更新统计显示
        updateStatistics();
        
        // 检查是否完成了所有题目
        if (currentQuestionNumber >= totalQuestions) {
            // 延迟显示最终成绩
            setTimeout(() => {
                showFinalResults();
            }, 2000);
        } else {
            // 自动进入下一题
            setTimeout(() => {
                currentQuestionNumber++;
                generateQuestion();
            }, 1500);
        }
    } else {
        // 答错了，只语音播报，不弹窗
        wrongCount++;
        updateStatistics();
        
        // 播放错误语音
        playSound('wrong');
        
        // 语音提示
        speakText('浩浩，再试试看！');
        
        // 清空答案框并聚焦，停留在当前题
        setTimeout(() => {
            document.getElementById('answerInput').value = '';
            document.getElementById('answerInput').focus();
        }, 1000);
    }
}

// 显示最终成绩
function showFinalResults() {
    const accuracy = Math.round((correctCount / totalQuestions) * 100);
    let message = '';
    let rating = '';
    
    // 结束当前会话
    endSession();
    
    if (accuracy >= 90) {
        rating = '🏆 超级棒！';
        message = `浩浩小朋友太厉害了！\n答对了 ${correctCount} 题，答错了 ${wrongCount} 题\n正确率：${accuracy}%\n获得 ${stamps} 个印章奖励`;
    } else if (accuracy >= 70) {
        rating = '🌟 很棒！';
        message = `浩浩小朋友很棒！\n答对了 ${correctCount} 题，答错了 ${wrongCount} 题\n正确率：${accuracy}%\n获得 ${stamps} 个印章奖励`;
    } else {
        rating = '💪 继续努力！';
        message = `浩浩小朋友继续加油！\n答对了 ${correctCount} 题，答错了 ${wrongCount} 题\n正确率：${accuracy}%\n获得 ${stamps} 个印章奖励`;
    }
    
    // 显示成绩弹窗
    showResultsModal(rating, message);
}

// 显示成绩弹窗
function showResultsModal(rating, message) {
    const modalHtml = `
        <div class="modal active" id="resultsModal">
            <div class="modal-content">
                <div class="modal-character">${rating}</div>
                <div class="modal-message" style="white-space: pre-line;">${message}</div>
                <div style="display: flex; gap: 15px; justify-content: center;">
                    <button class="modal-btn" onclick="restartQuiz()">再来一次</button>
                    <button class="modal-btn" onclick="backToMain()" style="background: linear-gradient(45deg, #95a5a6, #7f8c8d);">返回主页</button>
                </div>
            </div>
        </div>
    `;
    
    // 移除可能存在的成绩弹窗
    const existingModal = document.getElementById('resultsModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

// 重新开始答题
function restartQuiz() {
    // 重置计数器
    currentQuestionNumber = 1;
    correctCount = 0;
    wrongCount = 0;
    currentQuestion = null;
    
    // 关闭成绩弹窗
    const modal = document.getElementById('resultsModal');
    if (modal) {
        modal.remove();
    }
    
    // 生成新题目
    generateQuestion();
}

// 显示反馈（仅用于重要提示）
function showFeedback(message, isCorrect) {
    const feedback = document.getElementById('feedback');
    if (!feedback) return;
    
    feedback.textContent = message;
    feedback.style.display = 'block';
    
    if (isCorrect) {
        feedback.style.background = 'linear-gradient(45deg, #2ecc71, #27ae60)';
    } else {
        feedback.style.background = 'linear-gradient(45deg, #e74c3c, #c0392b)';
    }
    
    // 自动隐藏
    setTimeout(() => {
        feedback.style.display = 'none';
    }, 2000);
}



// 全局音频上下文，避免重复创建
let audioContext = null;
let isAudioInitialized = false;

// 初始化音频上下文
function initAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    // 确保音频上下文被激活（需要用户交互）
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
    
    isAudioInitialized = true;
}

// 播放声音
function playSound(type) {
    try {
        // 初始化音频上下文
        initAudioContext();
        
        // 创建音频节点
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        if (type === 'correct') {
            // 正确答案的声音 - 欢快的上升音
            oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
            oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
            oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } else {
            // 错误答案的声音 - 温和的提醒音
            oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4
            oscillator.frequency.setValueAtTime(415.30, audioContext.currentTime + 0.2); // G#4
            gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        }
    } catch (error) {
        console.error('音频播放错误:', error);
    }
}

// 语音合成
function speakText(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'zh-CN';
        utterance.rate = 0.9;
        utterance.pitch = 1.2;
        utterance.volume = 0.8;
        speechSynthesis.speak(utterance);
    }
}

// 创建星星爆发效果
function createStarBurst() {
    const container = document.querySelector('.question-container');
    const colors = ['#ff6b6b', '#48dbfb', '#ff9ff3', '#54a0ff', '#feca57'];
    
    for (let i = 0; i < 10; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.width = Math.random() * 20 + 10 + 'px';
        star.style.height = star.style.width;
        star.style.background = colors[Math.floor(Math.random() * colors.length)];
        star.style.left = '50%';
        star.style.top = '50%';
        star.style.position = 'absolute';
        star.style.zIndex = '999';
        
        const angle = (Math.PI * 2 * i) / 10;
        const velocity = 200 + Math.random() * 200;
        const translateX = Math.cos(angle) * velocity;
        const translateY = Math.sin(angle) * velocity;
        
        star.style.animation = `none`;
        star.style.transform = `translate(${translateX}px, ${translateY}px) scale(0)`;
        star.style.transition = 'all 1s ease-out';
        
        container.appendChild(star);
        
        setTimeout(() => {
            star.style.transform = `translate(${translateX}px, ${translateY}px) scale(1)`;
            star.style.opacity = '0';
        }, 10);
        
        setTimeout(() => {
            container.removeChild(star);
        }, 1000);
    }
}

// 键盘事件支持
document.addEventListener('DOMContentLoaded', function() {
    // 为难度选择器添加变化监听
    const difficultySelect = document.getElementById('difficulty');
    if (difficultySelect) {
        difficultySelect.addEventListener('change', changeDifficulty);
    }
    
    // 为答案输入框添加回车键支持（使用事件委托）
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && e.target && e.target.id === 'answerInput') {
            submitAnswer();
        }
    });
    
    // 添加一些背景动画效果
    createBackgroundStars();
});

// 创建背景星星
function createBackgroundStars() {
    const body = document.body;
    
    for (let i = 0; i < 20; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.width = Math.random() * 4 + 2 + 'px';
        star.style.height = star.style.width;
        star.style.position = 'fixed';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 3 + 's';
        star.style.zIndex = '-1';
        
        body.appendChild(star);
    }
}

// 添加一些触摸屏友好的功能
if ('ontouchstart' in window) {
    document.addEventListener('touchstart', function() {}, false);
}

// 更新历史记录显示
function updateHistoryDisplay(listId = 'historyList') {
    const historyList = document.getElementById(listId);
    if (!historyList) return;
    
    if (quizHistory.length === 0) {
        historyList.innerHTML = `
            <div class="history-empty">
                📚 还没有学习记录，快去答题吧！
            </div>
        `;
        return;
    }
    
    let html = '';
    quizHistory.forEach(session => {
        const date = new Date(session.date);
        const dateStr = formatDate(date);
        const timeStr = formatTime(date);
        const operationText = getOperationText(session.operation);
        const difficultyText = getDifficultyText(session.difficulty);
        
        html += `
            <div class="history-item">
                <div class="history-header">
                    <div class="history-date">${dateStr} ${timeStr}</div>
                    <div class="history-operation">${operationText}</div>
                    <div class="history-difficulty">${difficultyText}</div>
                </div>
                <div class="history-stats">
                    <div class="stat-badge correct">✅ 答对 ${session.correctCount} 题</div>
                    <div class="stat-badge wrong">❌ 答错 ${session.wrongCount} 题</div>
                    <div class="stat-badge stamps">🏆 获得 ${session.totalStamps} 印章</div>
                </div>
            </div>
        `;
    });
    
    historyList.innerHTML = html;
}

// 更新统计概览
function updateStatisticsOverview() {
    let totalSessions = quizHistory.length;
    let totalCorrect = 0;
    let totalStamps = 0;
    let todayCorrect = 0;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    quizHistory.forEach(session => {
        totalCorrect += session.correctCount;
        totalStamps += session.totalStamps;
        
        const sessionDate = new Date(session.date);
        sessionDate.setHours(0, 0, 0, 0);
        
        if (sessionDate >= today) {
            todayCorrect += session.correctCount;
        }
    });
    
    document.getElementById('totalSessions').textContent = totalSessions;
    document.getElementById('totalCorrect').textContent = totalCorrect;
    document.getElementById('totalStamps').textContent = totalStamps;
    document.getElementById('todayCorrect').textContent = todayCorrect;
}

// 更新统计概览（合并页面专用）
function updateStatisticsOverview2() {
    let totalSessions = quizHistory.length;
    let totalCorrect = 0;
    let totalStamps = 0;
    let todayCorrect = 0;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    quizHistory.forEach(session => {
        totalCorrect += session.correctCount;
        totalStamps += session.totalStamps;
        
        const sessionDate = new Date(session.date);
        sessionDate.setHours(0, 0, 0, 0);
        
        if (sessionDate >= today) {
            todayCorrect += session.correctCount;
        }
    });
    
    const elTotalSessions = document.getElementById('totalSessions2');
    const elTotalCorrect = document.getElementById('totalCorrect2');
    const elTotalStamps = document.getElementById('totalStamps2');
    const elTodayCorrect = document.getElementById('todayCorrect2');
    
    if (elTotalSessions) elTotalSessions.textContent = totalSessions;
    if (elTotalCorrect) elTotalCorrect.textContent = totalCorrect;
    if (elTotalStamps) elTotalStamps.textContent = totalStamps;
    if (elTodayCorrect) elTodayCorrect.textContent = todayCorrect;
}

// 筛选历史记录
function filterHistory(period) {
    // 移除所有active类
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // 添加active类到当前按钮
    event.target.classList.add('active');
    
    const now = new Date();
    let filteredHistory = [...quizHistory];
    
    switch(period) {
        case 'today':
            const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            filteredHistory = quizHistory.filter(session => {
                const sessionDate = new Date(session.date);
                return sessionDate >= todayStart;
            });
            break;
            
        case 'week':
            const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            filteredHistory = quizHistory.filter(session => {
                const sessionDate = new Date(session.date);
                return sessionDate >= weekStart;
            });
            break;
            
        case 'month':
            const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
            filteredHistory = quizHistory.filter(session => {
                const sessionDate = new Date(session.date);
                return sessionDate >= monthStart;
            });
            break;
    }
    
    // 临时更新显示
    const originalHistory = quizHistory;
    quizHistory = filteredHistory;
    updateHistoryDisplay();
    updateStatisticsOverview();
    quizHistory = originalHistory;
}

// 格式化日期
function formatDate(date) {
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}

// 格式化时间
function formatTime(date) {
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
}

// 获取运算类型文本
function getOperationText(operation) {
    const operations = {
        'addition': '加法',
        'subtraction': '减法',
        'multiplication': '乘法',
        'division': '除法'
    };
    return operations[operation] || '未知';
}

// 获取难度文本
function getDifficultyText(difficulty) {
    const difficulties = {
        5: '5以内',
        10: '10以内',
        50: '50以内',
        100: '100以内'
    };
    return difficulties[difficulty] || '未知';
}

// 导出学习记录报表
function exportHistoryReport() {
    if (quizHistory.length === 0) {
        showFeedback('暂无学习记录可导出', false);
        return;
    }
    
    // 创建工作簿数据
    const workbookData = generateWorkbookData();
    
    // 创建工作簿
    const wb = XLSX.utils.book_new();
    
    // 创建工作表
    const ws = XLSX.utils.aoa_to_sheet(workbookData);
    
    // 设置列宽
    const colWidths = [
        { wch: 15 }, // 日期时间
        { wch: 10 }, // 运算类型
        { wch: 10 }, // 难度
        { wch: 8 },  // 答对题数
        { wch: 8 },  // 答错题数
        { wch: 8 },  // 总题数
        { wch: 8 },  // 正确率
        { wch: 10 }  // 获得印章
    ];
    ws['!cols'] = colWidths;
    
    // 添加工作表到工作簿
    XLSX.utils.book_append_sheet(wb, ws, '学习记录');
    
    // 生成文件名
    const now = new Date();
    const fileName = `浩浩学习记录_${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}.xlsx`;
    
    // 导出文件
    XLSX.writeFile(wb, fileName);
    
    showFeedback(`学习记录已导出为 ${fileName}`, true);
}

// 生成工作簿数据
function generateWorkbookData() {
    const data = [
        ['浩浩数学学习记录报表'],
        [`导出时间：${formatDate(new Date())} ${formatTime(new Date())}`],
        [''],
        ['日期时间', '运算类型', '难度', '答对题数', '答错题数', '总题数', '正确率', '获得印章']
    ];
    
    // 按日期排序（最新的在前）
    const sortedHistory = [...quizHistory].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // 添加详细记录
    sortedHistory.forEach(session => {
        const date = new Date(session.date);
        const dateStr = formatDate(date);
        const timeStr = formatTime(date);
        const operationText = getOperationText(session.operation);
        const difficultyText = getDifficultyText(session.difficulty);
        const totalQuestions = session.correctCount + session.wrongCount;
        const accuracy = totalQuestions > 0 ? Math.round((session.correctCount / totalQuestions) * 100) : 0;
        
        data.push([
            `${dateStr} ${timeStr}`,
            operationText,
            difficultyText,
            session.correctCount,
            session.wrongCount,
            totalQuestions,
            `${accuracy}%`,
            session.totalStamps
        ]);
    });
    
    // 添加统计汇总
    data.push(['']);
    data.push(['统计汇总']);
    
    const stats = calculateStatistics();
    data.push(['总学习次数', stats.totalSessions]);
    data.push(['总答对题数', stats.totalCorrect]);
    data.push(['总答错题数', stats.totalWrong]);
    data.push(['总获得印章', stats.totalStamps]);
    data.push(['平均正确率', `${stats.averageAccuracy}%`]);
    
    // 按运算类型统计
    data.push(['']);
    data.push(['按运算类型统计']);
    data.push(['运算类型', '次数', '答对题数', '正确率']);
    
    Object.entries(stats.operationStats).forEach(([operation, stat]) => {
        data.push([
            getOperationText(operation),
            stat.count,
            stat.correct,
            `${stat.accuracy}%`
        ]);
    });
    
    return data;
}

// 计算统计数据
function calculateStatistics() {
    const stats = {
        totalSessions: quizHistory.length,
        totalCorrect: 0,
        totalWrong: 0,
        totalStamps: 0,
        averageAccuracy: 0,
        operationStats: {
            addition: { count: 0, correct: 0, accuracy: 0 },
            subtraction: { count: 0, correct: 0, accuracy: 0 },
            multiplication: { count: 0, correct: 0, accuracy: 0 },
            division: { count: 0, correct: 0, accuracy: 0 }
        }
    };
    
    quizHistory.forEach(session => {
        const total = session.correctCount + session.wrongCount;
        const accuracy = total > 0 ? Math.round((session.correctCount / total) * 100) : 0;
        
        stats.totalCorrect += session.correctCount;
        stats.totalWrong += session.wrongCount;
        stats.totalStamps += session.totalStamps;
        
        if (stats.operationStats[session.operation]) {
            stats.operationStats[session.operation].count++;
            stats.operationStats[session.operation].correct += session.correctCount;
        }
    });
    
    // 计算平均正确率
    const totalQuestions = stats.totalCorrect + stats.totalWrong;
    stats.averageAccuracy = totalQuestions > 0 ? Math.round((stats.totalCorrect / totalQuestions) * 100) : 0;
    
    // 计算各运算类型正确率
    Object.keys(stats.operationStats).forEach(operation => {
        const stat = stats.operationStats[operation];
        const total = quizHistory
            .filter(s => s.operation === operation)
            .reduce((sum, s) => sum + s.correctCount + s.wrongCount, 0);
        
        if (total > 0) {
            stat.accuracy = Math.round((stat.correct / total) * 100);
        }
    });
    
    return stats;
}

// 导出学习记录报表
function exportHistoryReport() {
    if (quizHistory.length === 0) {
        showFeedback('暂无学习记录可导出', false);
        return;
    }
    
    try {
        // 检查XLSX库是否可用
        if (typeof XLSX === 'undefined') {
            showFeedback('导出库加载中，请稍后重试', false);
            return;
        }
        
        showFeedback('正在准备导出数据...', true);
        
        // 创建工作簿数据
        const workbookData = generateWorkbookData();
        
        // 创建工作簿
        const wb = XLSX.utils.book_new();
        
        // 创建工作表
        const ws = XLSX.utils.aoa_to_sheet(workbookData);
        
        // 设置列宽
        const colWidths = [
            { wch: 15 }, // 日期时间
            { wch: 10 }, // 运算类型
            { wch: 10 }, // 难度
            { wch: 8 },  // 答对题数
            { wch: 8 },  // 答错题数
            { wch: 8 },  // 总题数
            { wch: 8 },  // 正确率
            { wch: 10 }  // 获得印章
        ];
        ws['!cols'] = colWidths;
        
        // 设置合并单元格
        if (!ws['!merges']) ws['!merges'] = [];
        ws['!merges'].push({ s: { r: 0, c: 0 }, e: { r: 0, c: 7 } }); // 标题行
        ws['!merges'].push({ s: { r: 1, c: 0 }, e: { r: 1, c: 7 } }); // 导出时间行
        
        // 添加工作表到工作簿
        XLSX.utils.book_append_sheet(wb, ws, '学习记录');
        
        // 生成文件名
        const now = new Date();
        const fileName = `浩浩学习记录_${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}.xlsx`;
        
        // 导出文件
        XLSX.writeFile(wb, fileName);
        
        showFeedback(`学习记录已导出为 ${fileName}`, true);
        
    } catch (error) {
        console.error('导出失败:', error);
        // 如果Excel导出失败，尝试CSV格式
        showFeedback('Excel导出失败，正在尝试CSV格式...', true);
        setTimeout(() => {
            exportHistoryReportCSV();
        }, 1000);
    }
}

// 添加备用导出功能 - CSV格式
function exportHistoryReportCSV() {
    if (quizHistory.length === 0) {
        showFeedback('暂无学习记录可导出', false);
        return;
    }
    
    try {
        // 创建CSV数据
        let csvContent = '\ufeff'; // BOM for UTF-8
        csvContent += '浩浩数学学习记录报表\n';
        csvContent += `导出时间：${formatDate(new Date())} ${formatTime(new Date())}\n\n`;
        csvContent += '日期时间,运算类型,难度,答对题数,答错题数,总题数,正确率,获得印章\n';
        
        // 按日期排序（最新的在前）
        const sortedHistory = [...quizHistory].sort((a, b) => new Date(b.date) - new Date(a.date));
        
        sortedHistory.forEach(session => {
            const date = new Date(session.date);
            const dateStr = formatDate(date);
            const timeStr = formatTime(date);
            const operationText = getOperationText(session.operation);
            const difficultyText = getDifficultyText(session.difficulty);
            const totalQuestions = session.correctCount + session.wrongCount;
            const accuracy = totalQuestions > 0 ? Math.round((session.correctCount / totalQuestions) * 100) : 0;
            
            csvContent += `"${dateStr} ${timeStr}","${operationText}","${difficultyText}",${session.correctCount},${session.wrongCount},${totalQuestions},"${accuracy}%",${session.totalStamps}\n`;
        });
        
        // 创建Blob对象
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        
        // 生成文件名
        const now = new Date();
        const fileName = `浩浩学习记录_${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}.csv`;
        
        // 设置下载链接
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.style.display = 'none';
        
        // 触发下载
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showFeedback(`学习记录已导出为 ${fileName}`, true);
        
    } catch (error) {
        console.error('CSV导出失败:', error);
        showFeedback('导出失败，请稍后重试', false);
    }
}

// 在页面加载时初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化答题记录
    initQuizHistory();
});