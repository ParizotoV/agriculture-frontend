import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      support: string;
      background: string;
      sidebar: string;
      text: string;
      textSecondary: string;
      border: string;
      textDark: string;
      error: string;
      backgroundSecondary: string;
      backgroundHover: string;
    };
    spacing: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
    fontSizes: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      xxl: string;
    };
  }
}
