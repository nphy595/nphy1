// 根计算器功能实现

// DOM元素获取
const radicandInput = document.getElementById('radicand');
const rootIndexSelect = document.getElementById('root-index');
const precisionSelect = document.getElementById('precision');
const simplifyCheckbox = document.getElementById('simplify');
const calculateButton = document.getElementById('calculate');
const resultDisplay = document.getElementById('result');
const radicalFormDisplay = document.getElementById('radical-form');
const historyDisplay = document.getElementById('history');
const copyResultButton = document.getElementById('copy-result');
const copyRadicalButton = document.getElementById('copy-radical');
const clearHistoryButton = document.getElementById('clear-history');
const clearAllButton = document.getElementById('clear-all');

// 历史记录数组
let calculationHistory = [];

// 计算根值
function calculateRoot() {
    const radicand = parseFloat(radicandInput.value);
    const rootIndex = parseInt(rootIndexSelect.value);
    const precision = parseInt(precisionSelect.value);
    const simplify = simplifyCheckbox.checked;

    // 输入验证
    if (isNaN(radicand)) {
        alert('请输入有效的被开方数');
        return;
    }

    // 计算根值
    let result;
    try {
        result = Math.pow(radicand, 1 / rootIndex);
        // 处理负数的偶次根
        if (radicand < 0 && rootIndex % 2 === 0) {
            throw new Error('负数不能开偶次根');
        }
    } catch (error) {
        alert(error.message);
        return;
    }

    // 格式化结果
    const formattedResult = result.toFixed(precision);

    // 显示结果
    resultDisplay.textContent = formattedResult;

    // 计算并显示根式形式
    let radicalForm;
    if (simplify) {
        radicalForm = simplifyRadical(radicand, rootIndex);
    } else {
        radicalForm = getRadicalNotation(radicand, rootIndex);
    }
    radicalFormDisplay.textContent = radicalForm;

    // 添加到历史记录
    addToHistory(radicand, rootIndex, formattedResult, radicalForm);
}

// 获取根式表示
function getRadicalNotation(radicand, rootIndex) {
    if (rootIndex === 2) {
        return `√${radicand}`;
    } else if (rootIndex === 3) {
        return `∛${radicand}`;
    } else {
        return `${rootIndex}√${radicand}`;
    }
}

// 化简根式
function simplifyRadical(radicand, rootIndex) {
    // 处理负数
    let isNegative = false;
    if (radicand < 0) {
        if (rootIndex % 2 !== 0) {
            isNegative = true;
            radicand = Math.abs(radicand);
        } else {
            return '无法化简: 负数开偶次根';
        }
    }

    // 寻找可以开根的因子
    let outside = 1;
    let inside = radicand;

    // 从2开始尝试分解因数
    for (let i = 2; i * i <= inside; i++) {
        let count = 0;
        while (inside % (i ** rootIndex) === 0) {
            count++;
            inside /= i ** rootIndex;
        }
        if (count > 0) {
            outside *= i ** count;
        }
    }

    // 构建化简后的根式
    let result = '';
    if (isNegative) {
        result += '-';
    }

    if (outside !== 1) {
        result += outside;
    }

    if (inside !== 1) {
        if (rootIndex === 2) {
            result += `√${inside}`;
        } else if (rootIndex === 3) {
            result += `∛${inside}`;
        } else {
            result += `${rootIndex}√${inside}`;
        }
    } else if (outside === 1) {
        result += '1';
    }

    return result;
}

// 添加到历史记录
function addToHistory(radicand, rootIndex, result, radicalForm) {
    const entry = {
        radicand,
        rootIndex,
        result,
        radicalForm,
        timestamp: new Date()
    };

    calculationHistory.unshift(entry);

    // 限制历史记录数量
    if (calculationHistory.length > 20) {
        calculationHistory.pop();
    }

    // 更新历史记录显示
    updateHistoryDisplay();
}

// 更新历史记录显示
function updateHistoryDisplay() {
    if (calculationHistory.length === 0) {
        historyDisplay.textContent = '暂无计算记录';
        return;
    }

    let historyHTML = '';
    calculationHistory.forEach((entry, index) => {
        const { radicand, rootIndex, result, radicalForm } = entry;
        const radicalNotation = getRadicalNotation(radicand, rootIndex);

        historyHTML += `<div style="margin-bottom: 8px; padding-bottom: 8px; ${index < calculationHistory.length - 1 ? 'border-bottom: 1px solid #eee;' : ''}">`;
        historyHTML += `<div><strong>${radicalNotation} = ${result}</strong></div>`;
        historyHTML += `<div style="color: #666; font-size: 14px;">化简形式: ${radicalForm}</div>`;
        historyHTML += `</div>`;
    });

    historyDisplay.innerHTML = historyHTML;
}

// 复制结果到剪贴板
function copyToClipboard(text, buttonName) {
    navigator.clipboard.writeText(text)
        .then(() => {
            const originalText = buttonName.textContent;
            buttonName.textContent = '复制成功!';
            setTimeout(() => {
                buttonName.textContent = originalText;
            }, 2000);
        })
        .catch(err => {
            alert('复制失败: ' + err);
        });
}

// 清空历史记录
function clearHistory() {
    calculationHistory = [];
    updateHistoryDisplay();
}

// 全部清空
function clearAll() {
    radicandInput.value = '';
    rootIndexSelect.value = '2';
    precisionSelect.value = '10';
    simplifyCheckbox.checked = true;
    resultDisplay.textContent = '等待计算...';
    radicalFormDisplay.textContent = '等待计算...';
    clearHistory();
}

// 事件监听
calculateButton.addEventListener('click', calculateRoot);

copyResultButton.addEventListener('click', () => {
    copyToClipboard(resultDisplay.textContent, copyResultButton);
});

copyRadicalButton.addEventListener('click', () => {
    copyToClipboard(radicalFormDisplay.textContent, copyRadicalButton);
});

clearHistoryButton.addEventListener('click', clearHistory);

clearAllButton.addEventListener('click', clearAll);

// 键盘事件监听
radicandInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        calculateRoot();
    }
});

// 初始化
updateHistoryDisplay();