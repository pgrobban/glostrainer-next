import type { Metadata } from "next";
import MuiThemeWrapper from "@/app/MuiThemeWrapper";
import { ElementType } from "react";

export const metadata: Metadata = {
  title: "Robban's GlosTrainer",
  description: "A simple tool for your Swedish notes",
};

export default function MyApp({ Component }: { Component: ElementType }) {
  return (
    <MuiThemeWrapper>
      <Component />
    </MuiThemeWrapper>
  );
}
