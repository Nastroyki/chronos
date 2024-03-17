import { Avatar, Paper, Box, Typography, Container } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getUserFromLocalStorage } from "../store/store"; 
import UserService from "../API/UserService";
import PostsService from "../API/PostsService";
import prettyTime from "../API/PrettyTime";
import PostsList from "../components/Posts/PostsList";
import './User.css'

const UserPage = () => {
    const { id } = useParams();
    const [user, setUser] = useState();
    const [posts, setPosts] = useState();

    const loggedUser = getUserFromLocalStorage();

    useEffect(() => {
        UserService.getUserById(id).then(async (res) => {
            setUser(res.data.data);
        });

        PostsService.getAllPostsByAuthorId(id).then((posts_) => {
            setPosts(posts_);
        });
    }, [id]);

    return (
        <React.Fragment>
            <Paper sx={{ml: "15px", mr: "15px", mt: "90px", borderRadius: 5}}>
                {user && (
                    <div className="user-info">
                        <div className="avatar-and-rating">
                            <Avatar
                                sx={{ width: "160px", height: "160px", mb: 2 }}
                                alt="user"
                                src={`http://localhost:3001/api/users/${user.id}/${user.login}.jpg`}
                            />
                            <div className="rating">
                                <Typography>Rating: {user.rating}</Typography>
                            </div>
                        </div>
                        <div className="user-data">
                            <Typography className="property" sx={{mt: "30px"}}>Username: {user.username}</Typography>
                            <Typography className="property">Mail: {user.mail}</Typography>
                            <Typography className="property">Role: {user.role}</Typography>
                            <Typography className="property">Created At: {prettyTime(user?.createdAt)}</Typography>
                        </div>
                        {(loggedUser?.username === user.username || loggedUser?.role == 'admin') && (
                            <Link className="edit" to="/" style={{ textDecoration: 'none'}}>
                                <Typography color="textSecondary">Edit</Typography>
                            </Link>
                        )}
                    </div>
                )}
            </Paper>
            {posts ? <PostsList posts={posts} /> : <Box>There is no posts</Box>}
        </React.Fragment>
    );
}

export default UserPage;