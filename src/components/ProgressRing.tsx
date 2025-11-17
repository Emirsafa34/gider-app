import { View } from "react-native";
import { Circle, Svg } from "react-native-svg";

export default function ProgressRing({
  size = 80,
  stroke = 10,
  progress = 0.5, // 0–1 arası
  color = "#4caf50",
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);

  return (
    <View>
      <Svg width={size} height={size}>
        <Circle
          stroke="#ddd"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
        />
        <Circle
          stroke={color}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
}
