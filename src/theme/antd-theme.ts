import type { ThemeConfig } from "antd";

// Ant Design tokens mirroring globals.css (AntD's color parser takes hex, not oklch —
// these are the sRGB renderings of the same OKLCH values).
export const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: "#1e4eac",
    colorPrimaryHover: "#2c5dbd",
    colorPrimaryActive: "#0f3a90",
    colorSuccess: "#00986c",
    colorError: "#c92f33",
    colorText: "#161b24",
    colorTextSecondary: "#555b66",
    colorTextPlaceholder: "#6b7280",
    colorBorder: "#dbdee3",
    colorBgLayout: "#ffffff",
    colorBgContainer: "#ffffff",
    borderRadius: 10,
    borderRadiusLG: 12,
    controlHeight: 40,
    controlHeightLG: 48,
    fontFamily: "var(--font-sans)",
    fontSize: 15,
    lineWidthFocus: 3,
    motionDurationMid: "0.2s",
    motionEaseInOut: "cubic-bezier(0.22, 1, 0.36, 1)",
  },
  components: {
    Button: {
      fontWeight: 600,
      primaryShadow: "none",
      defaultShadow: "none",
      contentFontSizeLG: 16,
    },
    Input: {
      activeShadow: "0 0 0 3px rgba(30, 78, 172, 0.18)",
      paddingBlockLG: 10,
      paddingInlineLG: 14,
    },
    Form: {
      labelFontSize: 14,
      labelColor: "#161b24",
      verticalLabelPadding: "0 0 6px",
      itemMarginBottom: 18,
    },
  },
};
