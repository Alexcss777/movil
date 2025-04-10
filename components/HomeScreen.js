import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  Pressable,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HeaderCustom from "./menu/header";

export default function HomeScreen({ navigation }) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [userRol, setUserRol] = useState('');

  const toggleMenu = () => setMenuVisible(!menuVisible);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("accessToken");
    await AsyncStorage.removeItem("usuario");
    setMenuVisible(false);
    navigation.replace("Login");
  };

  useEffect(() => {
    const fetchRol = async () => {
      try {
        const userJson = await AsyncStorage.getItem("usuario");
        if (userJson) {
          const user = JSON.parse(userJson); // ✅ lo parseamos
          console.log("ROL DEL USUARIO:", user.rol); // 👈 para confirmar
          setUserRol(user.rol); // ✅
        }
      } catch (err) {
        console.error("❌ Error al obtener el rol:", err);
      }
    };
    fetchRol();
  }, []);
  

  return (
    <View style={styles.container}>
      <HeaderCustom title="Inicio" />

      {/* Modal de logout */}
      <Modal transparent visible={menuVisible} animationType="fade">
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menu}>
            <TouchableOpacity onPress={handleLogout}>
              <Text style={styles.menuItem}>Cerrar sesión</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      {/* Imagen superior */}
      <Image
        source={require("../assets/image.png")}
        style={styles.banner}
      />

      {/* Menú de botones */}
      <View style={styles.menuContainer}>
        <View style={styles.menuRow}>
          <TouchableOpacity
            style={styles.menuItemBox}
            onPress={() => navigation.navigate("escaner")}
          >
            <View style={styles.menuCard}>
              <View style={styles.iconCircle}>
                <Image
                  source={require("../assets/escaneo.png")}
                  style={styles.icon}
                />
              </View>
              <Text style={styles.menuText}>Escanear{"\n"}Producto</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItemBox}
            onPress={() => navigation.navigate("mermaScanner")}
          >
            <View style={styles.menuCard}>
              <View style={styles.iconCircle}>
                <Image
                  source={require("../assets/caja.png")}
                  style={styles.icon}
                />
              </View>
              <Text style={styles.menuText}>Registrar{"\n"}Merma</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.menuRow}>
          <TouchableOpacity
            style={styles.menuItemBox}
            onPress={() => navigation.navigate("dashboardMermas")}
          >
            <View style={styles.menuCard}>
              <View style={styles.iconCircle}>
                <Image
                  source={require("../assets/chart.png")}
                  style={styles.icon}
                />
              </View>
              <Text style={styles.menuText}>Mermas</Text>
            </View>
          </TouchableOpacity>

          <View style={[styles.menuItemBox, userRol !== 'Administrador' && { opacity: 0.4 }]}>
            <TouchableOpacity
              disabled={userRol !== 'Administrador'}
              onPress={() => navigation.navigate("Reportes")}
            >
              <View style={styles.menuCard}>
                <View style={styles.iconCircle}>
                  <Image
                    source={require("../assets/caja.png")}
                    style={styles.icon}
                  />
                </View>
                <Text style={styles.menuText}>Reportes</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e8eaed",
  },
  modalOverlay: {
    flex: 1,
  },
  menu: {
    position: "absolute",
    top: 90,
    right: 20,
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 8,
    elevation: 5,
  },
  menuItem: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#37474F",
  },
  banner: {
    width: "100%",
    height: 160,
    resizeMode: "cover",
    borderRadius: 10,
  },
  menuContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 70,
  },
  menuRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "85%",
    marginBottom: 20,
  },
  menuItemBox: {
    width: "48%",
  },
  menuCard: {
    backgroundColor: "#fdfdfd",
    borderRadius: 15,
    paddingVertical: 20,
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
  },
  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#FBC02D",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  icon: {
    width: 35,
    height: 35,
    tintColor: "#fff",
  },
  menuText: {
    textAlign: "center",
    fontSize: 14,
    color: "#37474F",
    fontWeight: "600",
  },
});
