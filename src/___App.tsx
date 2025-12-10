import './App.css'

function App() {
	function formatTimeHM(totalMinutes: any) {
		const total = Math.round(totalMinutes); // округляем до целых минут
		const hours = Math.floor(total / 60);
		const minutes = total % 60;

		let hText = hours + ' часов';
		if (hours % 10 === 1 && hours % 100 !== 11) hText = hours + ' час';
		else if ([2, 3, 4].includes(hours % 10) && !(hours % 100 >= 12 && hours % 100 <= 14)) hText = hours + ' часа';

		let mText = minutes + ' минут';
		if (minutes % 10 === 1 && minutes % 100 !== 11) mText = minutes + ' минута';
		else if ([2, 3, 4].includes(minutes % 10) && !(minutes % 100 >= 12 && minutes % 100 <= 14)) mText = minutes + ' минуты';

		return hText + ', ' + mText;
	}

	function calculate() {
		const respect = parseFloat(document.getElementById('respect').value) || 0;
		const mining = parseFloat(document.getElementById('mining').value) || 0;

		// Формулы:
		// Вместимость = 21000 + 2100 * добыча
		// Скорость = 43.75 + 0.4375 * уважение
		const capacity = Math.round(21000 + 2100 * mining);
		const speed = 43.75 + 0.4375 * respect;
		const timeMinutes = capacity / speed;
		const timeRounded = Math.round(timeMinutes); // целые минуты

		document.getElementById('capacity').textContent = capacity.toLocaleString('ru-RU') + ' сиг';
		document.getElementById('speed').textContent = speed.toFixed(2) + ' сиг/мин';
		document.getElementById('time-minutes').textContent = timeRounded + ' мин';
		document.getElementById('time-hm').textContent = formatTimeHM(timeMinutes);

		document.getElementById('result').style.display = 'block';
		document.getElementById('result').scrollIntoView({ behavior: 'smooth' });
	}

	// Авторасчёт при изменении полей
	document.getElementById('respect').addEventListener('input', calculate);
	document.getElementById('mining').addEventListener('input', calculate);

	// Первичный расчёт
	calculate();


	return (
		<>
			<h1>Калькулятор добычи сигарет</h1>

			<div className="input-group">
				<label>Уважение:</label>
				<input type="number" id="respect" step="0.01" placeholder="0" value="400" />
			</div>

			<div className="input-group">
				<label>Добыча:</label>
				<input type="number" id="mining" step="0.01" placeholder="0" value="28" />
			</div>

			{/* <button onClick={calculate()}>Рассчитать время</button> */}

			<div id="result" className="result">
				<h3>Результаты:</h3>
				<div className="stat">
					<span>Макс. вместимость:</span>
					<span id="capacity">-</span>
				</div>
				<div className="stat">
					<span>Скорость (сиг/мин):</span>
					<span id="speed">-</span>
				</div>
				<div className="stat">
					<span>Время заполнения до фула (минут):</span>
					<span id="time-minutes">-</span>
				</div>
				<div className="stat">
					<span>Время заполнения до лимита (часы, минуты):</span>
					<span id="time-hm">-</span>
				</div>
			</div>
		</>
	)
}

export default App
