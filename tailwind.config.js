/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Đảm bảo Tailwind nhận diện các file trong thư mục src
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          500: '#D4AF37',
        }
      }
    },
  },
  plugins: [],
}
