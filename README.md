# Nepali Date GNOME Extension

[![GNOME Shell](https://img.shields.io/badge/GNOME-45%20--%2048-blue?logo=gnome)](https://www.gnome.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A production-ready GNOME Shell extension that displays the **Nepali (Bikram Sambat)** date directly in your top panel.

![Screenshot](https://i.ibb.co/YF3LGpm5/image.png)
![Screenshot](https://i.ibb.co/6Rn2vg9W/image.png)

## ✨ Features

- **Real-time BS Date**: Accurate Bikram Sambat date displayed in the top bar.
- **AD Date Tooltip**: Hover over the date to see the corresponding Gregorian (AD) date.
- **Customizable Formats**: Choose between Full, Short, or Numeric date styles.
- **Numeral Support**: Toggle between Nepali (०१२३...) and English (0123...) numerals.
- **Modern GNOME Support**: Fully compatible with GNOME 45, 46, 47, and 48.
- **Native Preferences**: Easy-to-use settings window using libadwaita.

## 🚀 Installation

### 1. Manual Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/meprazhant/gnome-shell-extension-nepali-date.git
   cd gnome-shell-extension-nepali-date
   ```

2. **Install the extension:**

   ```bash
   mkdir -p ~/.local/share/gnome-shell/extensions/
   cp -r . ~/.local/share/gnome-shell/extensions/nepali-date@prashant
   ```

3. **Compile the GSettings schema:**

   ```bash
   glib-compile-schemas ~/.local/share/gnome-shell/extensions/nepali-date@prashant/schemas/
   ```

4. **Restart GNOME Shell:**
   - On **X11**: Press `Alt+F2`, type `r`, and hit `Enter`.
   - On **Wayland**: Log out and log back in.

5. **Enable the extension:**
   Use the **Extensions** app or run:
   ```bash
   gnome-extensions enable nepali-date@prashant
   ```

## ⚙️ Configuration

You can customize the display by opening the Extension Preferences:

1. Open the **Extensions** or **Extension Manager** app.
2. Find **Nepali Date** and click the settings icon.
3. Adjust the **Date Format** and **Numeral System** as desired.

## 🛠️ Development

This extension is built using GJS and modern GNOME Shell APIs.

- `extension.js`: Core logic for UI integration.
- `prefs.js`: Settings window implementation.
- `lib/`: Date conversion and formatting utilities.
- `schemas/`: GSettings definitions.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.
