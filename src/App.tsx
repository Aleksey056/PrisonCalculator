import { useState, useEffect, useCallback } from 'react';
import './App.css';

type CalculatorResult = {
	capacity: number;
	speed: number;
	timeMinutes: number;
	timeRounded: number;
}

function App() {
	const [respect, setRespect] = useState<number>(400);
	const [mining, setMining] = useState<number>(28);
	const [result, setResult] = useState<CalculatorResult | null>(null);

	const calculate = useCallback(() => {
		const capacity = Math.round(21000 + 2100 * mining);
		const speed = 43.75 + 0.4375 * respect;
		const timeMinutes = capacity / speed;
		const timeRounded = Math.round(timeMinutes);

		setResult({
			capacity,
			speed,
			timeMinutes,
			timeRounded
		});
	}, [respect, mining]);

	const formatTimeHM = (totalMinutes: number): string => {
		const total = Math.round(totalMinutes);
		const hours = Math.floor(total / 60);
		const minutes = total % 60;

		const hText = getRussianPlural(hours, ['час', 'часа', 'часов']);
		const mText = getRussianPlural(minutes, ['минута', 'минуты', 'минут']);

		return `${hours} ${hText}, ${minutes} ${mText}`;
	};

	const getRussianPlural = (num: number, forms: string[]): string => {
		const n = Math.abs(num) % 100;
		const n1 = n % 10;

		if (n > 10 && n < 20) return forms[2];
		if (n1 > 1 && n1 < 5) return forms[1];
		if (n1 === 1) return forms[0];

		return forms[2];
	};

	useEffect(() => {
		calculate();
	}, [calculate]);

	return (
		<div className="app">
			<div className="calculator">
				<h1>🗿 Калькулятор добычи сигарет</h1>

				<div className="input-group">
					<label htmlFor="respect">Уважение:</label>
					<input
						id="respect"
						type="number"
						step="0.01"
						value={respect}
						onChange={(e) => setRespect(Number(e.target.value) || 0)}
						placeholder="0"
						className="input-group--text"
					/>
				</div>

				<div className="input-group">
					<label htmlFor="mining">Добыча:</label>
					<input
						id="mining"
						type="number"
						step="0.01"
						value={mining}
						onChange={(e) => setMining(Number(e.target.value) || 0)}
						placeholder="0"
						className="input-group--text"
					/>
				</div>

				{/* <button onClick={calculate} className="calculate-btn">
					🚬 Рассчитать время
				</button> */}

				{result && (
					<div className="result">
						<h3>Результаты:</h3>
						<div className="stat">
							<span>Макс. вместимость:</span>
							<span>{result.capacity.toLocaleString('ru-RU')} сиг</span>
						</div>
						<div className="stat">
							<span>Скорость (сиг/мин):</span>
							<span>{result.speed.toFixed(2)} сиг/мин</span>
						</div>
						<div className="stat">
							<span>Время (минуты):</span>
							<span>{result.timeRounded} мин</span>
						</div>
						<div className="stat">
							<span>Время (часы, минуты):</span>
							<span>{formatTimeHM(result.timeMinutes)}</span>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

export default App;
