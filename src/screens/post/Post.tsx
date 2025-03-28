import { useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Text, View, Image, ScrollView } from "react-native";
import { api } from "../../services/api.service";

type RouteParams = {
  postId: number;
};

type Post = {
  id: number;
  title: string;
  content: string;
  bannerUrl: string;
  createdAt: Date;
  updatedAt: Date;
  author: {
    id: string;
    name: string;
    email: string;
    imageUrl: string | null;
  };
  flags: {
    id: number;
    name: string;
  }[];
};

export const Post = ({ navigation }: { navigation: any }) => {
  const route = useRoute();
  const { postId } = route.params as RouteParams;
  const [post, setPost] = useState<Post>();

  useEffect(() => {
    (async () => {
      if (!postId) return navigation.navigate("posts");
      const request = await api.get<Post>(`/post/${postId}`);
      setPost(request.data);
    })();
  }, []);

  return (
    <ScrollView
      style={{
        flex: 1,
        padding: 20,
      }}
    >
      <View style={{ alignItems: "center" }}>
        <Image
          source={{ uri: post?.bannerUrl }}
          style={{
            marginTop: 20,
            width: "100%",
            height: 400,
            borderRadius: 10,
            marginBottom: 20,
          }}
        />
        <Text
          style={{
            fontSize: 26,
            fontWeight: "bold",
            marginVertical: 5,
            textAlign: "center",
          }}
        >
          {post?.title}
        </Text>
        <Text
          style={{
            fontSize: 12,
            color: "gray",
            marginBottom: 20,
            textAlign: "center",
          }}
        >
          {post?.author && `Por ${post?.author.name} em `}
          {post?.createdAt &&
            new Date(post?.createdAt).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
        </Text>
      </View>

      <Text
        style={{
          fontSize: 16,
          lineHeight: 24,
          textAlign: "justify",
        }}
      >
        {post?.content}
      </Text>
    </ScrollView>
  );
};
