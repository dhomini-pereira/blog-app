import { AxiosError } from "axios";
import React from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { api } from "../../services/api.service";
import { Controller, useForm } from "react-hook-form";

type SignUp = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export const SignUp = ({ navigation }: { navigation: any }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignUp>();

  const password = watch("password");

  const onSubmit = async (data: SignUp) => {
    try {
      if (data.password !== data.confirmPassword) {
        return Alert.alert("Senha", "As senhas não estão semelhantes.");
      }
      await api.post("/auth/signup", {
        name: data.name,
        email: data.email,
        password: data.password,
      });

      navigation.navigate("signin");
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
          Olá! Cadastre-se e comece sua jornada.
        </Text>
        <Controller
          control={control}
          name="name"
          rules={{ required: "Nome é obrigatório" }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="Nome"
              style={{
                width: "100%",
                borderWidth: 1,
                padding: 15,
                borderRadius: 10,
                backgroundColor: "#DCDCDC",
                borderColor: "#C0C0C0",
                textDecorationColor: "#C0C0C0",
              }}
              value={value}
              onChangeText={onChange}
              placeholderTextColor="#808080"
              autoCapitalize="none"
            />
          )}
        />
        {errors.name && (
          <Text style={{ color: "red" }}>{errors.name.message}</Text>
        )}
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
                textDecorationColor: "#C0C0C0",
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
                padding: 15,
                borderRadius: 10,
                backgroundColor: "#DCDCDC",
                borderColor: "#C0C0C0",
                textDecorationColor: "#C0C0C0",
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

        <Controller
          control={control}
          name="confirmPassword"
          rules={{
            required: "Confirmação de senha é obrigatória",
            validate: (value) =>
              value === password || "As senhas não coincidem",
          }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="Confirme a senha"
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
              secureTextEntry
            />
          )}
        />
        {errors.confirmPassword && (
          <Text style={{ color: "red" }}>{errors.confirmPassword.message}</Text>
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
          <Text style={{ color: "#fff", fontWeight: "bold" }}>Cadastrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
