import { ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import AppText from "@/components/common/AppText";
import { COLORS } from "@/constants/colors";
import { CATEGORIES } from "@/constants/categories";
import { Category } from "@/types/Event";

type Props = {
  selectedCategory: Category | "All";
  onSelectCategory: (category: Category | "All") => void;
};

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

const CATEGORY_ICONS: Record<
  string,
  { active: IoniconName; inactive: IoniconName }
> = {
  All: { active: "grid", inactive: "grid-outline" },
  Tech: { active: "laptop", inactive: "laptop-outline" },
  Music: { active: "musical-notes", inactive: "musical-notes-outline" },
  Sports: { active: "football", inactive: "football-outline" },
  Food: { active: "restaurant", inactive: "restaurant-outline" },
  Other: { active: "sparkles", inactive: "sparkles-outline" },
};

export default function CategoryTabs({
  selectedCategory,
  onSelectCategory,
}: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {CATEGORIES.map((category) => {
        const isSelected = selectedCategory === category;
        const icons = CATEGORY_ICONS[category];

        return (
          <TouchableOpacity
            key={category}
            style={[styles.tab, isSelected && styles.activeTab]}
            activeOpacity={0.75}
            onPress={() => onSelectCategory(category)}
          >
            <Ionicons
              name={
                icons
                  ? isSelected
                    ? icons.active
                    : icons.inactive
                  : "ellipse-outline"
              }
              size={15}
              color={isSelected ? "#FFF" : COLORS.textSecondary}
            />

            <AppText
              style={[
                styles.label,
                { color: isSelected ? "#FFF" : COLORS.text },
              ]}
            >
              {category}
            </AppText>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingRight: 16,
    gap: 8,
  },

  tab: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },

  activeTab: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 18,
  },
});
