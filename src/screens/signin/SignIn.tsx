import React from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { api } from "../../services/api.service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AxiosError } from "axios";

type SignIn = {
  email: string;
  password: string;
};

export const SignIn = ({ navigation }: { navigation: any }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignIn>();

  const onSubmit = async (data: SignIn) => {
    try {
      const request = await api.post<{ token: string }>("/auth/signin", {
        email: data.email,
        password: data.password,
      });

      await AsyncStorage.setItem("ACCESS_TOKEN", request.data.token);
      navigation.reset({
        index: 0,
        routes: [{ name: "posts" }],
      });
    } catch (err: any) {
      if (err instanceof AxiosError) {
        Alert.alert("Erro", err.response?.data.error);
      }
    }
  };

  return (
    <View
      style={{
        flex: 1,
        padding: 20,
      }}
    >
      <TouchableOpacity onPress={() => navigation.navigate("main")}>
        <Text style={{ fontSize: 50, position: "absolute" }}>↩</Text>
      </TouchableOpacity>
      <View
        style={{
          flex: 1,
          gap: 10,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
          Bem vindo de volta! É muito bom te ver novamente.
        </Text>
        <Controller
          control={control}
          name="email"
          rules={{ required: "E-mail é obrigatório" }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="E-mail"
              style={{
                width: "100%",
                borderWidth: 1,
                padding: 15,
                borderRadius: 10,
                backgroundColor: "#DCDCDC",
                borderColor: "#C0C0C0",
              }}
              value={value}
              onChangeText={onChange}
              placeholderTextColor="#808080"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          )}
        />
        {errors.email && (
          <Text style={{ color: "red" }}>{errors.email.message}</Text>
        )}

        <Controller
          control={control}
          name="password"
          rules={{ required: "Senha é obrigatória" }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="Senha"
              style={{
                width: "100%",
                borderWidth: 1,
                borderColor: "#C0C0C0",
                padding: 15,
                borderRadius: 10,
                backgroundColor: "#DCDCDC",
              }}
              value={value}
              onChangeText={onChange}
              placeholderTextColor="#808080"
              secureTextEntry
            />
          )}
        />
        {errors.password && (
          <Text style={{ color: "red" }}>{errors.password.message}</Text>
        )}

        <TouchableOpacity
          style={{
            backgroundColor: "#000",
            padding: 15,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: "#000",
            width: "100%",
            alignItems: "center",
          }}
          onPress={handleSubmit(onSubmit)}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>Entrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
