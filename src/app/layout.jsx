// Import styling
import "./globals.css";
import { Pacifico, Abril_Fatface, Urbanist } from 'next/font/google';

// Import components
import Providers from "@/components/providers.jsx";

// Set fonts
const pacifico = Pacifico({
  variable: '--font-pacifico',
  subsets: ['latin'],
  weight: ['400']
});

const abril_fatface = Abril_Fatface({
  variable: '--font-abril-fat',
  subsets: ['latin'],
  weight: ['400']
});

const urbanist = Urbanist({
  variable: '--font-urbanist',
  subsets:['latin'] 
})

// Set metadata
export const metadata = {
  title: {
    default: "Task Manager",
    template: "%s | Task Manager"
  },
  description: "Plan and organize task in your company.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${pacifico.variable} ${abril_fatface.variable} ${urbanist.variable} font-urbanist`}
      >
        <Providers>
          <div className="wrapper">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
};
