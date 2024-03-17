import React, { useEffect, useState } from "react";
import { IconButton, Paper, Typography, Container, Box } from "@mui/material";
import { Link } from "react-router-dom";
import { getUserFromLocalStorage } from "../../store/store";
import prettyTime from "../../API/PrettyTime";
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate } from "react-router-dom";
import PostsService from "../../API/PostsService";

const CommentItem = (props) => {
    const comment = props.comment; 
    const loggedUser = getUserFromLocalStorage();
    const [score, setScore] = useState(comment?.score);

    const navigate = useNavigate();

    const onVoteClicked = async (type) => {
        if (!loggedUser) {
            navigate("/login");
            return;
        }
        PostsService.VoteMessage(comment.id, type).then((responce) => {
            setScore(responce.new_number);
        });
    }

    return (
        <Paper elevation={4} sx={{ mb: 3, borderRadius: 3, border: "solid", borderColor: "white", borderWidth:1 }}>
                <div className="header">
                    <div className="status-rate">
                        <Link to={`/user/${comment.author_id}`} style={{ textDecoration: 'none'}}>
                            <Typography variant="h6" color="textPrimary" className="status-rate-elem">{comment.author_name}</Typography>
                        </Link>
                        <div className="rate-comment">
                            <IconButton onClick={() => onVoteClicked("like")} aria-label="up">
                                <ExpandLessIcon/>
                            </IconButton>
                            <Typography>{score}</Typography>
                            <IconButton onClick={() => onVoteClicked("dislike")} aria-label="down">
                                <ExpandMoreIcon/>
                            </IconButton>
                        </div>
                    </div>
                    <div className="content">
                        <div className="title-publish">
                            <Typography variant="h6" style={{paddingTop: "10px"}} className="title-publish-content">{comment.content}</Typography>
                        </div>
                        <div className="add-data">
                            {(loggedUser?.username === comment.author_name || loggedUser?.role === 'admin') && (
                                <Link to="/" style={{ textDecoration: 'none'}}>
                                    <Typography color="textSecondary" className="edit">edit</Typography>
                                </Link>
                            )}
                            <Typography className="edit">{prettyTime(comment?.publish_date)}</Typography>
                        </div>
                    </div>
                </div>
        </Paper>
    );
}

export default CommentItem;