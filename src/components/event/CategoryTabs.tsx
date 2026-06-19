import { ScrollView, TouchableOpacity, StyleSheet } from "react-native";

import AppText from "@/components/common/AppText";
import { COLORS } from "@/constants/colors";
import { CATEGORIES } from "@/constants/categories";
import { Category } from "@/types/Event";

type Props = {
  selectedCategory: Category | "All";
  onSelectCategory: (category: Category | "All") => void;
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

        return (
          <TouchableOpacity
            key={category}
            style={[styles.tab, isSelected && styles.activeTab]}
            onPress={() => onSelectCategory(category)}
          >
            <AppText
              style={[
                styles.label,
                {
                  color: isSelected ? "#FFF" : COLORS.text,
                },
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
    paddingVertical: 12,
    paddingRight: 16,
    gap: 8,
  },

  tab: {
    minHeight: 35,
    paddingHorizontal: 18,
    justifyContent: "center",
    alignItems: "center",

    borderRadius: 22,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  activeTab: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  label: {
    fontSize: 16,
    lineHeight: 20,
  },
});
