import type { Metadata } from "next";
import MuiThemeWrapper from "./MuiThemeWrapper";

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
      <body>
        <MuiThemeWrapper>{children}</MuiThemeWrapper>
      </body>
    </html>
  );
}
