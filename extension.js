import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import St from 'gi://St';
import Clutter from 'gi://Clutter';
import GLib from 'gi://GLib';
import Gio from 'gi://Gio';
import { formatBSDate } from './lib/formatter.js';
import { CalendarView } from './lib/calendar.js';

export default class NepaliDateExtension extends Extension {
    enable() {
        this._settings = this.getSettings();
        
        // Create the PanelMenu Button
        this._indicator = new PanelMenu.Button(0.5, this.metadata.name, false);

        // Add the label to the indicator
        this._label = new St.Label({
            text: '...',
            y_align: Clutter.ActorAlign.CENTER,
            style_class: 'panel-button'
        });
        this._indicator.add_child(this._label);

        // Create and add the CalendarView to the menu
        this._calendarView = new CalendarView(this);
        this._indicator.menu.box.add_child(this._calendarView);

        // Insert into the panel
        Main.panel.addToStatusArea(this.uuid, this._indicator, 0, 'right');

        // Update the date
        this._updateDate();

        // Set up a periodic update (every minute)
        this._timeoutId = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, 60, () => {
            this._updateDate();
            return GLib.SOURCE_CONTINUE;
        });

        // Listen for settings changes
        this._settingsChangedId = this._settings.connect('changed', () => {
            this._updateDate();
        });

        // Add tooltip showing AD date
        this._indicator.connect('enter-event', () => {
            const now = new Date();
            this._indicator.set_tooltip_text(`AD: ${now.toDateString()}`);
        });
    }

    disable() {
        if (this._timeoutId) {
            GLib.Source.remove(this._timeoutId);
            this._timeoutId = null;
        }

        if (this._settingsChangedId) {
            this._settings.disconnect(this._settingsChangedId);
            this._settingsChangedId = null;
        }

        if (this._indicator) {
            this._indicator.destroy();
            this._indicator = null;
            this._label = null;
            this._calendarView = null;
        }

        this._settings = null;
    }

    _updateDate() {
        const now = new Date();
        const formatType = this._getDateFormat();
        const useNepaliNumerals = this._settings.get_boolean('use-nepali-numerals');
        const dateStr = formatBSDate(now, formatType, useNepaliNumerals);

        if (this._label) {
            this._label.set_text(dateStr);
        }
    }

    _getDateFormat() {
        return this._settings.get_string('date-format');
    }
}
