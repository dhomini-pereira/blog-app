import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { api } from "../../services/api.service";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AxiosError } from "axios";
import { darkBlue, gray, white, whiteBlue } from "../../styles/colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { PostService } from "../../services/post.service";

type Post = {
  id: number;
  title: string;
  content: string;
  likes: number;
  liked: boolean;
  bannerUrl: string;
  createdAt: string;
  updatedAt: string;
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

type User = {
  id: string;
  name: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
};

const parseDate = (input: string) => {
  const date = new Date(input);
  return date.toLocaleDateString("pt-BR", {
    dateStyle: "medium",
  });
};

const PostItem = ({
  post,
  navigation,
  setPosts,
}: {
  post: Post;
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  navigation: any;
}) => {
  const apiService = new PostService(api);
  const handlePress = () => {
    navigation.navigate("post", { postId: post.id });
  };

  const like = async () => {
    await apiService.likePost(post.id);
    setPosts((prevPosts) =>
      prevPosts.map((prevPost) =>
        prevPost.id === post.id
          ? {
              ...prevPost,
              liked: !prevPost.liked,
              likes: prevPost.liked ? prevPost.likes - 1 : prevPost.likes + 1,
            }
          : prevPost
      )
    );
  };

  return (
    <View
      style={{ paddingHorizontal: 30, paddingTop: 20, backgroundColor: white }}
    >
      <TouchableOpacity onPress={handlePress} style={{ gap: 10 }}>
        <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
          <Image
            style={{
              width: 40,
              height: 40,
              borderRadius: 100,
            }}
            src={
              post.author.imageUrl ?? "https://github.com/dhomini-pereira.png"
            }
          />
          <View>
            <Text style={{ fontSize: 17, color: darkBlue, fontWeight: "bold" }}>
              {post.author.name}
            </Text>
            <Text>{parseDate(post.createdAt)}</Text>
          </View>
        </View>
        <Text style={{ fontSize: 18, fontWeight: "bold", color: darkBlue }}>
          {post.title}
        </Text>
        <View style={{ width: "100%", height: 250 }}>
          <Image
            source={{ uri: post.bannerUrl }}
            style={{ width: "100%", height: "100%", borderRadius: 15 }}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            gap: 5,
          }}
        >
          {post.flags.map((flag) => (
            <Text
              key={flag.id}
              style={{
                backgroundColor: whiteBlue,
                fontSize: 16,
                padding: 10,
                borderRadius: 20,
                textAlign: "center",
                alignSelf: "flex-start",
                fontWeight: "bold",
                color: darkBlue,
              }}
            >
              {flag.name}
            </Text>
          ))}
        </View>
        <Text>{post.content.substring(0, 100)}...</Text>
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            gap: 10,
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", gap: 5 }}>
            <MaterialIcons name="thumbs-up-down" size={20} color={gray} />
            <Text style={{ color: gray }}>{post.likes}</Text>
          </View>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <View style={{ flexDirection: "row", gap: 3 }}>
              <FontAwesome name="comments" size={20} color={gray} />
              <Text style={{ color: gray }}>0</Text>
            </View>
            <View style={{ flexDirection: "row", gap: 3 }}>
              <FontAwesome name="share" size={20} color={gray} />
              <Text style={{ color: gray }}>0</Text>
            </View>
          </View>
        </View>
        <View style={{ width: "100%", flexDirection: "row", gap: 10 }}>
          <TouchableOpacity
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
            }}
            onPress={like}
          >
            <FontAwesome
              name={post.liked ? "thumbs-up" : "thumbs-o-up"}
              size={20}
              color={post.liked ? darkBlue : gray}
            />
            <Text
              style={{
                color: gray,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Curtir
            </Text>
          </TouchableOpacity>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
            }}
          >
            <FontAwesome name="comment-o" size={20} color={gray} />
            <Text
              style={{
                color: gray,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Comentar
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
            }}
          >
            <MaterialCommunityIcons
              name="share-variant-outline"
              size={20}
              color={gray}
            />
            <Text
              style={{
                color: gray,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Compartilhar
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      <View
        style={{
          backgroundColor: "#ccc",
          height: 2,
          marginTop: 10,
        }}
      ></View>
    </View>
  );
};

export const Posts = ({ navigation }: { navigation: any }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<User>();
  const apiService = new PostService(api);

  const fetchPosts = async () => {
    try {
      const response = await apiService.listPosts({ order: "desc", page });
      setPosts((prevPosts) => {
        const newPosts = response.data.posts.filter(
          (newPost: Post) => !prevPosts.some((post) => post.id === newPost.id)
        );
        return [...prevPosts, ...newPosts];
      });
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      if (error instanceof AxiosError) {
        throw error.response?.data.error;
      }
    }
  };

  const fetchUser = async () => {
    try {
      const token = await AsyncStorage.getItem("ACCESS_TOKEN");
      if (!token) throw new Error("Token not found");
      const response = await api.get<User>("/auth/user", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          await AsyncStorage.removeItem("ACCESS_TOKEN");
          navigation.navigate("main");
          return;
        }
        throw error.response?.data.error;
      }
    }
  };

  useEffect(() => {
    (async () => {
      try {
        if (loading) return;
        setLoading(true);
        await Promise.all([fetchPosts(), fetchUser()]);
      } catch (err: any) {
        Alert.alert(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <View style={{ flex: 1, marginTop: 20, backgroundColor: white }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 20,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: darkBlue,
          }}
        >
          Blog
        </Text>
        <FontAwesome name="bell-o" size={25} color={darkBlue} />
      </View>
      <FlatList
        style={{ marginBottom: 10 }}
        data={posts}
        keyExtractor={(item) => `post-${item.id}`}
        renderItem={({ item }) => (
          <PostItem post={item} setPosts={setPosts} navigation={navigation} />
        )}
        onEndReached={fetchPosts}
        onEndReachedThreshold={0.1}
        ListFooterComponent={
          loading ? <ActivityIndicator size="large" color="#007BFF" /> : null
        }
      />
    </View>
  );
};
