import { extendTheme } from "@chakra-ui/react";
import { StyleFunctionProps, mode } from "@chakra-ui/theme-tools";

// Define the colors you want to use
const colors = {
  brand: {
    50: "#f5f7fa", // You can adjust the shades as necessary
    100: "#e4e7eb",
    200: "#cbd2d9",
    300: "#9aa5b1",
    400: "#7b8794",
    500: "#616e7c", // This might be your default brand color
    600: "#52606d",
    700: "#3e4c59",
    800: "#323f4b",
    900: "#1f2933",
  },
  // Define any additional color schemes as needed
};

// Configure the initial color mode and other theme properties
const config = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

// Extend the theme
const theme = extendTheme({
  colors,
  config,
  styles: {
    global: (props: Record<string, any>) => ({
      body: {
        bg: mode("brand.900", "brand.900")(props), // Use 'mode' for light/dark color modes if needed
        color: mode("brand.50", "brand.200")(props),
      },
      // You can add styles for other elements as needed
    }),
  },
  components: {
    // Here you can customize components further if needed
    Button: {
      baseStyle: (props: Record<string, any> | StyleFunctionProps) => ({
        _hover: {
          bg: mode("brand.700", "brand.700")(props),
        },
      }),
    },
    // Add other component overrides here
  },
});

export default theme;
