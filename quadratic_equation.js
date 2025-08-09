// 二次方程计算器功能实现

// DOM元素获取
const coefficientAInput = document.getElementById('coefficient-a');
const coefficientBInput = document.getElementById('coefficient-b');
const coefficientCInput = document.getElementById('coefficient-c');
const calculateButton = document.getElementById('calculate');
const equationFormDisplay = document.getElementById('equation-form');
const discriminantDisplay = document.getElementById('discriminant');
const parabolaDirectionDisplay = document.getElementById('parabola-direction');
const axisSymmetryDisplay = document.getElementById('axis-symmetry');
const vertexDisplay = document.getElementById('vertex');
const solutionTypeDisplay = document.getElementById('solution-type');
const solutionDisplay = document.getElementById('solution');
const stepsListDisplay = document.getElementById('steps-list');
const copyResultButton = document.getElementById('copy-result');
const resetButton = document.getElementById('reset');

// 计算二次方程
function calculateQuadratic() {
    // 获取输入值
    const a = parseFloat(coefficientAInput.value);
    const b = parseFloat(coefficientBInput.value);
    const c = parseFloat(coefficientCInput.value);

    // 输入验证
    if (isNaN(a) || isNaN(b) || isNaN(c)) {
        alert('请输入有效的数值');
        return;
    }

    if (a === 0) {
        alert('系数a不能为0');
        return;
    }

    // 显示方程形式
    equationFormDisplay.textContent = `方程形式: ${formatCoefficient(a)}x² + ${formatCoefficient(b)}x + ${formatCoefficient(c)} = 0`;

    // 计算判别式
    const discriminant = b * b - 4 * a * c;
    discriminantDisplay.textContent = `判别式 Δ = b²-4ac = ${b}²-4×${a}×${c} = ${discriminant.toFixed(6)}`;

    // 计算抛物线特征
    const parabolaDirection = a > 0 ? '向上' : '向下';
    parabolaDirectionDisplay.textContent = `抛物线开口${parabolaDirection}`;

    const axisSymmetry = -b / (2 * a);
    axisSymmetryDisplay.textContent = `对称轴 x = ${axisSymmetry.toFixed(10)}`;

    const vertexY = a * axisSymmetry * axisSymmetry + b * axisSymmetry + c;
    vertexDisplay.textContent = `顶点坐标: (${axisSymmetry.toFixed(10)}, ${vertexY.toFixed(10)})`;

    // 计算方程解和步骤
    let steps = [];
    steps.push(`1. 计算判别式 Δ = ${b}²-4×${a}×${c} = ${discriminant.toFixed(6)}`);

    if (discriminant > 0) {
        // 两个不同实根
        solutionTypeDisplay.textContent = '有两个不同实根:';
        steps.push(`2. 因为 Δ > 0，方程有两个不同实根`);

        const sqrtDiscriminant = Math.sqrt(discriminant);
        steps.push(`3. 计算平方根 √Δ = √${discriminant.toFixed(6)} = ${sqrtDiscriminant.toFixed(6)}`);

        const x1 = (-b + sqrtDiscriminant) / (2 * a);
        const x2 = (-b - sqrtDiscriminant) / (2 * a);
        steps.push(`4. 应用求根公式 x = (-b±√Δ)/(2a)`);
        steps.push(`   x₁ = (-${b} + ${sqrtDiscriminant.toFixed(6)})/(2×${a}) = ${x1.toFixed(6)}`);
        steps.push(`   x₂ = (-${b} - ${sqrtDiscriminant.toFixed(6)})/(2×${a}) = ${x2.toFixed(6)}`);

        solutionDisplay.value = `x₁ = ${x1.toFixed(6)}, x₂ = ${x2.toFixed(6)}`;
    } else if (discriminant === 0) {
        // 一个重根
        solutionTypeDisplay.textContent = '有一个重根:';
        steps.push(`2. 因为 Δ = 0，方程有一个重根`);

        const x = -b / (2 * a);
        steps.push(`3. 应用求根公式 x = -b/(2a) = -${b}/(2×${a}) = ${x.toFixed(6)}`);

        solutionDisplay.value = `x₁ = x₂ = ${x.toFixed(6)}`;
    } else {
        // 两个共轭复根
        solutionTypeDisplay.textContent = '有两个共轭复根:';
        steps.push(`2. 因为 Δ < 0，方程有两个共轭复根`);

        const sqrtDiscriminant = Math.sqrt(-discriminant);
        steps.push(`3. 计算平方根 √|Δ| = √${(-discriminant).toFixed(6)} = ${sqrtDiscriminant.toFixed(6)}`);

        const realPart = (-b / (2 * a)).toFixed(6);
        const imaginaryPart = (sqrtDiscriminant / (2 * a)).toFixed(6);
        steps.push(`4. 应用求根公式 x = (-b±i√|Δ|)/(2a)`);
        steps.push(`   x₁ = ${realPart} + ${imaginaryPart}i`);
        steps.push(`   x₂ = ${realPart} - ${imaginaryPart}i`);

        solutionDisplay.value = `x₁ = ${realPart} + ${imaginaryPart}i, x₂ = ${realPart} - ${imaginaryPart}i`;
    }

    // 更新步骤列表
    updateStepsList(steps);
}

// 格式化系数显示
function formatCoefficient(coefficient) {
    if (coefficient === 0) {
        return '0';
    }

    if (coefficient === 1) {
        return '';
    }

    if (coefficient === -1) {
        return '-';
    }

    return coefficient.toString();
}

// 更新步骤列表
function updateStepsList(steps) {
    stepsListDisplay.innerHTML = '';

    steps.forEach(step => {
        const li = document.createElement('li');
        li.textContent = step;
        stepsListDisplay.appendChild(li);
    });
}

// 复制结果到剪贴板
function copyResult() {
    solutionDisplay.select();
    document.execCommand('copy');

    const originalText = copyResultButton.textContent;
    copyResultButton.textContent = '复制成功!';
    setTimeout(() => {
        copyResultButton.textContent = originalText;
    }, 2000);
}

// 重置计算器
function resetCalculator() {
    coefficientAInput.value = '1';
    coefficientBInput.value = '0';
    coefficientCInput.value = '0';

    equationFormDisplay.textContent = '方程形式: x² + 0x + 0 = 0';
    discriminantDisplay.textContent = '判别式 Δ = b²-4ac = 0²-4×1×0 = 0.000000';
    parabolaDirectionDisplay.textContent = '抛物线开口向上';
    axisSymmetryDisplay.textContent = '对称轴 x = 0.0000000000';
    vertexDisplay.textContent = '顶点坐标: (0.0000000000, 0.0000000000)';
    solutionTypeDisplay.textContent = '有一个重根:';
    solutionDisplay.value = 'x₁ = x₂ = 0.000000';

    updateStepsList([
        '1. 计算判别式 Δ = 0²-4×1×0 = 0',
        '2. 因为 Δ = 0，方程有一个重根',
        '3. 应用求根公式 x = -b/(2a) = -0/(2×1) = 0.000000'
    ]);
}

// 事件监听
calculateButton.addEventListener('click', calculateQuadratic);
copyResultButton.addEventListener('click', copyResult);
resetButton.addEventListener('click', resetCalculator);

// 键盘事件监听
coefficientAInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        calculateQuadratic();
    }
});

coefficientBInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        calculateQuadratic();
    }
});

coefficientCInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        calculateQuadratic();
    }
});

// 初始化
calculateQuadratic();