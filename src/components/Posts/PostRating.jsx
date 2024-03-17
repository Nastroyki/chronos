import { Paper, Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StarRateIcon from '@mui/icons-material/StarRate';

const PostRating = ({ rating }) => {
    console.log(rating)
    return (
        <div className="post-rating">
            <Typography variant="body1">Rating {rating}</Typography>
            <StarRateIcon sx={{mb: "4px", color: "orange"}}/>
      </div>
    );
}

export default PostRating;