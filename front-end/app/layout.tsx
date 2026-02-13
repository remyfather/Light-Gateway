import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Document Parse - 페이지별 결과 시각화",
  description: "원본 문서와 파싱 결과를 페이지별로 비교하고, 다양한 형식으로 결과를 확인하세요",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
