import { useState, useEffect, useCallback } from 'react';
import './App.css';

type NpcType = {
	name: string;
	sigPerHour: number;
	maxCount: number;
};

type CalculatorResult = {
	capacity: string;
	speed: string;
	timeMinutes: string;
	capacityDay: string;
	npcBonusSigPerHour: string;
	npcBonusSigPerMin: string;
	totalSigPerHour: string;
};

const NPC_LIST: NpcType[] = [
	{ name: 'Барыга', sigPerHour: 25, maxCount: 7 },
	{ name: 'Пекарь', sigPerHour: 40, maxCount: 6 },
	{ name: 'Ткач', sigPerHour: 110, maxCount: 5 },
	{ name: 'Охранник', sigPerHour: 70, maxCount: 8 },
	{ name: 'Слесарь', sigPerHour: 220, maxCount: 5 },
	{ name: 'Завхоз', sigPerHour: 140, maxCount: 7 },
];

function App() {
	const [respect, setRespect] = useState<string>('0');
	const [mining, setMining] = useState<string>('0');
	const [npcCounts, setNpcCounts] = useState<Record<string, number>>({});
	const [result, setResult] = useState<CalculatorResult | null>(null);

	const parseNumber = (value: string): number => {
		return parseFloat(value) || 0;
	};

	const calculate = useCallback(() => {
		const respectNum = parseNumber(respect);
		const miningNum = parseNumber(mining);

		// Базовая скорость от уважения (сиг/мин)
		const baseSpeed = 43.75 + 0.4375 * respectNum;

		// Вместимость
		const capacity = Math.round(21000 + 2100 * miningNum);

		// Добыча от NPC (сиг/час → сиг/мин)
		let npcSigPerHour = 0;
		NPC_LIST.forEach(npc => {
			const count = npcCounts[npc.name] || 0;
			npcSigPerHour += count * npc.sigPerHour;
		});
		const npcSigPerMin = npcSigPerHour / 60;

		// Общая скорость
		const totalSpeed = baseSpeed + npcSigPerMin;
		const timeMinutes = capacity / totalSpeed;
		const dailyUnlimited = totalSpeed * 1440;

		setResult({
			capacity: capacity.toLocaleString('ru-RU'),
			speed: totalSpeed.toFixed(2),
			timeMinutes: formatTimeHM(timeMinutes),
			capacityDay: Math.round(dailyUnlimited).toLocaleString('ru-RU'),
			npcBonusSigPerHour: Math.round(npcSigPerHour).toLocaleString('ru-RU'),
			npcBonusSigPerMin: npcSigPerMin.toFixed(2),
			totalSigPerHour: Math.round(totalSpeed * 60).toLocaleString('ru-RU'),
		});
	}, [respect, mining, npcCounts]);

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

	const updateNpcCount = (npcName: string, count: number) => {
		setNpcCounts(prev => ({ ...prev, [npcName]: Math.max(0, Math.min(count, NPC_LIST.find(n => n.name === npcName)?.maxCount || 0)) }));
	};

	useEffect(() => {
		calculate();
	}, [calculate]);

	return (
		<div className="app">
			<div className="calculator">
				<h1>🗿 Калькулятор добычи сигарет</h1>

				{/* Основные параметры */}
				<div className="input-section">
					<div className="input-group">
						<label htmlFor="respect">Уважение:</label>
						<input
							id="respect"
							type="number"
							step="0.01"
							value={respect}
							onChange={(e) => setRespect(e.target.value)}
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
							onChange={(e) => setMining(e.target.value)}
							placeholder="0"
							className="input-group--text"
						/>
					</div>
				</div>

				{/* NPC */}
				<div className="input-section">
					<h3>👥 Шестёрки</h3>
					<div className="npc-grid">
						{NPC_LIST.map(npc => (
							<div key={npc.name} className="npc-item">
								<div className="npc-info">
									<span className="npc-name">{npc.name}</span>
									<span className="npc-max">макс. {npc.maxCount}</span>
								</div>
								<select
									value={npcCounts[npc.name] || 0}
									onChange={(e) => updateNpcCount(npc.name, parseInt(e.target.value))}
									className="npc-select"
								>
									{Array.from({ length: npc.maxCount + 1 }, (_, i) => (
										<option key={i} value={i}>
											{i}
										</option>
									))}
								</select>
							</div>
						))}
					</div>
				</div>

				{result && (
					<div className="result">
						<h3>📊 Результаты:</h3>
						<div className="stat">
							<span>Максимальная вместимость:</span>
							<span>{result.capacity} сиг</span>
						</div>
						<div className="stat">
							<span>Базовая скорость (уважение):</span>
							<span>{(43.75 + 0.4375 * parseNumber(respect)).toFixed(2)} сиг/мин</span>
						</div>
						{/* ✅ УБРАНЫ: Бонус от NPC, ОБЩАЯ скорость */}
						<div className="stat">
							<span>Время заполнения до лимита:</span>
							<span>{result.timeMinutes}</span>
						</div>
						<div className="stat highlight">
							<span>Максимум за день (без лимита):</span>
							<span>{result.capacityDay} сиг</span>
						</div>
					</div>
				)}

				{/* Блок поддержки - без изменений */}
				<div className="support-section">
					<h4>☕ Поддержать автора</h4>
					<div className="donate-info">
						<div className="donate-card">
							<span className="donate-label">На доширак:</span>
							<span className="donate-number">2204 3204 8304 7330</span>
							<span className="donate-bank">Озон Банк</span>
						</div>
					</div>
					<div className="contact-info">
						<h5>💡 Предложения и доработки:</h5>
						<a href="mailto:aikrendukov@yandex.ru" className="contact-link">
							aikrendukov@yandex.ru
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;
