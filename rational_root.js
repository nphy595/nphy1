document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const degreeSelect = document.getElementById('polynomial-degree');
    const coefficientsContainer = document.getElementById('polynomial-coefficients');
    const findRootsButton = document.getElementById('find-roots');
    const polynomialDisplay = document.getElementById('polynomial-display');
    const possibleRootsList = document.getElementById('possible-roots');
    const validRootsList = document.getElementById('valid-roots');
    const calculationProcess = document.getElementById('calculation-process');
    const copyButton = document.getElementById('copy-result');
    const clearButton = document.getElementById('clear-result');

    // 初始化系数输入框
    function initializeCoefficients() {
        const degree = parseInt(degreeSelect.value);
        coefficientsContainer.innerHTML = '';

        for (let i = degree; i >= 0; i--) {
            const coefficientLabel = document.createElement('div');
            coefficientLabel.className = 'coefficient-label';

            const input = document.createElement('input');
            input.type = 'number';
            input.className = 'coefficient-input';
            input.id = `coeff-${i}`;
            input.step = 'any';
            input.required = true;
            input.value = i === degree ? '1' : '0'; // 默认首项系数为1，其他为0

            const powerLabel = document.createElement('span');
            powerLabel.className = 'power-label';
            powerLabel.textContent = i > 0 ? `x^${i}` : '常数项';

            coefficientLabel.appendChild(input);
            coefficientLabel.appendChild(powerLabel);
            coefficientsContainer.appendChild(coefficientLabel);
        }
    }

    // 当多项式次数改变时重新初始化系数输入框
    degreeSelect.addEventListener('change', initializeCoefficients);

    // 计算最大公约数
    function gcd(a, b) {
        a = Math.abs(a);
        b = Math.abs(b);
        while (b !== 0) {
            const temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }

    // 计算最小公倍数
    function lcm(a, b) {
        return Math.abs(a * b) / gcd(a, b);
    }

    // 简化分数
    function reduceFraction(numerator, denominator) {
        if (denominator === 0) return [0, 0];
        if (numerator === 0) return [0, 1];

        const sign = (numerator < 0) !== (denominator < 0) ? -1 : 1;
        numerator = Math.abs(numerator);
        denominator = Math.abs(denominator);

        const commonDivisor = gcd(numerator, denominator);

        return [sign * (numerator / commonDivisor), denominator / commonDivisor];
    }

    // 计算多项式值 (使用霍纳法则优化)
function evaluatePolynomial(coefficients, x) {
    try {
        let result = coefficients[0];
        for (let i = 1; i < coefficients.length; i++) {
            result = result * x + coefficients[i];
        }
        return result;
    } catch (error) {
        console.error('多项式求值错误:', error);
        return NaN;
    }
}

    // 显示计算过程
function displayProcess(process) {
    calculationProcess.innerHTML = '';
    process.forEach(step => {
        const div = document.createElement('div');
        div.className = 'process-step';
        div.textContent = step;
        
        // 为不同类型的步骤添加样式
        if (step.includes('是有效根')) {
            div.style.color = 'green';
            div.style.fontWeight = 'bold';
        } else if (step.includes('不是有效根')) {
            div.style.color = 'red';
        } else if (step.includes('多项式:') || step.includes('首项系数:') || step.includes('常数项:')) {
            div.style.fontWeight = 'bold';
        }
        
        calculationProcess.appendChild(div);
    });
    // 滚动到最新步骤
    calculationProcess.scrollTop = calculationProcess.scrollHeight;
}

    // 复制结果到剪贴板
    function copyResultsToClipboard() {
        const polynomialText = polynomialDisplay.textContent;
        let possibleRootsText = '可能的有理根:\n';
        possibleRootsList.querySelectorAll('.root-item').forEach(item => {
            possibleRootsText += item.textContent + '\n';
        });

        let validRootsText = '有效的有理根:\n';
        validRootsList.querySelectorAll('.root-item').forEach(item => {
            validRootsText += item.textContent + '\n';
        });

        const textToCopy = `${polynomialText}\n\n${possibleRootsText}\n${validRootsText}`;

        navigator.clipboard.writeText(textToCopy).then(() => {
            alert('结果已复制到剪贴板！');
        }).catch(err => {
            alert('复制失败: ' + err);
        });
    }

    // 清空结果
    function clearResults() {
        polynomialDisplay.textContent = '';
        possibleRootsList.innerHTML = '点击计算按钮开始...';
        validRootsList.innerHTML = '将显示验证后的真实根...';
        calculationProcess.innerHTML = '';
    }

    // 寻找有理根
function findRationalRoots() {
    try {
        const process = [];
        process.push('开始寻找有理根...');

        // 读取系数
        const degree = parseInt(degreeSelect.value);
        const coefficients = [];

        for (let i = degree; i >= 0; i--) {
            const coeff = parseFloat(document.getElementById(`coeff-${i}`).value);
            if (isNaN(coeff)) {
                alert('请输入有效的系数值');
                return;
            }
            coefficients.push(coeff);
        }

        // 检查首项系数是否为0
        if (coefficients[0] === 0) {
            alert('首项系数不能为0');
            return;
        }

        // 显示多项式
        let polynomialStr = 'P(x) = ';
        for (let i = 0; i < coefficients.length; i++) {
            const power = degree - i;
            const coeff = coefficients[i];

            if (coeff === 0 && i > 0) continue;

            if (i > 0) {
                polynomialStr += coeff > 0 ? ' + ' : ' - ';
            } else if (coeff < 0) {
                polynomialStr += '-';
            }

            polynomialStr += Math.abs(coeff) !== 1 || power === 0 ? Math.abs(coeff) : '';

            if (power > 0) {
                polynomialStr += 'x';
                if (power > 1) {
                    polynomialStr += `^${power}`;
                }
            }
        }
        polynomialDisplay.textContent = polynomialStr;
        process.push(`多项式: ${polynomialStr}`);

        // 应用有理根定理
        const leadingCoeff = coefficients[0];
        const constantTerm = coefficients[coefficients.length - 1];

        process.push(`首项系数: ${leadingCoeff}`);
        process.push(`常数项: ${constantTerm}`);

        // 处理常数项为0的情况
        if (constantTerm === 0) {
            process.push('常数项为0，x=0是一个根');
            validRootsList.innerHTML = '<div class="root-item">0</div>';
            possibleRootsList.innerHTML = '<div class="root-item">0</div>';
            process.push('0 是有效根！');
            displayProcess(process);
            return;
        }

        // 找出首项系数和常数项的所有因数
        const leadingFactors = getFactors(Math.abs(leadingCoeff));
        const constantFactors = getFactors(Math.abs(constantTerm));

        process.push(`首项系数的因数: ${leadingFactors.join(', ')}`);
        process.push(`常数项的因数: ${constantFactors.join(', ')}`);

        // 生成所有可能的有理根
        const possibleRoots = new Set();
        for (const p of constantFactors) {
            for (const q of leadingFactors) {
                if (q === 0) continue; // 避免除以零
                // 添加正负根
                const [num1, den1] = reduceFraction(p, q);
                possibleRoots.add(`${num1}/${den1}`);
                const [num2, den2] = reduceFraction(-p, q);
                possibleRoots.add(`${num2}/${den2}`);
            }
        }

        // 转换为数组并排序
        const possibleRootsArray = Array.from(possibleRoots).sort((a, b) => {
            // 解析分数并比较
            const [numA, denA] = a.split('/').map(Number);
            const [numB, denB] = b.split('/').map(Number);
            return (numA / denA) - (numB / denB);
        });

        process.push(`可能的有理根: ${possibleRootsArray.join(', ')}`);

        // 显示可能的有理根
        possibleRootsList.innerHTML = '';
        possibleRootsArray.forEach(root => {
            const div = document.createElement('div');
            div.className = 'root-item';
            div.textContent = root;
            possibleRootsList.appendChild(div);
        });

        // 验证哪些根是有效的
        validRootsList.innerHTML = '';
        const validRoots = [];

        process.push('验证有理根...');
        possibleRootsArray.forEach(rootStr => {
            try {
                const [num, den] = rootStr.split('/').map(Number);
                if (den === 0) {
                    process.push(`${rootStr}: 分母为0，跳过`);
                    return;
                }
                const x = num / den;
                const value = evaluatePolynomial(coefficients, x);

                process.push(`计算 P(${rootStr}) = ${value.toFixed(10)}`);

                // 考虑浮点误差
                if (!isNaN(value) && Math.abs(value) < 1e-10) {
                    validRoots.push(rootStr);
                    process.push(`${rootStr} 是有效根！`);
                    const div = document.createElement('div');
                    div.className = 'root-item';
                    div.textContent = rootStr;
                    validRootsList.appendChild(div);
                } else {
                    process.push(`${rootStr} 不是有效根。`);
                }
            } catch (error) {
                process.push(`${rootStr}: 验证时出错 - ${error.message}`);
                console.error(`验证根 ${rootStr} 时出错:`, error);
            }
        });

        if (validRoots.length === 0) {
            const div = document.createElement('div');
            div.textContent = '没有找到有效的有理根';
            validRootsList.appendChild(div);
        }

        // 显示计算过程
        displayProcess(process);
    } catch (error) {
        console.error('寻找有理根时出错:', error);
        alert('计算过程中出错: ' + error.message);
        calculationProcess.innerHTML = `<div style="color: red;">计算过程中出错: ${error.message}</div>`;
    }
}

    // 获取一个数的所有因数
    function getFactors(n) {
        if (n === 0) return [0];
        const factors = new Set();
        for (let i = 1; i <= Math.sqrt(n); i++) {
            if (n % i === 0) {
                factors.add(i);
                factors.add(n / i);
            }
        }
        return Array.from(factors).sort((a, b) => a - b);
    }

    // 绑定按钮事件
    findRootsButton.addEventListener('click', findRationalRoots);
    copyButton.addEventListener('click', copyResultsToClipboard);
    clearButton.addEventListener('click', clearResults);

    // 初始化页面
    initializeCoefficients();
    possibleRootsList.innerHTML = '点击计算按钮开始...';
    validRootsList.innerHTML = '将显示验证后的真实根...';
});