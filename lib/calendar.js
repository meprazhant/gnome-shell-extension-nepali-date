import St from 'gi://St';
import Clutter from 'gi://Clutter';
import GObject from 'gi://GObject';
import { adToBs, bsToAd } from './nepali-date-converter.js';

const MONTH_NAME_BS = [
    'वैशाख', 'जेठ', 'आष्षाढ', 'श्रवण', 'भद्र', 'अश्विन',
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

export const CalendarView = GObject.registerClass(
class CalendarView extends St.BoxLayout {
    _init(extension) {
        super._init({
            vertical: true,
            style_class: 'nepali-calendar-container',
            style: 'padding: 10px; min-width: 250px;'
        });

        this._extension = extension;
        this._settings = extension.getSettings();

        // Current view date (BS)
        const now = new Date();
        const bsNow = adToBs(now.toISOString().split('T')[0]);
        const [y, m, d] = bsNow.split('-').map(Number);
        
        this._viewYear = y;
        this._viewMonth = m;
        this._today = { y, m, d };

        this._buildUi();
        this._update();
    }

    _buildUi() {
        // Header
        const header = new St.BoxLayout({ style_class: 'calendar-header', style: 'margin-bottom: 10px;' });
        this.add_child(header);

        this._prevBtn = new St.Button({
            label: '<',
            style_class: 'calendar-nav-button',
            can_focus: true,
            x_expand: true
        });
        this._prevBtn.connect('clicked', () => this._prevMonth());
        header.add_child(this._prevBtn);

        this._monthLabel = new St.Label({
            text: '...',
            style_class: 'calendar-month-label',
            x_expand: true,
            y_align: Clutter.ActorAlign.CENTER
        });
        header.add_child(this._monthLabel);

        this._nextBtn = new St.Button({
            label: '>',
            style_class: 'calendar-nav-button',
            can_focus: true,
            x_expand: true
        });
        this._nextBtn.connect('clicked', () => this._nextMonth());
        header.add_child(this._nextBtn);

        // Grid for days
        this._grid = new St.Widget({
            layout_manager: new Clutter.GridLayout(),
            style_class: 'calendar-grid'
        });
        this.add_child(this._grid);

        // Day headers (Sun, Mon, ...)
        const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
        days.forEach((day, i) => {
            const label = new St.Label({
                text: day,
                style_class: 'calendar-day-header',
                style: 'font-weight: bold; width: 30px; text-align: center;'
            });
            this._grid.layout_manager.attach(label, i, 0, 1, 1);
        });
    }

    _prevMonth() {
        this._viewMonth--;
        if (this._viewMonth < 1) {
            this._viewMonth = 12;
            this._viewYear--;
        }
        this._update();
    }

    _nextMonth() {
        this._viewMonth++;
        if (this._viewMonth > 12) {
            this._viewMonth = 1;
            this._viewYear++;
        }
        this._update();
    }

    _update() {
        const useNepaliNumerals = this._settings.get_boolean('use-nepali-numerals');
        
        // Update header
        const yearStr = useNepaliNumerals ? toNepaliNumber(this._viewYear) : this._viewYear.toString();
        this._monthLabel.set_text(`${MONTH_NAME_BS[this._viewMonth - 1]} ${yearStr}`);

        // Clear grid (excluding headers)
        this._grid.get_children().forEach(child => {
            if (child.style_class !== 'calendar-day-header')
                child.destroy();
        });

        // Calculate start day of the month
        // We convert BS (Y-M-01) to AD to get the day of the week
        const bsDateStr = `${this._viewYear}-${this._viewMonth.toString().padStart(2, '0')}-01`;
        const adDateStr = bsToAd(bsDateStr);
        const adDate = new Date(adDateStr);
        const startDay = adDate.getDay(); // 0 (Sun) to 6 (Sat)

        // Get month length
        // This is a bit tricky with the current converter as it doesn't export the table directly
        // But we can binary search or just check if day 32 exists
        let monthLength = 30;
        for (let d = 32; d >= 29; d--) {
            try {
                bsToAd(`${this._viewYear}-${this._viewMonth.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`);
                monthLength = d;
                break;
            } catch (e) {}
        }

        // Fill grid
        let row = 1;
        let col = startDay;

        for (let d = 1; d <= monthLength; d++) {
            const isToday = this._today.y === this._viewYear && this._today.m === this._viewMonth && this._today.d === d;
            
            const btn = new St.Button({
                label: useNepaliNumerals ? toNepaliNumber(d) : d.toString(),
                style_class: isToday ? 'calendar-day-today' : 'calendar-day',
                style: `width: 30px; height: 30px; text-align: center; ${isToday ? 'background-color: #3584e4; color: white; border-radius: 15px;' : ''}`
            });

            this._grid.layout_manager.attach(btn, col, row, 1, 1);

            col++;
            if (col > 6) {
                col = 0;
                row++;
            }
        }
    }
});
