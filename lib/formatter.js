import { adToBs } from './nepali-date-converter.js';

const MONTH_NAME_BS = [
    'वैशाख', 'जेठ', 'आषाढ', 'श्रवण', 'भद्र', 'अश्विन',
    'कार्तिक', 'मङ्सिर', 'पौष', 'माघ', 'फाल्गुन', 'चैत्र'
];

const NEPALI_NUMERALS = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];

function toNepaliNumber(n) {
    return n.toString().split('').map(char => {
        if (char >= '0' && char <= '9') {
            return NEPALI_NUMERALS[parseInt(char)];
        }
        return char;
    }).join('');
}

export function formatBSDate(date, format, useNepaliNumerals) {
    // converter expects YYYY-MM-DD
    const isoDate = date.toISOString().split('T')[0];
    let bsDateStr;
    try {
        bsDateStr = adToBs(isoDate);
    } catch (e) {
        return "Invalid Date";
    }

    const [year, month, day] = bsDateStr.split('-').map(Number);
    const monthName = MONTH_NAME_BS[month - 1];

    if (format === 'numeric') {
        const yearStr = useNepaliNumerals ? toNepaliNumber(year) : year.toString();
        const monthStr = useNepaliNumerals ? toNepaliNumber(month.toString().padStart(2, '0')) : month.toString().padStart(2, '0');
        const dayStr = useNepaliNumerals ? toNepaliNumber(day.toString().padStart(2, '0')) : day.toString().padStart(2, '0');
        return `${yearStr}/${monthStr}/${dayStr}`;
    } else if (format === 'short') {
        const yearStr = year.toString();
        return `${day} ${monthName}, ${yearStr}`;
    } else { // 'full'
        const yearStr = useNepaliNumerals ? toNepaliNumber(year) : year.toString();
        const dayStr = useNepaliNumerals ? toNepaliNumber(day) : day.toString();
        return `${dayStr} ${monthName}, ${yearStr}`;
    }
}
