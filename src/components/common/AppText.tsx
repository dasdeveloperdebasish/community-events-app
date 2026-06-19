import { Text, TextProps } from "react-native";
import { COLORS } from "@/constants/colors";

type Props = TextProps & {
  children: React.ReactNode;
};

export default function AppText({ children, style, ...props }: Props) {
  return (
    <Text
      style={[
        {
          color: COLORS.text,
          fontSize: 16,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
}
