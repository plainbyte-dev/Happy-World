import localFont from "next/font/local";

export const montserrat = localFont({
  src: [
    {
      path: "./fonts/Montserrat/Montserrat-VariableFont_wght.ttf",
      weight: "100 900",
      style: "normal",
    },
    {
      path: "./fonts/Montserrat/Montserrat-Italic-VariableFont_wght.ttf",
      weight: "100 900",
      style: "italic",
    },
  ],
  variable: "--app-font-montserrat",
  display: "swap",
});
