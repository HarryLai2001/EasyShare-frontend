/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/renderer/index.html', './src/renderer/**/*.{js,jsx}'],
    theme: {
        extend: {
            fontFamily: {
                light: ['"PingFang-Light"', '"SF-Pro"', 'serif'],
                regular: ['"PingFang-Regular"', '"SF-Pro"', 'serif'],
                title: ['"PingFangSC-Semibold"'],
                logo: ['"DeyiHei"']
            }
        }
    },
    plugins: []
}