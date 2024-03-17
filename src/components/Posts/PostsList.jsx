import React, { useEffect, useState } from "react";
import { Container, Typography, Paper, Box } from "@mui/material";
import PostItem from "./PostItem";

const PostsList = (props) => {
    return (
        <Container sx={{ mt: 3 }}>
            {((props.posts.Posts) && (props.posts.Posts.length)) ? (
                props.posts.Posts.map((post) => (
                    <PostItem
                        key={`${post.id}`}
                        post={post}
                    />
                ))
            ) : (
                <Typography variant="h3" align="center" color="colorSecondary">There are no posts</Typography>
            )}
        </Container>
    );
}

export default PostsList;