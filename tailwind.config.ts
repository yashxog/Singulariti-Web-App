import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
		backgroundPosition: {
			'gradient-30-from-top': '0 30px', // Set background position to 30px from top
		},
		backgroundImage: {
			'custom-bg-1': 'linear-gradient(30deg, rgba(0,0,0,1) 0%, rgba(62,6,95,0.4) 40%, rgba(0,0,0,0.85) 85%, rgba(0,0,0,1) 100%)',
			'custom-bg-2': 'linear-gradient(20deg, rgba(0,0,0,1) 0%, rgba(62,6,95,0.66) 50%, rgba(0,0,0,1) 100%)',
			'customBg': 'linear-gradient(30deg,rgba(0,0,0,1)0%,rgba(62,6,95,0.4)40%,rgba(0,0,0,0.85)85%,rgba(0,0,0,1)100%)',
			'custom-white-greay-grad': 'linear-gradient(to bottom,rgba(255,255,255,1)0%,rgba(104,104,104,1)100%)',
			'custom-purple-grad-border': 'linear-gradient(to right,rgba(112,11,151,1)0%,rgba(136,10,223,1)100%);',
			'card-hover-1': 'linear-gradient(180deg,rgba(197,190,172)0%,rgba(250,121,23,0.7)100%);',
			'card-hover-2': 'linear-gradient(180deg,rgba(197,190,172,0.5)0%,rgba(250,121,23,0.7)100%);'
			
		},
  		colors: {
			'paper': "#E2DFD0",
			'paper-2': "#C5BEAC",
			'brand-orange': "#FF6F00",
			'blur-orange': "#F59312",
			'charcoal': "#262424",
			'subtext': "#524C42",
			'mudbrown': "#312C15",
			'icon-bg': 'rgba(31,41,55,0.7)',
			borderColour1: '#880ADF',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};
export default config;
