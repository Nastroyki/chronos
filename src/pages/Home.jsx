import React, { useEffect, useState } from "react";
import { Paper, Typography, Container, Box } from "@mui/material";
import { Link } from "react-router-dom";
import { getUserFromLocalStorage, logout } from "../store/store";
import AuthService from "../API/AuthService";
import PostsService from "../API/PostsService";
import PostsList from "../components/Posts/PostsList";

const Home = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        PostsService.getAllPosts().then((posts_) => {
            setPosts(posts_);
        });  
    }, []);

    return (
        <div style={{marginTop: "50px"}}>
            Hello world
            {posts ? <PostsList posts={posts} /> : <Box>There is no posts :(</Box>}
        </div>
    )
}

export default Home;