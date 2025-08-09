document.addEventListener('DOMContentLoaded', function() {
    // 检查是否在科学计算器页面
    if (document.getElementById('scientific-result')) {
        const resultDisplay = document.getElementById('scientific-result');
        let currentInput = '0';
        let firstOperand = null;
        let operator = null;
        let shouldResetScreen = false;
        let angleMode = 'deg'; // 默认角度模式为度数

        // 数字按钮点击事件
        document.querySelectorAll('.number[id^="scientific-"]').forEach(button => {
            const number = button.id.replace('scientific-', '');
            button.addEventListener('click', () => appendNumber(number));
        });

        // 运算符按钮点击事件
        document.querySelectorAll('.operator[id^="scientific-"]').forEach(button => {
            const op = button.textContent;
            button.addEventListener('click', () => setOperation(op));
        });

        // 等号按钮点击事件
        document.getElementById('scientific-equals').addEventListener('click', calculate);

        // 清除按钮点击事件
        document.getElementById('scientific-clear').addEventListener('click', clear);

        // 退格按钮点击事件
        document.getElementById('scientific-backspace').addEventListener('click', backspace);

        // 小数点按钮点击事件
        document.getElementById('scientific-decimal').addEventListener('click', appendDecimal);

        // 正负号切换按钮点击事件
        document.getElementById('scientific-negative').addEventListener('click', toggleSign);

        // 百分比按钮点击事件
        document.getElementById('scientific-percentage').addEventListener('click', calculatePercentage);

        // 科学功能按钮点击事件
        document.getElementById('scientific-pi').addEventListener('click', () => appendConstant(Math.PI));
        document.getElementById('scientific-e').addEventListener('click', () => appendConstant(Math.E));
        document.getElementById('scientific-square').addEventListener('click', () => applyUnaryOperation(x => x * x));
        document.getElementById('scientific-square-root').addEventListener('click', () => applyUnaryOperation(x => Math.sqrt(x)));
        document.getElementById('scientific-cube').addEventListener('click', () => applyUnaryOperation(x => x * x * x));
        document.getElementById('scientific-cube-root').addEventListener('click', () => applyUnaryOperation(x => Math.cbrt(x)));
        document.getElementById('scientific-power').addEventListener('click', () => setOperation('^'));
        document.getElementById('scientific-inverse').addEventListener('click', () => applyUnaryOperation(x => 1 / x));
        document.getElementById('scientific-log').addEventListener('click', () => applyUnaryOperation(x => Math.log10(x)));
        document.getElementById('scientific-ln').addEventListener('click', () => applyUnaryOperation(x => Math.log(x)));
        document.getElementById('scientific-sin').addEventListener('click', () => applyTrigFunction(x => Math.sin(convertToRadians(x))));
        document.getElementById('scientific-cos').addEventListener('click', () => applyTrigFunction(x => Math.cos(convertToRadians(x))));
        document.getElementById('scientific-tan').addEventListener('click', () => applyTrigFunction(x => Math.tan(convertToRadians(x))));
        document.getElementById('scientific-asin').addEventListener('click', () => applyTrigFunction(x => {
            const result = Math.asin(x);
            return angleMode === 'deg' ? convertToDegrees(result) : result;
        }));
        document.getElementById('scientific-acos').addEventListener('click', () => applyTrigFunction(x => {
            const result = Math.acos(x);
            return angleMode === 'deg' ? convertToDegrees(result) : result;
        }));
        document.getElementById('scientific-atan').addEventListener('click', () => applyTrigFunction(x => {
            const result = Math.atan(x);
            return angleMode === 'deg' ? convertToDegrees(result) : result;
        }));
        document.getElementById('scientific-sinh').addEventListener('click', () => applyUnaryOperation(x => Math.sinh(x)));
        document.getElementById('scientific-cosh').addEventListener('click', () => applyUnaryOperation(x => Math.cosh(x)));
        document.getElementById('scientific-tanh').addEventListener('click', () => applyUnaryOperation(x => Math.tanh(x)));
        document.getElementById('scientific-deg').addEventListener('click', () => setAngleMode('deg'));
        document.getElementById('scientific-rad').addEventListener('click', () => setAngleMode('rad'));
        document.getElementById('scientific-factorial').addEventListener('click', () => applyUnaryOperation(factorial));

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

        function appendConstant(constant) {
            currentInput = String(constant);
            shouldResetScreen = true;
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
                case '^':
                    result = Math.pow(firstOperand, secondOperand);
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

        function applyUnaryOperation(operation) {
            const value = parseFloat(currentInput);
            let result;

            try {
                result = operation(value);

                // 处理结果显示，避免过多小数位
                if (typeof result === 'number') {
                    if (result % 1 !== 0) {
                        result = result.toFixed(10).replace(/\.?0+$/, '');
                    }
                }

                currentInput = String(result);
            } catch (error) {
                currentInput = '错误';
            }

            shouldResetScreen = true;
            updateDisplay();
        }

        function applyTrigFunction(operation) {
            const value = parseFloat(currentInput);
            let result;

            try {
                result = operation(value);

                // 处理结果显示，避免过多小数位
                if (typeof result === 'number') {
                    if (result % 1 !== 0) {
                        result = result.toFixed(10).replace(/\.?0+$/, '');
                    }
                }

                currentInput = String(result);
            } catch (error) {
                currentInput = '错误';
            }

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

        function setAngleMode(mode) {
            angleMode = mode;
            // 更新按钮样式
            document.getElementById('scientific-deg').classList.toggle('active', mode === 'deg');
            document.getElementById('scientific-rad').classList.toggle('active', mode === 'rad');
        }

        function convertToRadians(degrees) {
            return angleMode === 'deg' ? degrees * (Math.PI / 180) : degrees;
        }

        function convertToDegrees(radians) {
            return radians * (180 / Math.PI);
        }

        function factorial(n) {
            if (n < 0 || !Number.isInteger(n)) {
                return '错误';
            }
            if (n === 0 || n === 1) {
                return 1;
            }
            return n * factorial(n - 1);
        }

        function updateDisplay() {
            // 处理过长的数字显示
            if (currentInput.length > 12) {
                if (currentInput.includes('e') || currentInput.includes('E') || currentInput === '错误') {
                    // 已经是科学计数法或错误信息
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

        // 初始化角度模式按钮样式
        setAngleMode('deg');
    }
});