document.addEventListener('DOMContentLoaded', function() {
    // 四元数类定义
    class Quaternion {
        constructor(w, x, y, z) {
            this.w = w;
            this.x = x;
            this.y = y;
            this.z = z;
        }

        // 加法
        add(q) {
            return new Quaternion(
                this.w + q.w,
                this.x + q.x,
                this.y + q.y,
                this.z + q.z
            );
        }

        // 减法
        subtract(q) {
            return new Quaternion(
                this.w - q.w,
                this.x - q.x,
                this.y - q.y,
                this.z - q.z
            );
        }

        // 乘法
        multiply(q) {
            // q1 * q2 = (w1w2 - x1x2 - y1y2 - z1z2) +
            //          (w1x2 + x1w2 + y1z2 - z1y2)i +
            //          (w1y2 - x1z2 + y1w2 + z1x2)j +
            //          (w1z2 + x1y2 - y1x2 + z1w2)k
            return new Quaternion(
                this.w * q.w - this.x * q.x - this.y * q.y - this.z * q.z,
                this.w * q.x + this.x * q.w + this.y * q.z - this.z * q.y,
                this.w * q.y - this.x * q.z + this.y * q.w + this.z * q.x,
                this.w * q.z + this.x * q.y - this.y * q.x + this.z * q.w
            );
        }

        // 除法 (this / q = this * q.inverse())
        divide(q) {
            return this.multiply(q.inverse());
        }

        // 共轭
        conjugate() {
            return new Quaternion(this.w, -this.x, -this.y, -this.z);
        }

        // 模长
        magnitude() {
            return Math.sqrt(this.w * this.w + this.x * this.x + this.y * this.y + this.z * this.z);
        }

        // 逆
        inverse() {
            const magSquared = this.w * this.w + this.x * this.x + this.y * this.y + this.z * this.z;
            if (Math.abs(magSquared) < 1e-10) {
                throw new Error('零四元数没有逆');
            }
            const conj = this.conjugate();
            return new Quaternion(
                conj.w / magSquared,
                conj.x / magSquared,
                conj.y / magSquared,
                conj.z / magSquared
            );
        }

        // 归一化
        normalize() {
            const mag = this.magnitude();
            if (Math.abs(mag) < 1e-10) {
                throw new Error('零四元数不能归一化');
            }
            return new Quaternion(
                this.w / mag,
                this.x / mag,
                this.y / mag,
                this.z / mag
            );
        }

        // 格式化输出
        format() {
            return {
                w: this.formatNumber(this.w),
                x: this.formatNumber(this.x),
                y: this.formatNumber(this.y),
                z: this.formatNumber(this.z)
            };
        }

        // 格式化数字
        formatNumber(num) {
            if (Math.abs(num) < 1e-10) {
                return 0;
            } else if (Math.abs(num - Math.round(num)) < 1e-10) {
                return Math.round(num);
            } else {
                return num.toFixed(10).replace(/\.?0+$/, '');
            }
        }

        // 转换为旋转矩阵
        toRotationMatrix() {
            const w = this.w;
            const x = this.x;
            const y = this.y;
            const z = this.z;

            // 计算旋转矩阵的元素
            const m11 = 1 - 2 * y * y - 2 * z * z;
            const m12 = 2 * x * y - 2 * z * w;
            const m13 = 2 * x * z + 2 * y * w;

            const m21 = 2 * x * y + 2 * z * w;
            const m22 = 1 - 2 * x * x - 2 * z * z;
            const m23 = 2 * y * z - 2 * x * w;

            const m31 = 2 * x * z - 2 * y * w;
            const m32 = 2 * y * z + 2 * x * w;
            const m33 = 1 - 2 * x * x - 2 * y * y;

            return [
                [m11, m12, m13],
                [m21, m22, m23],
                [m31, m32, m33]
            ];
        }

        // 转换为欧拉角 (Z-Y-X, 即偏航-俯仰-滚转)
        toEulerAngles() {
            const w = this.w;
            const x = this.x;
            const y = this.y;
            const z = this.z;

            // 计算欧拉角 (弧度)
            let roll, pitch, yaw;

            // 偏航 (yaw)
            const sinYaw = 2.0 * (w * z + x * y);
            const cosYaw = 1.0 - 2.0 * (y * y + z * z);
            yaw = Math.atan2(sinYaw, cosYaw);

            // 俯仰 (pitch)
            const sinPitch = 2.0 * (w * y - z * x);
            if (Math.abs(sinPitch) >= 1) {
                pitch = Math.sign(sinPitch) * Math.PI / 2;
            } else {
                pitch = Math.asin(sinPitch);
            }

            // 滚转 (roll)
            const sinRoll = 2.0 * (w * x + y * z);
            const cosRoll = 1.0 - 2.0 * (x * x + y * y);
            roll = Math.atan2(sinRoll, cosRoll);

            // 转换为角度
            return {
                roll: roll * 180 / Math.PI,
                pitch: pitch * 180 / Math.PI,
                yaw: yaw * 180 / Math.PI
            };
        }

        // 从欧拉角创建四元数 (Z-Y-X, 即偏航-俯仰-滚转)
        static fromEulerAngles(roll, pitch, yaw) {
            // 转换为弧度
            roll = roll * Math.PI / 180;
            pitch = pitch * Math.PI / 180;
            yaw = yaw * Math.PI / 180;

            // 计算半角
            const cy = Math.cos(yaw * 0.5);
            const sy = Math.sin(yaw * 0.5);
            const cp = Math.cos(pitch * 0.5);
            const sp = Math.sin(pitch * 0.5);
            const cr = Math.cos(roll * 0.5);
            const sr = Math.sin(roll * 0.5);

            // 计算四元数
            const w = cy * cp * cr + sy * sp * sr;
            const x = cy * cp * sr - sy * sp * cr;
            const y = sy * cp * sr + cy * sp * cr;
            const z = sy * cp * cr - cy * sp * sr;

            return new Quaternion(w, x, y, z);
        }
    }

    // 获取四元数输入
    function getQuaternionInput(prefix) {
        const w = parseFloat(document.getElementById(`${prefix}-w`).value) || 0;
        const x = parseFloat(document.getElementById(`${prefix}-x`).value) || 0;
        const y = parseFloat(document.getElementById(`${prefix}-y`).value) || 0;
        const z = parseFloat(document.getElementById(`${prefix}-z`).value) || 0;
        return new Quaternion(w, x, y, z);
    }

    // 显示结果
    function displayResult(result) {
        const resultElement = document.getElementById('quaternion-result');
        if (typeof result === 'number') {
            // 如果结果是标量（如模长）
            resultElement.innerHTML = `<p>${result}</p>`;
        } else if (result instanceof Quaternion) {
            // 如果结果是四元数
            const formatted = result.format();
            resultElement.innerHTML = `
                <p>w: ${formatted.w}</p>
                <p>x: ${formatted.x}</p>
                <p>y: ${formatted.y}</p>
                <p>z: ${formatted.z}</p>
            `;
        } else {
            // 错误信息
            resultElement.innerHTML = `<p style="color: red;">${result}</p>`;
        }
    }

    // 显示旋转矩阵结果
    function displayRotationMatrixResult(matrix) {
        const resultElement = document.getElementById('quaternion-result');
        let html = '<p>旋转矩阵:</p>';
        matrix.forEach(row => {
            html += `<p>[${row[0].toFixed(6)}, ${row[1].toFixed(6)}, ${row[2].toFixed(6)}]</p>`;
        });
        resultElement.innerHTML = html;
    }

    // 显示欧拉角结果
    function displayEulerAnglesResult(euler) {
        const resultElement = document.getElementById('quaternion-result');
        resultElement.innerHTML = `
            <p>滚转 (roll): ${euler.roll.toFixed(6)}°</p>
            <p>俯仰 (pitch): ${euler.pitch.toFixed(6)}°</p>
            <p>偏航 (yaw): ${euler.yaw.toFixed(6)}°</p>
        `;
    }

    // 复制结果到剪贴板
    function copyResultToClipboard() {
        const resultElement = document.getElementById('quaternion-result');
        const textToCopy = resultElement.innerText;

        navigator.clipboard.writeText(textToCopy).then(() => {
            // 显示复制成功提示
            const copyButton = document.getElementById('copy-result');
            const originalText = copyButton.textContent;
            copyButton.textContent = '已复制!';
            setTimeout(() => {
                copyButton.textContent = originalText;
            }, 2000);
        }).catch(err => {
            console.error('无法复制: ', err);
            displayResult('复制失败，请手动复制');
        });
    }

    // 清空结果
    function clearResult() {
        const resultElement = document.getElementById('quaternion-result');
        resultElement.innerHTML = `
            <p>w: 0</p>
            <p>x: 0</p>
            <p>y: 0</p>
            <p>z: 0</p>
        `;
    }

    // 从欧拉角生成四元数并显示
    function generateQuaternionFromEuler() {
        // 获取用户输入的欧拉角
        const roll = parseFloat(prompt('请输入滚转角 (°):', '0')) || 0;
        const pitch = parseFloat(prompt('请输入俯仰角 (°):', '0')) || 0;
        const yaw = parseFloat(prompt('请输入偏航角 (°):', '0')) || 0;

        // 生成四元数
        const q = Quaternion.fromEulerAngles(roll, pitch, yaw);

        // 显示结果
        displayResult(q);

        // 更新输入框
        document.getElementById('q1-w').value = q.w.toFixed(6);
        document.getElementById('q1-x').value = q.x.toFixed(6);
        document.getElementById('q1-y').value = q.y.toFixed(6);
        document.getElementById('q1-z').value = q.z.toFixed(6);
    }

    // 添加事件监听器
    document.getElementById('add-quaternions').addEventListener('click', function() {
        try {
            const q1 = getQuaternionInput('q1');
            const q2 = getQuaternionInput('q2');
            const result = q1.add(q2);
            displayResult(result);
        } catch (error) {
            displayResult(error.message);
        }
    });

    document.getElementById('subtract-quaternions').addEventListener('click', function() {
        try {
            const q1 = getQuaternionInput('q1');
            const q2 = getQuaternionInput('q2');
            const result = q1.subtract(q2);
            displayResult(result);
        } catch (error) {
            displayResult(error.message);
        }
    });

    document.getElementById('multiply-quaternions').addEventListener('click', function() {
        try {
            const q1 = getQuaternionInput('q1');
            const q2 = getQuaternionInput('q2');
            const result = q1.multiply(q2);
            displayResult(result);
        } catch (error) {
            displayResult(error.message);
        }
    });

    document.getElementById('divide-quaternions').addEventListener('click', function() {
        try {
            const q1 = getQuaternionInput('q1');
            const q2 = getQuaternionInput('q2');
            const result = q1.divide(q2);
            displayResult(result);
        } catch (error) {
            displayResult(error.message);
        }
    });

    document.getElementById('conjugate-q1').addEventListener('click', function() {
        try {
            const q1 = getQuaternionInput('q1');
            const result = q1.conjugate();
            displayResult(result);
        } catch (error) {
            displayResult(error.message);
        }
    });

    document.getElementById('conjugate-q2').addEventListener('click', function() {
        try {
            const q2 = getQuaternionInput('q2');
            const result = q2.conjugate();
            displayResult(result);
        } catch (error) {
            displayResult(error.message);
        }
    });

    document.getElementById('magnitude-q1').addEventListener('click', function() {
        try {
            const q1 = getQuaternionInput('q1');
            const result = q1.magnitude();
            displayResult(result);
        } catch (error) {
            displayResult(error.message);
        }
    });

    document.getElementById('magnitude-q2').addEventListener('click', function() {
        try {
            const q2 = getQuaternionInput('q2');
            const result = q2.magnitude();
            displayResult(result);
        } catch (error) {
            displayResult(error.message);
        }
    });

    document.getElementById('inverse-q1').addEventListener('click', function() {
        try {
            const q1 = getQuaternionInput('q1');
            const result = q1.inverse();
            displayResult(result);
        } catch (error) {
            displayResult(error.message);
        }
    });

    document.getElementById('inverse-q2').addEventListener('click', function() {
        try {
            const q2 = getQuaternionInput('q2');
            const result = q2.inverse();
            displayResult(result);
        } catch (error) {
            displayResult(error.message);
        }
    });

    document.getElementById('normalize-q1').addEventListener('click', function() {
        try {
            const q1 = getQuaternionInput('q1');
            const result = q1.normalize();
            displayResult(result);
        } catch (error) {
            displayResult(error.message);
        }
    });

    document.getElementById('normalize-q2').addEventListener('click', function() {
        try {
            const q2 = getQuaternionInput('q2');
            const result = q2.normalize();
            displayResult(result);
        } catch (error) {
            displayResult(error.message);
        }
    });

    // 转换为旋转矩阵
    document.getElementById('to-rotation-matrix').addEventListener('click', function() {
        try {
            const q1 = getQuaternionInput('q1');
            const normalizedQ = q1.normalize();
            const matrix = normalizedQ.toRotationMatrix();
            displayRotationMatrixResult(matrix);
        } catch (error) {
            displayResult(error.message);
        }
    });

    // 转换为欧拉角
    document.getElementById('to-euler-angles').addEventListener('click', function() {
        try {
            const q1 = getQuaternionInput('q1');
            const normalizedQ = q1.normalize();
            const euler = normalizedQ.toEulerAngles();
            displayEulerAnglesResult(euler);
        } catch (error) {
            displayResult(error.message);
        }
    });

    // 从欧拉角生成四元数
    document.getElementById('from-euler-angles').addEventListener('click', generateQuaternionFromEuler);

    // 复制结果
    document.getElementById('copy-result').addEventListener('click', copyResultToClipboard);

    // 清空结果
    document.getElementById('clear-result').addEventListener('click', clearResult);
});