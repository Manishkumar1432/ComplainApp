import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../src/contexts/AuthContext";

export default function Profile() {
  const router = useRouter();
  const { logout, user } = useAuth();

  // 🔥 Logout Function with confirmation
  const handleLogout = () => {
    Alert.alert("Confirm Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await logout();
            router.replace("/login");
          } catch (error) {
            console.log("Logout Error:", error);
          }
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      {/* 👤 User Info */}
      <View style={styles.profileCard}>
        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
          }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{user?.name ?? 'User'}</Text>
        <Text style={styles.email}>{user?.email ?? 'Manage your account'}</Text>
      </View>

      {/* ⚙️ Menu */}
      <View style={styles.menu}>
        <MenuItem
          icon="person"
          title="My Profile"
          onPress={() => router.push("../Pages/Profile")}
        />

        <MenuItem
          icon="time"
          title="Track Complaint Status"
          onPress={() => router.push("../Pages/MyStatus")}
        />

        <MenuItem
          icon="settings"
          title="Settings"
          onPress={() => router.push("../Pages/Setting")}
        />

        <MenuItem
          icon="help-circle"
          title="Help & Support"
          onPress={() => router.push("../Pages/Help")}
        />

        {/* About App */}
        <MenuItem
          icon="information-circle"
          title="About App"
          onPress={() => router.push("../Pages/AboutApp")}
        />

        {/* 🔥 Logout */}
        <MenuItem
          icon="log-out"
          title="Logout"
          onPress={handleLogout}
          isLast={true}
        />
      </View>
    </ScrollView>
  );
}

// ✅ Menu Item Component (improved)
const MenuItem = ({
  icon,
  title,
  onPress,
  isLast,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  onPress: () => void;
  isLast?: boolean;
}) => (
  <TouchableOpacity
    style={[styles.menuItem, isLast && { borderBottomWidth: 0 }]}
    onPress={onPress}
  >
    <Ionicons name={icon} size={22} color="#4A90E2" />
    <Text style={styles.menuText}>{title}</Text>
    <Ionicons name="chevron-forward" size={20} color="gray" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FB",
    padding: 15,
  },

  profileCard: {
    backgroundColor: "#4A90E2",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },

  name: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },

  email: {
    color: "#fff",
    opacity: 0.8,
  },

  menu: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 5,
    elevation: 3,
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 0.5,
    borderColor: "#ddd",
  },

  menuText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
  },
});
