document.addEventListener('DOMContentLoaded', function() {
    // 主题切换功能
    const themeToggle = document.getElementById('theme-toggle');
    const calculatorContainer = document.querySelector('.calculator-container');
    const body = document.body;

    // 检查用户之前的主题偏好
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        themeToggle.textContent = '☀️';
    }

    // 主题切换按钮点击事件
    themeToggle.addEventListener('click', function() {
        body.classList.toggle('dark-mode');
        if (body.classList.contains('dark-mode')) {
            themeToggle.textContent = '☀️';
            localStorage.setItem('theme', 'dark');
        } else {
            themeToggle.textContent = '🌙';
            localStorage.setItem('theme', 'light');
        }
    });

    // 计算器功能实现
    const resultDisplay = document.getElementById('result');
    let currentInput = '0';
    let firstOperand = null;
    let operator = null;
    let shouldResetScreen = false;

    // 数字按钮点击事件
    document.querySelectorAll('.number').forEach(button => {
        button.addEventListener('click', () => appendNumber(button.textContent));
    });

    // 运算符按钮点击事件
    document.querySelectorAll('.operator').forEach(button => {
        button.addEventListener('click', () => setOperation(button.textContent));
    });

    // 等号按钮点击事件
    document.getElementById('equals').addEventListener('click', calculate);

    // 清除按钮点击事件
    document.getElementById('clear').addEventListener('click', clear);

    // 退格按钮点击事件
    document.getElementById('backspace').addEventListener('click', backspace);

    // 小数点按钮点击事件
    document.getElementById('decimal').addEventListener('click', appendDecimal);

    // 正负号切换按钮点击事件
    document.getElementById('negative').addEventListener('click', toggleSign);

    // 百分比按钮点击事件
    document.getElementById('percentage').addEventListener('click', calculatePercentage);

    function appendNumber(number) {
        if (currentInput === '0' || shouldResetScreen) {
            currentInput = number;
            shouldResetScreen = false;
        } else {
            currentInput += number;
        }
        updateDisplay();
    }

    function appendDecimal() {
        if (shouldResetScreen) {
            currentInput = '0.';
            shouldResetScreen = false;
        } else if (!currentInput.includes('.')) {
            currentInput += '.';
        }
        updateDisplay();
    }

    function setOperation(op) {
        if (operator !== null) {
            calculate();
        }
        firstOperand = parseFloat(currentInput);
        operator = op;
        shouldResetScreen = true;
    }

    function calculate() {
        if (operator === null || shouldResetScreen) return;

        const secondOperand = parseFloat(currentInput);
        let result = 0;

        switch (operator) {
            case '+':
                result = firstOperand + secondOperand;
                break;
            case '-':
                result = firstOperand - secondOperand;
                break;
            case '×':
                result = firstOperand * secondOperand;
                break;
            case '÷':
                if (secondOperand === 0) {
                    result = '错误';
                } else {
                    result = firstOperand / secondOperand;
                }
                break;
            default:
                return;
        }

        // 处理结果显示，避免过多小数位
        if (typeof result === 'number') {
            if (result % 1 !== 0) {
                result = result.toFixed(10).replace(/\.?0+$/, '');
            }
        }

        currentInput = String(result);
        operator = null;
        firstOperand = null;
        shouldResetScreen = true;
        updateDisplay();
    }

    function clear() {
        currentInput = '0';
        firstOperand = null;
        operator = null;
        shouldResetScreen = false;
        updateDisplay();
    }

    function backspace() {
        if (shouldResetScreen) {
            currentInput = '0';
            shouldResetScreen = false;
        } else if (currentInput.length > 1) {
            currentInput = currentInput.slice(0, -1);
        } else {
            currentInput = '0';
        }
        updateDisplay();
    }

    function toggleSign() {
        if (currentInput === '0') return;

        if (currentInput.startsWith('-')) {
            currentInput = currentInput.slice(1);
        } else {
            currentInput = '-' + currentInput;
        }
        updateDisplay();
    }

    function calculatePercentage() {
        const value = parseFloat(currentInput);
        currentInput = String(value / 100);
        updateDisplay();
    }

    function updateDisplay() {
        // 处理过长的数字显示
        if (currentInput.length > 12) {
            if (currentInput.includes('e') || currentInput.includes('E')) {
                // 已经是科学计数法
                resultDisplay.textContent = currentInput;
            } else {
                // 转换为科学计数法
                const num = parseFloat(currentInput);
                resultDisplay.textContent = num.toExponential(8);
            }
        } else {
            resultDisplay.textContent = currentInput;
        }
    }
});