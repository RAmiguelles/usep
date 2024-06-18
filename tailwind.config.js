import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors:{
                primary: {
                    light: '#DC7171',
                    dark:'#973939',
                    main: "#D75D5F",
                    gradient: "linear-gradient(275.52deg, #973939 0.28%, #DC7171 100%)"
                    // pastel:
                  },
            }
        },
    },

    plugins: [forms],
};
