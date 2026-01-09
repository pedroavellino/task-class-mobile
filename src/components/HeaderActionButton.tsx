import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import { theme } from "../ui/theme";

type Props = {
  title: string;
  onPress: () => void;
  variant?: "default" | "danger";
};

export function HeaderActionButton({
  title,
  onPress,
  variant = "default",
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.base,
        variant === "danger" && styles.danger,
      ]}
      hitSlop={8}
    >
      <Text
        style={[
          styles.text,
          variant === "danger" ? styles.textDanger : styles.textDefault,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.card2,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  danger: {
    borderColor: theme.colors.danger,
  },

  text: {
    fontSize: 14,
    fontWeight: "800",
  },

  textDefault: {
    color: theme.colors.primary, 
  },

  textDanger: {
    color: theme.colors.danger,
  },
});
