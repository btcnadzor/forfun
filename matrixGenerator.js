const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function generateUniqueRow(prevRows, numbersPerRow, min, max) {
    let row;
    do {
        const numbers = new Set();
        while (numbers.size < numbersPerRow) {
            numbers.add(Math.floor(Math.random() * (max - min + 1)) + min);
        }
        row = Array.from(numbers).sort((a, b) => a - b);
    } while (prevRows.some(prevRow => 
        row.every(num => prevRow.includes(num))
    ));
    return row;
}

function generateMatrix(numbersPerRow = 15, rows = 1, min = 0, max = 100) {
    const matrix = [];
    const prevRows = [];
    
    for (let i = 0; i < rows; i++) {
        const row = generateUniqueRow(prevRows, numbersPerRow, min, max);
        matrix.push(row);
        prevRows.push(row);
    }
    
    return matrix;
}

function printMatrix(matrix) {
    matrix.forEach(row => {
        console.log(row.join(' '));
    });
}

function askQuestion(query) {
    return new Promise(resolve => {
        rl.question(query, resolve);
    });
}

async function main() {
    try {
        const numbersPerRow = parseInt(await askQuestion('Введите количество чисел в строке (по умолчанию 15): ')) || 15;
        const rows = parseInt(await askQuestion('Введите количество строк (по умолчанию 1): ')) || 1;
        const min = parseInt(await askQuestion('Введите минимальное значение: '));
        const max = parseInt(await askQuestion('Введите максимальное значение: '));

        if (isNaN(min) || isNaN(max)) {
            throw new Error('Минимальное и максимальное значения должны быть числами');
        }

        if (min >= max) {
            throw new Error('Минимальное значение должно быть меньше максимального');
        }

        if (max - min + 1 < numbersPerRow) {
            throw new Error('Диапазон чисел слишком мал для генерации уникальных чисел');
        }

        const matrix = generateMatrix(numbersPerRow, rows, min, max);
        console.log('\nСгенерированная матрица:');
        printMatrix(matrix);
    } catch (error) {
        console.error('Ошибка:', error.message);
    } finally {
        rl.close();
    }
}

main(); 