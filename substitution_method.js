document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const equation1Input = document.getElementById('equation1');
    const equation2Input = document.getElementById('equation2');
    const solveButton = document.getElementById('solve-equation');
    const clearButton = document.getElementById('clear-equation');
    const solutionResult = document.getElementById('solution-result');
    const calculationProcess = document.getElementById('calculation-process');

    // 解析方程字符串，提取系数
    function parseEquation(equationStr) {
        // 移除所有空格
        equationStr = equationStr.replace(/\s+/g, '');

        // 检查等号
        if (!equationStr.includes('=')) {
            throw new Error('方程格式错误，缺少等号');
        }

        // 分离方程左右两边
        const [leftSide, rightSide] = equationStr.split('=');
        const rightValue = parseFloat(rightSide);

        if (isNaN(rightValue)) {
            throw new Error('方程右边不是有效的数字');
        }

        // 匹配x和y的系数
        const xMatch = leftSide.match(/([+-]?\s*\d*\.?\d*)\s*\*?\s*x/);
        const yMatch = leftSide.match(/([+-]?\s*\d*\.?\d*)\s*\*?\s*y/);

        // 提取x系数
        let xCoeff = 0;
        if (xMatch) {
            let coeffStr = xMatch[1].trim();
            if (coeffStr === '+' || coeffStr === '') {
                xCoeff = 1;
            } else if (coeffStr === '-') {
                xCoeff = -1;
            } else {
                xCoeff = parseFloat(coeffStr);
            }
        }

        // 提取y系数
        let yCoeff = 0;
        if (yMatch) {
            let coeffStr = yMatch[1].trim();
            if (coeffStr === '+' || coeffStr === '') {
                yCoeff = 1;
            } else if (coeffStr === '-') {
                yCoeff = -1;
            } else {
                yCoeff = parseFloat(coeffStr);
            }
        }

        // 检查是否有常数项
        let constantTerm = 0;
        // 移除x和y项后检查剩余部分
        let remaining = leftSide;
        if (xMatch) remaining = remaining.replace(xMatch[0], '');
        if (yMatch) remaining = remaining.replace(yMatch[0], '');

        // 如果还有剩余部分，尝试解析为常数项
        if (remaining.trim() !== '') {
            const constantMatch = remaining.match(/([+-]?\s*\d*\.?\d*)/);
            if (constantMatch) {
                constantTerm = parseFloat(constantMatch[1]);
            }
        }

        // 调整方程形式为 ax + by = c
        return {
            a: xCoeff,
            b: yCoeff,
            c: rightValue - constantTerm
        };
    }

    // 显示计算过程
    function displayProcess(steps) {
        calculationProcess.innerHTML = '';
        steps.forEach(step => {
            const div = document.createElement('div');
            div.className = 'process-step';
            div.textContent = step;
            calculationProcess.appendChild(div);
        });
        // 滚动到最新步骤
        calculationProcess.scrollTop = calculationProcess.scrollHeight;
    }

    // 求解方程组
    function solveEquations() {
        try {
            const process = [];
            process.push('开始求解方程组...');

            // 获取方程输入
            const equation1Str = equation1Input.value.trim();
            const equation2Str = equation2Input.value.trim();

            if (!equation1Str || !equation2Str) {
                throw new Error('请输入两个方程');
            }

            // 解析方程
            process.push('解析方程...');
            const eq1 = parseEquation(equation1Str);
            const eq2 = parseEquation(equation2Str);

            process.push(`方程1: ${eq1.a}x + ${eq1.b}y = ${eq1.c}`);
            process.push(`方程2: ${eq2.a}x + ${eq2.b}y = ${eq2.c}`);

            // 计算行列式，判断方程组是否有解
            const determinant = eq1.a * eq2.b - eq2.a * eq1.b;
            process.push(`计算系数行列式: D = ${eq1.a}*${eq2.b} - ${eq2.a}*${eq1.b} = ${determinant}`);

            if (Math.abs(determinant) < 1e-10) {
                // 行列式接近0，检查是否有无穷多解或无解
                const d1 = eq1.c * eq2.b - eq2.c * eq1.b;
                const d2 = eq1.a * eq2.c - eq2.a * eq1.c;

                process.push(`计算D1 = ${eq1.c}*${eq2.b} - ${eq2.c}*${eq1.b} = ${d1}`);
                process.push(`计算D2 = ${eq1.a}*${eq2.c} - ${eq2.a}*${eq1.c} = ${d2}`);

                if (Math.abs(d1) < 1e-10 && Math.abs(d2) < 1e-10) {
                    process.push('方程组有无穷多解');
                    solutionResult.innerHTML = '<div style="color: blue;">方程组有无穷多解</div>';
                } else {
                    process.push('方程组无解');
                    solutionResult.innerHTML = '<div style="color: red;">方程组无解</div>';
                }
            } else {
                // 有唯一解，使用替代法求解
                process.push('方程组有唯一解，使用替代法求解...');

                // 选择系数较大的变量进行消元，以减少计算误差
                let solveForXFirst = Math.abs(eq1.a) + Math.abs(eq2.a) > Math.abs(eq1.b) + Math.abs(eq2.b);

                let x, y;
                if (solveForXFirst) {
                    process.push('选择先解出x...');
                    // 从方程1解出x
                    if (Math.abs(eq1.a) < 1e-10) {
                        process.push('方程1的x系数为0，从方程2解出x...');
                        // 从方程2解出x
                        x = (eq2.c - eq2.b * y) / eq2.a;
                        process.push(`x = (${eq2.c} - ${eq2.b}y) / ${eq2.a}`);
                        // 代入方程1
                        process.push(`代入方程1: ${eq1.a}*(((${eq2.c} - ${eq2.b}y) / ${eq2.a})) + ${eq1.b}y = ${eq1.c}`);
                    } else {
                        process.push(`从方程1解出x: x = (${eq1.c} - ${eq1.b}y) / ${eq1.a}`);
                        // 代入方程2
                        process.push(`代入方程2: ${eq2.a}*(((${eq1.c} - ${eq1.b}y) / ${eq1.a})) + ${eq2.b}y = ${eq2.c}`);
                    }
                } else {
                    process.push('选择先解出y...');
                    // 从方程1解出y
                    if (Math.abs(eq1.b) < 1e-10) {
                        process.push('方程1的y系数为0，从方程2解出y...');
                        // 从方程2解出y
                        process.push(`y = (${eq2.c} - ${eq2.a}x) / ${eq2.b}`);
                        // 代入方程1
                        process.push(`代入方程1: ${eq1.a}x + ${eq1.b}*(((${eq2.c} - ${eq2.a}x) / ${eq2.b})) = ${eq1.c}`);
                    } else {
                        process.push(`从方程1解出y: y = (${eq1.c} - ${eq1.a}x) / ${eq1.b}`);
                        // 代入方程2
                        process.push(`代入方程2: ${eq2.a}x + ${eq2.b}*(((${eq1.c} - ${eq1.a}x) / ${eq1.b})) = ${eq2.c}`);
                    }
                }

                // 实际计算解
                x = (eq1.b * eq2.c - eq2.b * eq1.c) / determinant;
                y = (eq2.a * eq1.c - eq1.a * eq2.c) / determinant;

                process.push(`计算得: x = ${x.toFixed(10)}, y = ${y.toFixed(10)}`);
                process.push('验证解是否正确...');

                // 验证解
                const verify1 = eq1.a * x + eq1.b * y;
                const verify2 = eq2.a * x + eq2.b * y;
                process.push(`代入方程1: ${eq1.a}*${x.toFixed(10)} + ${eq1.b}*${y.toFixed(10)} = ${verify1.toFixed(10)} ≈ ${eq1.c}`);
                process.push(`代入方程2: ${eq2.a}*${x.toFixed(10)} + ${eq2.b}*${y.toFixed(10)} = ${verify2.toFixed(10)} ≈ ${eq2.c}`);

                // 显示结果
                solutionResult.innerHTML = `
                    <div>x = ${x.toFixed(10)}</div>
                    <div>y = ${y.toFixed(10)}</div>
                `;
            }

            // 显示计算过程
            displayProcess(process);
        } catch (error) {
            console.error('求解方程时出错:', error);
            solutionResult.innerHTML = `<div style="color: red;">计算错误: ${error.message}</div>`;
            calculationProcess.innerHTML = `<div style="color: red;">计算错误: ${error.message}</div>`;
        }
    }

    // 清空输入和结果
    function clearEquations() {
        equation1Input.value = '';
        equation2Input.value = '';
        solutionResult.innerHTML = '';
        calculationProcess.innerHTML = '';
    }

    // 绑定按钮事件
    solveButton.addEventListener('click', solveEquations);
    clearButton.addEventListener('click', clearEquations);
});