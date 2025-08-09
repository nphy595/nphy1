document.addEventListener('DOMContentLoaded', function() {
    // 单位定义和转换系数
    const unitDefinitions = {
        length: {
            meter: { name: '米', symbol: 'm', factor: 1 },
            kilometer: { name: '千米', symbol: 'km', factor: 1000 },
            centimeter: { name: '厘米', symbol: 'cm', factor: 0.01 },
            millimeter: { name: '毫米', symbol: 'mm', factor: 0.001 },
            micrometer: { name: '微米', symbol: 'μm', factor: 1e-6 },
            nanometer: { name: '纳米', symbol: 'nm', factor: 1e-9 },
            inch: { name: '英寸', symbol: 'in', factor: 0.0254 },
            foot: { name: '英尺', symbol: 'ft', factor: 0.3048 },
            yard: { name: '码', symbol: 'yd', factor: 0.9144 },
            mile: { name: '英里', symbol: 'mi', factor: 1609.344 }
        },
        weight: {
            kilogram: { name: '千克', symbol: 'kg', factor: 1 },
            gram: { name: '克', symbol: 'g', factor: 0.001 },
            milligram: { name: '毫克', symbol: 'mg', factor: 1e-6 },
            ton: { name: '吨', symbol: 't', factor: 1000 },
            pound: { name: '磅', symbol: 'lb', factor: 0.45359237 },
            ounce: { name: '盎司', symbol: 'oz', factor: 0.028349523 }
        },
        area: {
            squareMeter: { name: '平方米', symbol: 'm²', factor: 1 },
            squareKilometer: { name: '平方千米', symbol: 'km²', factor: 1e6 },
            squareCentimeter: { name: '平方厘米', symbol: 'cm²', factor: 1e-4 },
            squareMillimeter: { name: '平方毫米', symbol: 'mm²', factor: 1e-6 },
            hectare: { name: '公顷', symbol: 'ha', factor: 10000 },
            acre: { name: '英亩', symbol: 'ac', factor: 4046.8564224 },
            squareMile: { name: '平方英里', symbol: 'mi²', factor: 2589988.11 },
            squareFoot: { name: '平方英尺', symbol: 'ft²', factor: 0.09290304 },
            squareInch: { name: '平方英寸', symbol: 'in²', factor: 0.00064516 }
        },
        volume: {
            cubicMeter: { name: '立方米', symbol: 'm³', factor: 1 },
            cubicCentimeter: { name: '立方厘米', symbol: 'cm³', factor: 1e-6 },
            cubicMillimeter: { name: '立方毫米', symbol: 'mm³', factor: 1e-9 },
            liter: { name: '升', symbol: 'L', factor: 0.001 },
            milliliter: { name: '毫升', symbol: 'mL', factor: 1e-6 },
            cubicFoot: { name: '立方英尺', symbol: 'ft³', factor: 0.0283168466 },
            cubicInch: { name: '立方英寸', symbol: 'in³', factor: 1.6387064e-5 },
            gallon: { name: '加仑(美)', symbol: 'gal', factor: 0.0037854118 },
            quart: { name: '夸脱(美)', symbol: 'qt', factor: 0.0009463529 }
        },
        temperature: {
            celsius: { name: '摄氏度', symbol: '°C' },
            fahrenheit: { name: '华氏度', symbol: '°F' },
            kelvin: { name: '开尔文', symbol: 'K' }
        },
        time: {
            second: { name: '秒', symbol: 's', factor: 1 },
            minute: { name: '分钟', symbol: 'min', factor: 60 },
            hour: { name: '小时', symbol: 'h', factor: 3600 },
            day: { name: '天', symbol: 'd', factor: 86400 },
            week: { name: '周', symbol: 'wk', factor: 604800 },
            month: { name: '月', symbol: 'mo', factor: 2592000 },  // 30天
            year: { name: '年', symbol: 'yr', factor: 31536000 },  // 365天
            millisecond: { name: '毫秒', symbol: 'ms', factor: 0.001 }
        },
        speed: {
            mps: { name: '米/秒', symbol: 'm/s', factor: 1 },
            kph: { name: '千米/小时', symbol: 'km/h', factor: 0.277777778 },
            mph: { name: '英里/小时', symbol: 'mph', factor: 0.44704 },
            knot: { name: '节', symbol: 'kn', factor: 0.514444444 }
        },
        pressure: {
            pascal: { name: '帕斯卡', symbol: 'Pa', factor: 1 },
            kilopascal: { name: '千帕', symbol: 'kPa', factor: 1000 },
            megapascal: { name: '兆帕', symbol: 'MPa', factor: 1e6 },
            bar: { name: '巴', symbol: 'bar', factor: 1e5 },
            atmosphere: { name: '标准大气压', symbol: 'atm', factor: 101325 },
            millimeterHg: { name: '毫米汞柱', symbol: 'mmHg', factor: 133.322368 },
            psi: { name: '磅/平方英寸', symbol: 'psi', factor: 6894.75729 }
        },
        energy: {
            joule: { name: '焦耳', symbol: 'J', factor: 1 },
            kilojoule: { name: '千焦', symbol: 'kJ', factor: 1000 },
            megajoule: { name: '兆焦', symbol: 'MJ', factor: 1e6 },
            calorie: { name: '卡路里', symbol: 'cal', factor: 4.184 },
            kilocalorie: { name: '千卡', symbol: 'kcal', factor: 4184 },
            wattHour: { name: '瓦时', symbol: 'Wh', factor: 3600 },
            kilowattHour: { name: '千瓦时', symbol: 'kWh', factor: 3.6e6 },
            electronVolt: { name: '电子伏特', symbol: 'eV', factor: 1.602176634e-19 }
        },
        power: {
            watt: { name: '瓦特', symbol: 'W', factor: 1 },
            kilowatt: { name: '千瓦', symbol: 'kW', factor: 1000 },
            megawatt: { name: '兆瓦', symbol: 'MW', factor: 1e6 },
            horsepower: { name: '马力', symbol: 'hp', factor: 745.699872 }
        }
    };

    // 获取DOM元素
    const categoryBtns = document.querySelectorAll('.category-btn');
    const sourceValueInput = document.getElementById('source-value');
    const targetValueInput = document.getElementById('target-value');
    const sourceUnitSelect = document.getElementById('source-unit');
    const targetUnitSelect = document.getElementById('target-unit');
    const convertBtn = document.getElementById('convert');
    const swapUnitsBtn = document.getElementById('swap-units');
    const conversionHistoryList = document.getElementById('conversion-history');

    // 当前选中的单位类型
    let currentCategory = 'length';

    // 初始化单位选择器
    function initUnitSelectors() {
        updateUnitOptions(sourceUnitSelect, currentCategory);
        updateUnitOptions(targetUnitSelect, currentCategory);
    }

    // 更新单位选项
    function updateUnitOptions(selectElement, category) {
        // 清空现有选项
        selectElement.innerHTML = '';

        // 添加新选项
        const units = unitDefinitions[category];
        for (const unitKey in units) {
            const unit = units[unitKey];
            const option = document.createElement('option');
            option.value = unitKey;
            option.textContent = `${unit.name} (${unit.symbol})`;
            selectElement.appendChild(option);
        }
    }

    // 执行单位转换
    function convertUnits() {
        const sourceValue = parseFloat(sourceValueInput.value);
        if (isNaN(sourceValue)) {
            alert('请输入有效的数值');
            return;
        }

        const sourceUnit = sourceUnitSelect.value;
        const targetUnit = targetUnitSelect.value;

        let result;

        // 特殊处理温度转换
        if (currentCategory === 'temperature') {
            result = convertTemperature(sourceValue, sourceUnit, targetUnit);
        } else {
            // 其他单位的转换
            const sourceFactor = unitDefinitions[currentCategory][sourceUnit].factor;
            const targetFactor = unitDefinitions[currentCategory][targetUnit].factor;
            result = (sourceValue * sourceFactor) / targetFactor;
        }

        // 显示结果，保留适当的小数位数
        targetValueInput.value = result.toFixed(10).replace(/\.?0+$/, '');

        // 记录转换历史
        recordConversionHistory(sourceValue, sourceUnit, result, targetUnit);
    }

    // 温度转换
    function convertTemperature(value, fromUnit, toUnit) {
        // 先转换为摄氏度
        let celsius;
        if (fromUnit === 'celsius') {
            celsius = value;
        } else if (fromUnit === 'fahrenheit') {
            celsius = (value - 32) * 5 / 9;
        } else if (fromUnit === 'kelvin') {
            celsius = value - 273.15;
        }

        // 再从摄氏度转换为目标单位
        if (toUnit === 'celsius') {
            return celsius;
        } else if (toUnit === 'fahrenheit') {
            return celsius * 9 / 5 + 32;
        } else if (toUnit === 'kelvin') {
            return celsius + 273.15;
        }
    }

    // 记录转换历史
    function recordConversionHistory(sourceValue, sourceUnit, targetValue, targetUnit) {
        const sourceUnitInfo = unitDefinitions[currentCategory][sourceUnit];
        const targetUnitInfo = unitDefinitions[currentCategory][targetUnit];

        const historyItem = document.createElement('li');
        historyItem.className = 'history-item';
        historyItem.textContent = `${sourceValue} ${sourceUnitInfo.symbol} = ${targetValue.toFixed(10).replace(/\.?0+$/, '')} ${targetUnitInfo.symbol}`;

        // 添加到历史列表的开头
        conversionHistoryList.insertBefore(historyItem, conversionHistoryList.firstChild);

        // 限制历史记录数量
        if (conversionHistoryList.children.length > 10) {
            conversionHistoryList.removeChild(conversionHistoryList.lastChild);
        }
    }

    // 交换单位
    function swapUnits() {
        const tempUnit = sourceUnitSelect.value;
        sourceUnitSelect.value = targetUnitSelect.value;
        targetUnitSelect.value = tempUnit;

        // 如果已经有值，执行转换
        if (sourceValueInput.value) {
            convertUnits();
        }
    }

    // 事件监听器
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 移除所有按钮的active类
            categoryBtns.forEach(b => b.classList.remove('active'));
            // 为当前点击的按钮添加active类
            this.classList.add('active');
            // 更新当前单位类型
            currentCategory = this.dataset.category;
            // 更新单位选择器
            initUnitSelectors();
            // 清空输入值
            sourceValueInput.value = '1';
            targetValueInput.value = '';
        });
    });

    convertBtn.addEventListener('click', convertUnits);
    swapUnitsBtn.addEventListener('click', swapUnits);

    // 当输入值变化时自动转换
    sourceValueInput.addEventListener('input', convertUnits);
    sourceUnitSelect.addEventListener('change', convertUnits);
    targetUnitSelect.addEventListener('change', convertUnits);

    // 初始化
    initUnitSelectors();
    convertUnits(); // 初始转换

    // 主题切换功能
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        if (document.body.classList.contains('dark-theme')) {
            themeToggle.textContent = '☀️';
            localStorage.setItem('theme', 'dark');
        } else {
            themeToggle.textContent = '🌙';
            localStorage.setItem('theme', 'light');
        }
    });

    // 检查本地存储的主题设置
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.textContent = '☀️';
    }
});