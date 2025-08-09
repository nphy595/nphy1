document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const dividendDegreeSelect = document.getElementById('dividend-degree');
    const divisorDegreeSelect = document.getElementById('divisor-degree');
    const dividendCoefficientsDiv = document.getElementById('dividend-coefficients');
    const divisorCoefficientsDiv = document.getElementById('divisor-coefficients');
    const divideButton = document.getElementById('divide-polynomials');
    const quotientDisplay = document.getElementById('quotient-display');
    const remainderDisplay = document.getElementById('remainder-display');

    // 初始化多项式输入框
    initPolynomialInputs(dividendDegreeSelect.value, dividendCoefficientsDiv, [1, 0, 0, 0]); // 默认被除数: x^3
    initPolynomialInputs(divisorDegreeSelect.value, divisorCoefficientsDiv, [1, 1]); // 默认除数: x + 1

    // 添加事件监听器
    dividendDegreeSelect.addEventListener('change', function() {
        initPolynomialInputs(this.value, dividendCoefficientsDiv);
    });

    divisorDegreeSelect.addEventListener('change', function() {
        initPolynomialInputs(this.value, divisorCoefficientsDiv);
    });

    divideButton.addEventListener('click', function() {
        performPolynomialDivision();
    });

    // 初始化多项式输入框
    function initPolynomialInputs(degree, container, defaultCoefficients = null) {
        container.innerHTML = '';
        degree = parseInt(degree);

        for (let i = degree; i >= 0; i--) {
            const coefficientLabel = document.createElement('div');
            coefficientLabel.className = 'coefficient-label';

            const input = document.createElement('input');
            input.type = 'number';
            input.step = 'any';
            input.className = 'coefficient-input';
            input.id = `${container.id}-coeff-${i}`;

            // 设置默认值
            if (defaultCoefficients && defaultCoefficients[degree - i] !== undefined) {
                input.value = defaultCoefficients[degree - i];
            } else if (i === degree) {
                input.value = 1; // 首项系数默认为1
            } else {
                input.value = 0;
            }

            const powerLabel = document.createElement('span');
            powerLabel.className = 'power-label';
            if (i === 0) {
                powerLabel.textContent = '常数项';
            } else if (i === 1) {
                powerLabel.textContent = 'x';
            } else {
                powerLabel.textContent = `x^${i}`;
            }

            coefficientLabel.appendChild(input);
            coefficientLabel.appendChild(powerLabel);
            container.appendChild(coefficientLabel);
        }
    }

    // 获取多项式系数
    function getPolynomialCoefficients(containerId) {
        const container = document.getElementById(containerId);
        const inputs = container.querySelectorAll('.coefficient-input');
        const coefficients = [];

        inputs.forEach(input => {
            coefficients.push(parseFloat(input.value) || 0);
        });

        // 反转数组，使得索引对应次数（索引0对应x^0的系数，索引1对应x^1的系数，依此类推）
        return coefficients.reverse();
    }

    // 执行多项式除法
    function performPolynomialDivision() {
        try {
            // 获取被除数和除数的系数
            const dividendCoefficients = getPolynomialCoefficients('dividend-coefficients');
            const divisorCoefficients = getPolynomialCoefficients('divisor-coefficients');

            // 移除前导零
            const cleanedDividend = removeLeadingZeros(dividendCoefficients);
            const cleanedDivisor = removeLeadingZeros(divisorCoefficients);

            // 检查除数是否为零
            if (cleanedDivisor.length === 0 || (cleanedDivisor.length === 1 && cleanedDivisor[0] === 0)) {
                throw new Error('除数不能为零多项式');
            }

            // 检查除数次数是否大于被除数次数
            if (cleanedDivisor.length > cleanedDividend.length) {
                // 商式为零，余式为被除数
                quotientDisplay.textContent = formatPolynomial([0]);
                remainderDisplay.textContent = formatPolynomial(cleanedDividend);
                return;
            }

            // 执行多项式长除法
            const { quotient, remainder } = polynomialLongDivision(cleanedDividend, cleanedDivisor);

            // 显示结果
            quotientDisplay.textContent = formatPolynomial(quotient);
            remainderDisplay.textContent = formatPolynomial(remainder);
        } catch (error) {
            quotientDisplay.textContent = '';
            remainderDisplay.innerHTML = `<span style="color: red;">${error.message}</span>`;
        }
    }

    // 移除多项式的前导零
    function removeLeadingZeros(coefficients) {
        // 找到第一个非零系数的索引
        let firstNonZeroIndex = coefficients.length - 1;
        while (firstNonZeroIndex >= 0 && Math.abs(coefficients[firstNonZeroIndex]) < 1e-10) {
            firstNonZeroIndex--;
        }

        // 如果所有系数都是零，返回[0]
        if (firstNonZeroIndex < 0) {
            return [0];
        }

        // 返回移除前导零后的系数数组
        return coefficients.slice(0, firstNonZeroIndex + 1);
    }

    // 多项式长除法
    function polynomialLongDivision(dividend, divisor) {
        // 初始化商式和余式
        const quotient = new Array(dividend.length - divisor.length + 1).fill(0);
        let remainder = [...dividend];

        // 执行长除法
        for (let i = 0; i < quotient.length; i++) {
            // 计算当前商的系数
            quotient[i] = remainder[remainder.length - 1] / divisor[divisor.length - 1];

            // 用商乘以除数，并从余式中减去
            for (let j = 0; j < divisor.length; j++) {
                remainder[remainder.length - 1 - j] -= quotient[i] * divisor[divisor.length - 1 - j];
            }

            // 移除余式中的最高次项（应该为零）
            remainder.pop();

            // 如果余式的所有系数都接近零，提前结束
            if (remainder.every(coeff => Math.abs(coeff) < 1e-10)) {
                remainder = [0];
                break;
            }

            // 移除余式中的前导零
            remainder = removeLeadingZeros(remainder);

            // 如果余式次数小于除式次数，结束除法
            if (remainder.length < divisor.length) {
                break;
            }
        }

        // 清理商式和余式中的微小值
        const cleanedQuotient = quotient.map(coeff => Math.abs(coeff) < 1e-10 ? 0 : coeff);
        const cleanedRemainder = remainder.map(coeff => Math.abs(coeff) < 1e-10 ? 0 : coeff);

        return { quotient: cleanedQuotient, remainder: cleanedRemainder };
    }

    // 格式化多项式为字符串
    function formatPolynomial(coefficients) {
        // 移除前导零
        const cleanedCoefficients = removeLeadingZeros(coefficients);

        // 如果多项式为零
        if (cleanedCoefficients.length === 1 && cleanedCoefficients[0] === 0) {
            return '0';
        }

        let result = '';

        for (let i = cleanedCoefficients.length - 1; i >= 0; i--) {
            const coeff = cleanedCoefficients[i];

            // 跳过零系数项
            if (Math.abs(coeff) < 1e-10) {
                continue;
            }

            // 格式化系数
            let coeffStr = '';
            if (i === cleanedCoefficients.length - 1) {
                // 首项系数
                if (coeff === 1) {
                    coeffStr = '';
                } else if (coeff === -1) {
                    coeffStr = '-';
                } else {
                    coeffStr = formatNumber(coeff);
                }
            } else {
                // 非首项系数
                if (coeff > 0) {
                    coeffStr = ' + ';
                    if (coeff !== 1) {
                        coeffStr += formatNumber(coeff);
                    }
                } else if (coeff < 0) {
                    coeffStr = ' - ';
                    if (coeff !== -1) {
                        coeffStr += formatNumber(Math.abs(coeff));
                    }
                }
            }

            // 格式化变量和指数
            let varStr = '';
            if (i === 0) {
                // 常数项
                if (i === cleanedCoefficients.length - 1) {
                    varStr = formatNumber(coeff);
                } else {
                    if (coeff === 1) {
                        varStr = '1';
                    } else if (coeff === -1) {
                        varStr = '1';
                    } else {
                        varStr = '';
                    }
                }
            } else if (i === 1) {
                // 一次项
                varStr = 'x';
            } else {
                // 高次项
                varStr = `x^${i}`;
            }

            // 特殊处理常数项
            if (i === 0 && (coeff === 1 || coeff === -1) && cleanedCoefficients.length > 1) {
                result += coeffStr + '1';
            } else if (i === 0 && cleanedCoefficients.length === 1) {
                result += formatNumber(coeff);
            } else {
                result += coeffStr + varStr;
            }
        }

        return result;
    }

    // 格式化数字
    function formatNumber(num) {
        if (Math.abs(num - Math.round(num)) < 1e-10) {
            return Math.round(num).toString();
        } else {
            return num.toFixed(10).replace(/\.?0+$/, '');
        }
    }
});