import React, { useEffect, useState } from "react";
import { Paper, Typography, Container, Box } from "@mui/material";
import { Link } from "react-router-dom";
import CommentItem from "./CommentItem";

const CommentsList = (props) => {
    return (
        <Container sx={{ mt: 3 }}>
            {((props.comments.Comments) && (props.comments.Comments.length)) ? (
                props.comments.Comments.map((comment) => (
                    <CommentItem
                        key={`${comment.id}`}
                        comment={comment}
                    />
                ))
            ) : (
                <Typography variant="h3" align="center" color="colorSecondary">There are no comments</Typography>
            )}
        </Container>
    );
}

export default CommentsList;