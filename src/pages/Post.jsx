import React, { useEffect, useState } from "react";
import { IconButton, Paper, Box, Typography, Container } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import PostsService from "../API/PostsService";
import { getUserFromLocalStorage } from "../store/store"; 
import prettyTime from "../API/PrettyTime";
import CommentsList from "../components/Comments/CommentsList";
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate } from "react-router-dom";
import './Post.css'

const PostPage = () => {
    const { id } = useParams();
    const [post, setPost] = useState();
    const [comments, setCommets] = useState();
    const [score, setScore] = useState(post?.score);

    const navigate = useNavigate();
    const loggedUser = getUserFromLocalStorage();

    const onVoteClicked = async (type) => {
        if (!loggedUser) {
            navigate("/login");
            return;
        }
        PostsService.VotePost(post.id, type).then((responce) => {
            setScore(responce.new_number);
        });
    }
    
    useEffect(() => {
        PostsService.getPostById(id).then(async (responce) => {
            setPost(responce);
            setScore(responce.score);
        });

        PostsService.getCommentsByPostId(id).then(async (responce) => {
            setCommets(responce);
        })
    }, [id]);

    return (
        <React.Fragment>
            <Paper sx={{ml: "15px", mr: "15px", mt: "90px", borderRadius: 5}}>
                {post && (
                    <div className="header">
                        <div className="status-rate">
                            <Link to={`/user/${post.id}`} style={{ textDecoration: 'none'}}>
                                <Typography variant="h6" color="textPrimary" className="status-rate-elem">{post.login}</Typography>
                            </Link>
                            <Typography color="green" className="status-rate-elem">{post.status}</Typography>
                            <div className="rate-post">
                                <IconButton onClick={() => onVoteClicked("like")} aria-label="Example">
                                    <ExpandLessIcon/>
                                </IconButton>
                                <Typography>{score ? score : 0}</Typography>
                                <IconButton onClick={() => onVoteClicked("dislike")} aria-label="Example">
                                    <ExpandMoreIcon/>
                                </IconButton>
                            </div>
                        </div>
                        <div className="content">
                            <div className="title-publish">
                                <Typography variant="h4" className="title-publish-elem">{post.title}</Typography>
                                <Typography variant="h6" className="title-publish-content">{post.content}</Typography>
                            </div>
                            <div className="add-data">
                                {(loggedUser?.username === post.login || loggedUser?.role === 'admin') && (
                                    <Link to="/" style={{ textDecoration: 'none'}}>
                                        <Typography color="textSecondary" className="edit">edit</Typography>
                                    </Link>
                                )}
                                <Typography className="edit">{prettyTime(post?.publish_date)}</Typography>
                            </div>
                        </div>
                    </div>
                )}
            </Paper>
            <Paper sx={{mb:"15px", ml: "15px", mr: "15px", mt: "20px", borderRadius: 5}}>
                <Typography style={{paddingTop: "10px", paddingLeft: "10px"}} variant="h5" color="textPrimary">Comments:</Typography>
                {comments ? (<CommentsList comments={comments} />) : <Box>There is no comments</Box>}
            </Paper>
        </React.Fragment>
    );
}

export default PostPage;