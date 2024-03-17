import { Paper, Box, Typography, Icon, IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PostRating from "./PostRating";
import StarRateIcon from '@mui/icons-material/StarRate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons/faEllipsisV';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { getUserFromLocalStorage } from "../../store/store";
import { useNavigate } from "react-router-dom";
import PostsService from "../../API/PostsService";
import "./Posts.css";

const PostItem = (props) => {
    const loggedUser = getUserFromLocalStorage();
    const navigate = useNavigate();
    const [score, setScore] = useState(props.post.score);

    const onVoteClicked = async (type) => {
        if (!loggedUser) {
            navigate("/login");
            return;
        }
        PostsService.VotePost(props.post.id, type).then((responce) => {
            console.log(responce.new_number);
            setScore(responce.new_number);
        });
    }

    return (
        <Paper elevation={4} sx={{ mb: 3, borderRadius: 3, border: "solid", borderColor: "white", borderWidth:1 }}>
        <div className="post-item-container">
            <Box sx={{ display: "flex", width: "100%" }}>
                <div className="post-rating">
                    <div className="vote">
                        <IconButton onClick={() => onVoteClicked("like")} aria-label="Example">
                            <ExpandLessIcon/>
                        </IconButton>
                        <Typography className="rate" variant="h6">{score}</Typography>
                        <IconButton onClick={() => onVoteClicked("dislike")} aria-label="Example">
                            <ExpandMoreIcon/>
                        </IconButton>
                    </div>
                </div>
                <div className="post-info">
                    <Link style={{ textDecoration: 'none', padding: 1, marginTop: 10, marginBottom: 10, width: "1000%"}} to={`/post/${props.post.id}`}>
                        <Typography variant="h4" color="textPrimary">{props.post.title}</Typography>
                    </Link>

                    <div className="user-info">
                        <Link style={{ textDecoration: 'none'}} to={`/user/${props.post.author_id}`}>
                            <Typography variant="h7" color="textSecondary">{props.post.login}</Typography>
                        </Link>
                    </div>
                </div>
            </Box>
        </div>
    </Paper>
    )
}

export default PostItem;