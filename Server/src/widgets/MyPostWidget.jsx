import {
  EditOutlined,
  DeleteOutlined,
  AttachFileOutlined,
  GifBoxOutlined,
  ImageOutlined,
  MicOutlined,
  MoreHorizOutlined,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  Typography,
  InputBase,
  useTheme,
  Button,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Dropzone from "react-dropzone";
import UserImage from "components/UserImage";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import { URL } from "URI";
import { object } from "yup";


const MyPostWidget = ({ picturePath }) => {
  const dispatch = useDispatch();
  const [isImage, setIsImage] = useState(false);
  const [image, setImage] = useState("");
  const [post, setPost] = useState("");
  const [hasContent, setHasContent] = useState(false)
  const { palette } = useTheme();
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const mediumMain = palette.neutral.mediumMain;
  const medium = palette.neutral.medium;
  

  function showWidget() {
        const widget = window.cloudinary.createUploadWidget(
            {
                cloudName: "ddwymvr6k",
                uploadPreset: "jrt7qena",
            },
            (error, result) => {
                if (!error && result.event === "success") {
                    setImage(String(result.info.url));
                    setIsImage(true)
                    setHasContent(true)

                }
            }
        );
        widget.open();
    }

    const handleChange=(e)=>{
        setPost(e.target.value)
        setHasContent(true)
    }

  const handlePost = async () => {
    const data={
      userId: _id,
      description: post,
      picturePath: image,

    }
    

    const response = await fetch(`${URL}/posts`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json"  },
      body: JSON.stringify(data),
    });
    const posts = await response.json();
    dispatch(setPosts({ posts }));
    setIsImage(false)
    setImage("");
    setPost("");
  };

  return (
    <WidgetWrapper>
      <FlexBetween gap="1.5rem">
        <UserImage image={picturePath} />
        <InputBase
          placeholder="What's on your mind..."
          onChange={(e) => handleChange(e)}
          value={post}
          sx={{
            width: "100%",
            backgroundColor: palette.neutral.light,
            borderRadius: "2rem",
            padding: "1rem 2rem",
          }}
        />
      </FlexBetween>

      {isImage && (
        <Box
          border={`1px solid ${medium}`}
          borderRadius="5px"
          mt="1rem"
          p="1rem"
        >
          
              <FlexBetween>
                <Box
                  border={`2px dashed ${palette.primary.main}`}
                  p="1rem"
                  width="100%"
                  sx={{ "&:hover": { cursor: "pointer" } }}
                >
                  
                    <FlexBetween >
                      <img  width="100%"
                      height="auto"
                      style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }} src={image}/>
                      
                    </FlexBetween>
                  
                </Box>

                {image && (
                  <IconButton
                    onClick={showWidget}
                    sx={{ width: "15%" }}
                  >
                    <EditOutlined />
                  </IconButton>
                )}


                {image && (
                  <IconButton
                    onClick={() => {setImage("")
                    setIsImage(false)
                  }}
                    sx={{ width: "15%" }}
                  >
                    <DeleteOutlined />
                  </IconButton>
                )}

              </FlexBetween>
          
        </Box>
      )}

      <Divider sx={{ margin: "1.25rem 0" }} />

      <FlexBetween>
        <FlexBetween gap="0.25rem">
          <ImageOutlined sx={{ color: mediumMain }} />
          <Typography
           onClick={showWidget}
            color={mediumMain}
            sx={{ "&:hover": { cursor: "pointer", color: medium } }}>
            Image
          </Typography>
        </FlexBetween>


        <Button
          disabled={!hasContent}
          onClick={handlePost}
          sx={{
            color: palette.background.alt,
            backgroundColor: palette.primary.main,
            borderRadius: "3rem",
          }}
        >
          POST
        </Button>
      </FlexBetween>
    </WidgetWrapper>
  );
};

export default MyPostWidget;