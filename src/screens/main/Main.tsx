import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";

export const Main = ({ navigation }: { navigation: any }) => {
  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem("ACCESS_TOKEN");

      if (token) return navigation.navigate("posts");
    })();
  }, []);

  const handlePressEntrar = () => {
    navigation.navigate("signin");
  };

  const handlePressCadastrar = () => {
    navigation.navigate("signup");
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "space-between",
        alignItems: "center",
        padding: 20,
      }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            fontSize: 30,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Seja Bem Vindo! É um prazer ter você aqui.
        </Text>
      </View>
      <View
        style={{
          width: "100%",
          gap: 10,
          marginBottom: 50,
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: "#000",
            padding: 15,
            borderRadius: 10,
            alignItems: "center",
            borderWidth: 1,
            borderColor: "#000",
          }}
          onPress={handlePressEntrar}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>Entrar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: "#fff",
            borderColor: "#000",
            borderWidth: 1,
            borderRadius: 10,
            alignItems: "center",
            padding: 15,
          }}
          onPress={handlePressCadastrar}
        >
          <Text style={{ color: "#000", fontWeight: "bold" }}>Cadastrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
