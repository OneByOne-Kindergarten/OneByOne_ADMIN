import { Chip } from "@mui/material";
import { styled } from "@mui/material/styles";

export const CustomChip = styled(Chip)(({ color }) => {
  const getColors = (colorName: string) => {
    switch (colorName) {
      case "success":
        return {
          backgroundColor: "rgba(34,197,94,0.16)",
          color: "#118D57",
          fontWeight: "600",
        };
      case "error":
        return {
          backgroundColor: "rgba(197, 34, 34, 0.16)",
          color: "#C52222",
          fontWeight: "600",
        };
      case "primary":
        return {
          backgroundColor: "rgba(108,166,237,0.16)",
          color: "#6CA6ED",
          fontWeight: "600",
        };
      case "secondary":
        return {
          backgroundColor: "rgba(254,237,138,0.32)",
          color: "#CBBE6E",
          fontWeight: "600",
        };
      default:
        return {
          backgroundColor: "#f3f4f6",
          color: "#374151",
          fontWeight: "600",
        };
    }
  };

  return getColors(color || "default");
});
