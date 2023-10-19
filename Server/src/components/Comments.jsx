import React from 'react'
import UserImage from './UserImage';
import { Typography,useTheme, Box} from '@mui/material';


const Comments = ({comment}) => {
  const { palette } = useTheme();
  const main = palette.neutral.main;

    return (
    <Box>
      <Box sx={{ color: main, m: "0.5rem 0", display: "flex", flexDirection: "row", alignContent: "center" }}>
          <UserImage image={comment.picturePath} size="40px" />
          <Typography sx={{ ml: "0.5rem" ,mt: "0.5rem", fontSize: "17px"}}>{comment.author}</Typography>
      </Box>
      <Typography sx={{ color: main, m: "0.5rem 0", pl: "3rem", mt: "1rem" }}>
        {comment.comment}
      </Typography>
    </Box>     
           
            
    
  )
}

export default Comments