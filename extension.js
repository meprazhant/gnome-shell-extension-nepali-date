import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import St from 'gi://St';
import Clutter from 'gi://Clutter';
import GLib from 'gi://GLib';
import Gio from 'gi://Gio';
import { formatBSDate } from './lib/formatter.js';


export default class NepaliDateExtension extends Extension {
    enable() {
        this._settings = this.getSettings();
        this._label = new St.Label({
            text: '...',
            y_align: Clutter.ActorAlign.CENTER,
            style_class: 'panel-button'
        });

        // Insert into the right box, next to the clock
        Main.panel._rightBox.insert_child_at_index(this._label, 0);

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
        this._label.connect('enter-event', () => {
            const now = new Date();
            this._label.set_tooltip_text(`AD: ${now.toDateString()}`);
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

        if (this._label) {
            Main.panel._rightBox.remove_child(this._label);
            this._label.destroy();
            this._label = null;
        }

        this._settings = null;
    }

    _updateDate() {
        const now = new Date();
        const formatType = this._getDateFormat();
        const useNepaliNumerals = this._settings.get_boolean('use-nepali-numerals');
        const dateStr = formatBSDate(now, formatType, useNepaliNumerals);

        this._label.set_text(dateStr);
    }

    _getDateFormat() {
        // Enums are returned as integers from GSettings if defined with nicknames in schema
        const val = this._settings.get_string('date-format');
        return val;
    }
}
