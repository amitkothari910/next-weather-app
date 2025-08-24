import "./globals.css";

export const metadata = {
  title: "Weather App",
  description: "Weather forecast app built with Next.js and Tailwind CSS",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
