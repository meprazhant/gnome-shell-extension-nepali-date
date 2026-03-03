import { ExtensionPreferences } from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';
import Adw from 'gi://Adw';
import Gio from 'gi://Gio';

export default class NepaliDatePreferences extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        const settings = this.getSettings();

        const page = new Adw.PreferencesPage();
        const group = new Adw.PreferencesGroup({
            title: 'Display Settings',
            description: 'Configure how the Nepali date appears in the top panel.'
        });
        page.add(group);
        window.add(page);

        // Toggle Nepali Numerals
        const numeralsRow = new Adw.SwitchRow({
            title: 'Use Nepali Numerals',
            subtitle: 'Display numbers as ०१२३४५६७८९'
        });
        group.add(numeralsRow);

        settings.bind(
            'use-nepali-numerals',
            numeralsRow,
            'active',
            Gio.SettingsBindFlags.DEFAULT
        );

        // Date Format Dropdown
        const formatRow = new Adw.ComboRow({
            title: 'Date Format',
            subtitle: 'Choose between full, short, or numeric formats',
            model: new Adw.EnumListModel({
                enum_type: 'org.gnome.shell.extensions.nepalidate.DateFormat'
            })
        });
        group.add(formatRow);

        settings.bind(
            'date-format',
            formatRow,
            'selected',
            Gio.SettingsBindFlags.DEFAULT
        );
    }
}
