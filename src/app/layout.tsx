import type { Metadata } from "next";
import { Inter } from "next/font/google";
import MuiThemeWrapper from "./MuiThemeWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Robban's GlosTrainer",
  description: "A simple tool for your Swedish notes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MuiThemeWrapper>{children}</MuiThemeWrapper>
      </body>
    </html>
  );
}
