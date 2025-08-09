// 完美平方三项式计算器功能实现

// DOM元素获取
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');
const operatorButtons = document.querySelectorAll('.operator-button');
const calculateExpandButton = document.getElementById('calculate-expand');
const calculateFactorButton = document.getElementById('calculate-factor');
const aValueInput = document.getElementById('a-value');
const bValueInput = document.getElementById('b-value');
const term1Input = document.getElementById('term1');
const term2Input = document.getElementById('term2');
const term3Input = document.getElementById('term3');
const expandResultDisplay = document.getElementById('expand-result');
const factorResultDisplay = document.getElementById('factor-result');
const copyResultButton = document.getElementById('copy-result');
const clearAllButton = document.getElementById('clear-all');

// 当前选中的运算符
let currentOperator = '+';

// 切换标签
function switchTab(tabId) {
    tabButtons.forEach(button => {
        if (button.dataset.tab === tabId) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });

    tabContents.forEach(content => {
        if (content.id === tabId) {
            content.classList.add('active');
        } else {
            content.classList.remove('active');
        }
    });
}

// 设置运算符
function setOperator(operator) {
    currentOperator = operator;
    operatorButtons.forEach(button => {
        if (button.dataset.operator === operator) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

// 展开计算 (a ± b)²
function calculateExpand() {
    const a = aValueInput.value.trim();
    const b = bValueInput.value.trim();

    // 输入验证
    if (!a || !b) {
        alert('请输入a和b的值');
        return;
    }

    // 构建结果
    let result;
    if (currentOperator === '+') {
        result = `${a}² + 2${a}${b} + ${b}²`;
    } else {
        result = `${a}² - 2${a}${b} + ${b}²`;
    }

    // 显示结果
    expandResultDisplay.textContent = result;
}

// 判断是否为完美平方三项式并分解
function calculateFactor() {
    const term1 = term1Input.value.trim();
    const term2 = term2Input.value.trim();
    const term3 = term3Input.value.trim();

    // 输入验证
    if (!term1 || !term2 || !term3) {
        alert('请输入三项式的所有项');
        return;
    }

    // 尝试分解
    // 这里使用简单的正则表达式匹配，实际应用可能需要更复杂的解析
    try {
        // 提取平方项的底数
        const squareTermMatch = term1.match(/^([a-zA-Z0-9]+)\²$/);
        if (!squareTermMatch) {
            factorResultDisplay.textContent = '不是完美平方三项式';
            return;
        }
        const a = squareTermMatch[1];

        // 提取常数项的平方根
        const constantTerm = parseFloat(term3);
        if (isNaN(constantTerm)) {
            factorResultDisplay.textContent = '不是完美平方三项式';
            return;
        }
        const b = Math.sqrt(constantTerm);
        if (!Number.isInteger(b)) {
            factorResultDisplay.textContent = '不是完美平方三项式';
            return;
        }

        // 检查中间项
        const middleTermCoefficient = term2.match(/^(-?\d*)[a-zA-Z0-9]+$/);
        if (!middleTermCoefficient) {
            factorResultDisplay.textContent = '不是完美平方三项式';
            return;
        }
        let coefficient = middleTermCoefficient[1];
        if (coefficient === '') coefficient = '1';
        if (coefficient === '-') coefficient = '-1';
        coefficient = parseInt(coefficient);

        // 判断符号和系数
        let operator;
        if (coefficient === 2 * b) {
            operator = '+';
        } else if (coefficient === -2 * b) {
            operator = '-';
        } else {
            factorResultDisplay.textContent = '不是完美平方三项式';
            return;
        }

        // 构建结果
        const result = `(${a} ${operator} ${b})²`;
        factorResultDisplay.textContent = `是完美平方三项式: ${term1} + ${term2} + ${term3} = ${result}`;
    } catch (error) {
        factorResultDisplay.textContent = '不是完美平方三项式';
    }
}

// 复制结果到剪贴板
function copyResult() {
    let result;
    if (document.getElementById('expand').classList.contains('active')) {
        result = expandResultDisplay.textContent;
    } else {
        result = factorResultDisplay.textContent;
    }

    navigator.clipboard.writeText(result)
        .then(() => {
            const originalText = copyResultButton.textContent;
            copyResultButton.textContent = '复制成功!';
            setTimeout(() => {
                copyResultButton.textContent = originalText;
            }, 2000);
        })
        .catch(err => {
            alert('复制失败: ' + err);
        });
}

// 清空所有输入
function clearAll() {
    aValueInput.value = 'x';
    bValueInput.value = '1';
    term1Input.value = 'x²';
    term2Input.value = '2x';
    term3Input.value = '1';
    expandResultDisplay.textContent = '请输入数值并点击计算';
    factorResultDisplay.textContent = '请输入数值并点击计算';
    setOperator('+');
}

// 事件监听
 tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        switchTab(button.dataset.tab);
    });
});

operatorButtons.forEach(button => {
    button.addEventListener('click', () => {
        setOperator(button.dataset.operator);
    });
});

calculateExpandButton.addEventListener('click', calculateExpand);
calculateFactorButton.addEventListener('click', calculateFactor);
copyResultButton.addEventListener('click', copyResult);
clearAllButton.addEventListener('click', clearAll);

// 键盘事件监听
 aValueInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        calculateExpand();
    }
});

bValueInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        calculateExpand();
    }
});

term1Input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        calculateFactor();
    }
});

term2Input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        calculateFactor();
    }
});

term3Input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        calculateFactor();
    }
});

// 初始化
switchTab('expand');
setOperator('+');