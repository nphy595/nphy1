document.addEventListener('DOMContentLoaded', function() {
    let numEquations = 2;
    let numVariables = 2;
    const equationsContainer = document.getElementById('equations-container');
    const addEquationBtn = document.getElementById('add-equation');
    const removeEquationBtn = document.getElementById('remove-equation');
    const addVariableBtn = document.getElementById('add-variable');
    const removeVariableBtn = document.getElementById('remove-variable');
    const solveBtn = document.getElementById('solve-equations');
    const solutionResult = document.getElementById('solution-result');
    const equationTypeSelect = document.getElementById('equation-type');
    const loadExampleLink = document.getElementById('load-example');
    const copyResultBtn = document.getElementById('copy-result');
    const clearResultBtn = document.getElementById('clear-result');

    // 示例方程组数据
    const exampleEquations = {
        '2x2': {
            numEquations: 2,
            numVariables: 2,
            coefficients: [
                [1, 1, 0],  // 1x + 1y = 0
                [1, 1, 0]   // 1x + 1y = 0
            ]
        },
        '3x3': {
            numEquations: 3,
            numVariables: 3,
            coefficients: [
                [1, 2, 3, 6],   // 1x + 2y + 3z = 6
                [4, 5, 6, 15],  // 4x + 5y + 6z = 15
                [7, 8, 9, 24]   // 7x + 8y + 9z = 24
            ]
        }
    };

    // 初始化方程组表单
    initEquations();

    // 方程组类型选择事件
    equationTypeSelect.addEventListener('change', function() {
        const type = this.value;
        if (type !== 'custom') {
            const example = exampleEquations[type];
            numEquations = example.numEquations;
            numVariables = example.numVariables;
            updateEquations();
            // 禁用自定义按钮
            addEquationBtn.disabled = true;
            removeEquationBtn.disabled = true;
            addVariableBtn.disabled = true;
            removeVariableBtn.disabled = true;
        } else {
            // 启用自定义按钮
            addEquationBtn.disabled = false;
            removeEquationBtn.disabled = false;
            addVariableBtn.disabled = false;
            removeVariableBtn.disabled = false;
        }
    });

    // 载入示例方程组事件
    loadExampleLink.addEventListener('click', function(e) {
        e.preventDefault();
        const type = equationTypeSelect.value;
        if (type !== 'custom') {
            const example = exampleEquations[type];
            numEquations = example.numEquations;
            numVariables = example.numVariables;
            updateEquations();
            // 填充示例数据
            for (let i = 0; i < example.numEquations; i++) {
                for (let j = 0; j < example.numVariables; j++) {
                    document.getElementById(`coeff-${i}-${j}`).value = example.coefficients[i][j];
                }
                document.getElementById(`result-${i}`).value = example.coefficients[i][example.numVariables];
            }
        } else {
            alert('请先选择方程组类型');
        }
    });

    // 复制结果按钮事件
    copyResultBtn.addEventListener('click', function() {
        const resultText = solutionResult.innerText;
        navigator.clipboard.writeText(resultText)
            .then(() => {
                alert('结果已复制到剪贴板');
            })
            .catch(err => {
                console.error('无法复制: ', err);
                alert('复制失败，请手动复制');
            });
    });

    // 清空结果按钮事件
    clearResultBtn.addEventListener('click', function() {
        solutionResult.innerHTML = '点击求解按钮开始计算...';
    });

    // 添加方程按钮事件
    addEquationBtn.addEventListener('click', function() {
        numEquations++;
        updateEquations();
    });

    // 移除方程按钮事件
    removeEquationBtn.addEventListener('click', function() {
        if (numEquations > 1) {
            numEquations--;
            updateEquations();
        } else {
            alert('至少需要一个方程');
        }
    });

    // 添加变量按钮事件
    addVariableBtn.addEventListener('click', function() {
        numVariables++;
        updateEquations();
    });

    // 移除变量按钮事件
    removeVariableBtn.addEventListener('click', function() {
        if (numVariables > 1) {
            numVariables--;
            updateEquations();
        } else {
            alert('至少需要一个变量');
        }
    });

    // 求解按钮事件
    solveBtn.addEventListener('click', function() {
        solveEquations();
    });

    // 初始化方程组
    function initEquations() {
        equationsContainer.innerHTML = '';
        for (let i = 0; i < numEquations; i++) {
            addEquationRow(i);
        }
    }

    // 更新方程组
    function updateEquations() {
        equationsContainer.innerHTML = '';
        for (let i = 0; i < numEquations; i++) {
            addEquationRow(i);
        }
    }

    // 添加方程行
    function addEquationRow(equationIndex) {
        const equationRow = document.createElement('div');
        equationRow.className = 'equation-row';
        equationRow.id = `equation-${equationIndex}`;

        for (let j = 0; j < numVariables; j++) {
            const variableName = String.fromCharCode(97 + j); // a, b, c, ...
            const variableInput = document.createElement('input');
            variableInput.type = 'number';
            variableInput.step = 'any';
            variableInput.className = 'variable-input';
            variableInput.id = `coeff-${equationIndex}-${j}`;
            variableInput.value = j === equationIndex ? '1' : '0'; // 默认为对角矩阵
            variableInput.placeholder = variableName;

            equationRow.appendChild(variableInput);

            if (j < numVariables - 1) {
                const plusSign = document.createElement('span');
                plusSign.textContent = '+';
                equationRow.appendChild(plusSign);
            }
        }

        const equalsSign = document.createElement('span');
        equalsSign.className = 'equals-sign';
        equalsSign.textContent = '=';
        equationRow.appendChild(equalsSign);

        const resultInput = document.createElement('input');
        resultInput.type = 'number';
        resultInput.step = 'any';
        resultInput.className = 'result-value';
        resultInput.id = `result-${equationIndex}`;
        resultInput.value = equationIndex + 1; // 默认结果为方程索引+1

        equationRow.appendChild(resultInput);
        equationsContainer.appendChild(equationRow);
    }

    // 求解方程组
    function solveEquations() {
        // 构建增广矩阵
        const augmentedMatrix = [];
        for (let i = 0; i < numEquations; i++) {
            const row = [];
            for (let j = 0; j < numVariables; j++) {
                const coeff = parseFloat(document.getElementById(`coeff-${i}-${j}`).value);
                row.push(isNaN(coeff) ? 0 : coeff);
            }
            const result = parseFloat(document.getElementById(`result-${i}`).value);
            row.push(isNaN(result) ? 0 : result);
            augmentedMatrix.push(row);
        }

        try {
            // 执行高斯消元法
            const solution = gaussElimination(augmentedMatrix, numVariables);
            displaySolution(solution);
        } catch (error) {
            solutionResult.innerHTML = `<span style="color: red;">${error.message}</span>`;
        }
    }

    // 高斯消元法求解线性方程组
    function gaussElimination(matrix, numVariables) {
        const n = matrix.length; // 方程数量
        const m = numVariables; // 变量数量

        // 前向消元
        for (let i = 0; i < Math.min(n, m); i++) {
            // 寻找主元
            let pivotRow = i;
            for (let j = i; j < n; j++) {
                if (Math.abs(matrix[j][i]) > Math.abs(matrix[pivotRow][i])) {
                    pivotRow = j;
                }
            }

            // 交换行
            if (pivotRow !== i) {
                [matrix[i], matrix[pivotRow]] = [matrix[pivotRow], matrix[i]];
            }

            // 如果主元为0，方程组可能有无穷解或无解
            if (Math.abs(matrix[i][i]) < 1e-10) {
                // 检查增广部分是否也为0
                let allZero = true;
                for (let j = i; j < n; j++) {
                    if (Math.abs(matrix[j][i]) > 1e-10 || Math.abs(matrix[j][m]) > 1e-10) {
                        allZero = false;
                        break;
                    }
                }

                if (allZero) {
                    // 无穷多解
                    throw new Error('方程组有无穷多解');
                } else {
                    // 无解
                    throw new Error('方程组无解');
                }
            }

            // 归一化主行
            const pivot = matrix[i][i];
            for (let j = i; j <= m; j++) {
                matrix[i][j] /= pivot;
            }

            // 消去其他行的当前列
            for (let j = 0; j < n; j++) {
                if (j !== i && Math.abs(matrix[j][i]) > 1e-10) {
                    const factor = matrix[j][i];
                    for (let k = i; k <= m; k++) {
                        matrix[j][k] -= factor * matrix[i][k];
                    }
                }
            }
        }

        // 检查是否有解
        for (let i = Math.min(n, m); i < n; i++) {
            if (Math.abs(matrix[i][m]) > 1e-10) {
                throw new Error('方程组无解');
            }
        }

        // 构造解
        const solution = new Array(m).fill(0);
        for (let i = 0; i < Math.min(n, m); i++) {
            solution[i] = matrix[i][m];
        }

        // 如果变量数多于方程数，其余变量设为0（特解）
        return solution;
    }

    // 显示解
    function displaySolution(solution) {
        let html = '';
        for (let i = 0; i < solution.length; i++) {
            const variableName = String.fromCharCode(97 + i); // a, b, c, ...
            // 格式化输出，避免过多小数位
            let value = solution[i];
            if (Math.abs(value) < 1e-10) {
                value = 0;
            } else if (Math.abs(value - Math.round(value)) < 1e-10) {
                value = Math.round(value);
            } else {
                value = value.toFixed(10).replace(/\.?0+$/, '');
            }
            html += `<p>${variableName} = ${value}</p>`;
        }
        solutionResult.innerHTML = html;
    }
});