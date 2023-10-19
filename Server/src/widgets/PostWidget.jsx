import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import { Box, Button, Divider, IconButton, TextField, Typography, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import Comments from "components/Comments";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state";
import { URL } from "URI";
import {MdDelete} from 'react-icons/md'


const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
}) => {
  const [isComments, setIsComments] = useState(false);
  const [comment,setComment]=useState("")
  const [comments,setComments]=useState([])
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const user = useSelector((state) => state.user);
  const firstName = useSelector((state) => state.firstName);
  const lastName = useSelector((state) => state.lastName);
  const fullName= `${firstName} ${lastName}` 
  const picture = useSelector((state)=> state.picture)
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const patchLike = async () => {
    const response = await fetch(`${URL}/posts/${postId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };


  const postComment=async(e)=>{
    e.preventDefault()
    try{
    
    const response=await fetch(`${URL}/comments/create`,
    {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json'  },
    body: JSON.stringify({comment:comment, author:fullName, postId:postId, userId: loggedInUserId, picturePath:picture}),
    })
    
    //console.log(loggedInUserId)
    fetchPostComments()
    //setComment("")
    //window.location.reload(true)

    }
    catch(err){
        console.log(err)
    }

  }

  const handleChange = event => {
    setComment(event.target.value)
  }

  const fetchPostComments=async()=>{
    try {
        const res=await fetch(`${URL}/comments/post/${postId}`,  {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
    })
        const data = await res.json();
        setComments(data)
        setComment("")
    } catch (error) {
        console.log(error)
    }
    }

    useEffect(()=>{
        fetchPostComments()
    },[])
  
    const deleteComment=async(id)=>{
        try {
            await fetch(`${URL}/comments/${id}`, {
            method: "DELETE",
            headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            },
        })
          fetchPostComments()
        } catch (error) {
            console.log(error)
        }
}



  return (
    <WidgetWrapper m="2rem 0">
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
      />
      <Typography color={main} sx={{ mt: "1rem" }}>
        {description}
      </Typography>
      {picturePath && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={`${picturePath}`}
        />
      )}
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setIsComments(!isComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{comments.length}</Typography>
          </FlexBetween>
        </FlexBetween>

        {/* <IconButton>
          <ShareOutlined />
        </IconButton> */}
      </FlexBetween>
      
    {/*Shows the comments */}
      {isComments && (
        <Box mt="0.5rem">
          {comments.map((comment, i) => (
            <Box key={`${name}-${i}`}>
              <Divider />
              <Box sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
                <Comments comment={comment}></Comments>
                {user?._id===comment?.userId ?
                    (<Box sx={{display: "flex", justifyContent: "flex-end"}}>
                      <MdDelete  onClick={()=>deleteComment(comment._id)}/>
                      </Box>) :""}
              </Box>
            </Box>
          ))}
          <Divider />


        {/*Post a comment */}
        <Box sx={{display: "flex", flexDirection: "row", justifyContent: "center", m:"0.5rem"} }>
            <TextField value={comment} id={comment} onChange={handleChange} sx={{ color: main, m: "0.5rem 0", pl: "1rem", width: "80%"}}></TextField>
            <Button onClick={postComment}>Add comment</Button>
        </Box>
        </Box>
      )}

    


    </WidgetWrapper>
  );
};

export default PostWidget;