import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				'surface-0': 'hsl(var(--surface-0))',
				'surface-1': 'hsl(var(--surface-1))',
				'surface-2': 'hsl(var(--surface-2))',
				'surface-3': 'hsl(var(--surface-3))',
				// Proposal-specific colors
				'proposal-bg': 'hsl(var(--proposal-bg))',
				'proposal-card': 'hsl(var(--proposal-card))',
				'proposal-section': 'hsl(var(--proposal-section))',
				// Typography colors
				'text-heading': 'hsl(var(--text-heading))',
				'text-body': 'hsl(var(--text-body))',
				'text-muted': 'hsl(var(--text-muted))',
				'text-subtle': 'hsl(var(--text-subtle))',
				// Alter-specific colors
				'alter-primary': '#5046E5',
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			backgroundImage: {
				'gradient-primary': 'var(--gradient-primary)',
				'gradient-hero': 'var(--gradient-hero)',
				'gradient-text': 'var(--gradient-text)',
			},
			boxShadow: {
				'elegant': 'var(--shadow-elegant)',
				'card': 'var(--shadow-card)',
				'hover': 'var(--shadow-hover)',
			},
			transitionTimingFunction: {
				'smooth': 'var(--transition-smooth)',
				'fast': 'var(--transition-fast)',
			},
			backdropBlur: {
				'glass': '20px',
				'glass-light': '10px',
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'glow-pulse': {
					'0%, 100%': { boxShadow: 'var(--shadow-glow-soft)' },
					'50%': { boxShadow: 'var(--shadow-glow)' }
				},
				'grid-move': {
					'0%': { backgroundPosition: '0 0' },
					'100%': { backgroundPosition: '30px 30px' }
				},
				'shimmer': {
					'0%': { transform: 'translateX(-100%)' },
					'50%': { transform: 'translateX(100%)' },
					'100%': { transform: 'translateX(100%)' }
				},
				'float-1': {
					'0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
					'33%': { transform: 'translate(30px, -30px) rotate(120deg)' },
					'66%': { transform: 'translate(-20px, 20px) rotate(240deg)' }
				},
				'float-2': {
					'0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
					'33%': { transform: 'translate(-40px, -20px) rotate(-120deg)' },
					'66%': { transform: 'translate(25px, 35px) rotate(-240deg)' }
				},
				'float-3': {
					'0%, 100%': { transform: 'translate(0, 0) scale(1)' },
					'50%': { transform: 'translate(-15px, -25px) scale(1.2)' }
				},
				'float-4': {
					'0%, 100%': { transform: 'translate(0, 0) scale(1) rotate(0deg)' },
					'25%': { transform: 'translate(20px, -15px) scale(0.8) rotate(90deg)' },
					'75%': { transform: 'translate(-25px, 10px) scale(1.1) rotate(270deg)' }
				},
				'ai-glow': {
					'0%, 100%': { 
						boxShadow: '0 0 20px hsl(var(--primary) / 0.15), 0 0 40px hsl(var(--primary) / 0.08)',
						borderColor: 'hsl(var(--primary) / 0.3)'
					},
					'50%': { 
						boxShadow: '0 0 30px hsl(var(--primary) / 0.25), 0 0 60px hsl(var(--primary) / 0.12)',
						borderColor: 'hsl(var(--primary) / 0.5)'
					}
				},
				'neural-pulse': {
					'0%, 100%': { 
						opacity: '0.4',
						transform: 'scale(1)'
					},
					'50%': { 
						opacity: '0.8',
						transform: 'scale(1.05)'
					}
				},
				'intelligent-float': {
					'0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
					'25%': { transform: 'translate(15px, -10px) rotate(90deg)' },
					'50%': { transform: 'translate(10px, -20px) rotate(180deg)' },
					'75%': { transform: 'translate(-10px, -15px) rotate(270deg)' }
				},
				'border-luminance': {
					'0%': { 
						borderColor: 'hsl(var(--primary) / 0.3)',
						boxShadow: '0 0 0 1px hsl(var(--primary) / 0.2)'
					},
					'33%': { 
						borderColor: 'hsl(var(--accent) / 0.4)',
						boxShadow: '0 0 0 1px hsl(var(--accent) / 0.3)'
					},
					'66%': { 
						borderColor: 'hsl(248 75% 65% / 0.4)',
						boxShadow: '0 0 0 1px hsl(248 75% 65% / 0.3)'
					},
					'100%': { 
						borderColor: 'hsl(var(--primary) / 0.3)',
						boxShadow: '0 0 0 1px hsl(var(--primary) / 0.2)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'float': 'float 6s ease-in-out infinite',
				'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
				'grid-move': 'grid-move 20s linear infinite',
				'shimmer': 'shimmer 8s ease-in-out infinite',
				'float-1': 'float-1 20s ease-in-out infinite',
				'float-2': 'float-2 25s ease-in-out infinite reverse',
				'float-3': 'float-3 30s ease-in-out infinite',
				'float-4': 'float-4 22s ease-in-out infinite reverse',
				'ai-glow': 'ai-glow 8s ease-in-out infinite',
				'neural-pulse': 'neural-pulse 4s ease-in-out infinite',
				'intelligent-float': 'intelligent-float 35s ease-in-out infinite',
				'border-luminance': 'border-luminance 12s ease-in-out infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
