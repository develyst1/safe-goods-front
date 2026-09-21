import type { Metadata } from "next";
import { IBM_Plex_Sans_Thai } from "next/font/google";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { App as AntdApp, ConfigProvider } from "antd";
import thTH from "antd/locale/th_TH";
import { AppProviders } from "@/context/AppProviders";
import { antdTheme } from "@/theme/antd-theme";
import { SITE_NAME } from "@/constant/text/th";
import "./globals.css";

const plexThai = IBM_Plex_Sans_Thai({
  variable: "--font-plex-thai",
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: SITE_NAME,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={`${plexThai.variable} h-full`}>
      <body className="min-h-full flex flex-col">
        <AntdRegistry>
          <ConfigProvider theme={antdTheme} locale={thTH}>
            <AntdApp>
              <AppProviders>{children}</AppProviders>
            </AntdApp>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
