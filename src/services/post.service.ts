import { Axios } from "axios";

export class PostService {
  constructor(private api: Axios) {}

  listPosts(filters: { order: string; page: number }) {
    return this.api.get(`/post?order=${filters.order}&page=${filters.page}`);
  }

  getPost(id: string) {
    return this.api.get(`/post/${id}`);
  }

  createPost(data: { title: string; content: string }) {
    return this.api.post("/post", data);
  }

  updatePost(id: string, data: { title: string; content: string }) {
    return this.api.put(`/post/${id}`, data);
  }

  deletePost(id: number) {
    return this.api.delete(`/post/${id}`);
  }

  likePost(id: number) {
    return this.api.put(`/post/${id}/like`);
  }
}
