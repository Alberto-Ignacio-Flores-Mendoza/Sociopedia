import { useState } from "react";
import { URL } from "URI";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "state";
import FlexBetween from "components/FlexBetween";

const loginSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
});


const initialValuesLogin = {
  email: "",
  password: "",
};

const Form = () => {
  const [pageType, setPageType] = useState("login");
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";
  const [picturePath, setFiles] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastname] = useState("")
  const [location, setlocation] = useState("")
  const [occupation, setOccupation] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")


  function showWidget() {
        const widget = window.cloudinary.createUploadWidget(
            {
                cloudName: "ddwymvr6k",
                uploadPreset: "jrt7qena",
            },
            (error, result) => {
                if (!error && result.event === "success") {
                    setFiles(String(result.info.url));
                }
            }
        );
        widget.open();
    }



  const handleRegister= async()=>{

    if(firstName === "" || lastName==="" || email===""|| password ==="" || picturePath=== "" || location === "" || occupation ==""){
     return alert("All fields must be filled")
    }

    const data= {
      firstName,
      lastName,
      email,
      password, 
      picturePath,
      location,
      occupation
    }
    let res
            res= await fetch(`${URL}/auth/register`,{
            method: "POST",
            headers: {'Content-Type': 'application/json'  },
            body: JSON.stringify(data),
            }).then(async(response)=>{
              if(!response.ok){
                if(response.status===400){
                  alert("This Email is already taken")
                }
              }
            else{
            setPageType("login");
            }
            }).catch((error)=>{
              console.log(error)
            })
    }

  const login = async (values, onSubmitProps) => {
    
    
    const loggedInResponse = await fetch(`${URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    }).then((response)=>{
      if(!response.ok){
        alert("Invalid Credentials")
      }else{
        response.json().then((loggedIn)=>{
          onSubmitProps.resetForm();

          dispatch(
          setLogin({
            user: loggedIn.user,
            token: loggedIn.token,
          })
          );
          navigate("/home");

        });

        
      }
    }).catch((error)=>{
      console.log(error)
    });
    

    
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isLogin) await login(values, onSubmitProps);
  };

  return (
    <>
     {isRegister && (
      <div>
          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
            }}>

              <>
                <TextField
                  label="First Name"
                  onChange={(e)=>setFirstName(e.target.value)}
                  value={firstName}
                  name="firstName"
                  sx={{ gridColumn: "span 2" }}/>

                <TextField
                  label="Last Name"
                  onChange={(e)=>setLastname(e.target.value)}
                  value={lastName}
                  name="lastName"
                  sx={{ gridColumn: "span 2" }}
                  />
                <TextField
                  label="Location"
                  onChange={(e)=>setlocation(e.target.value)}
                  value={location}
                  name="location"
                  sx={{ gridColumn: "span 4" }}
                />
                <TextField
                  label="Occupation"
                  onChange={(e)=>setOccupation(e.target.value)}
                  value={occupation}
                  name="occupation"
                  sx={{ gridColumn: "span 4" }}
                />

              <TextField
              label="Email"
              onChange={(e)=>setEmail(e.target.value)}
              value={email}
              name="email"
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              label="Password"
              type="password"
              onChange={(e)=>setPassword(e.target.value)}
              value={password}
              name="password"
              sx={{ gridColumn: "span 4" }}
            />

                <Box
                  gridColumn="span 4"
                  border={`1px solid ${palette.neutral.medium}`}
                  borderRadius="5px"
                  p="1rem"
                
                >
                {
                    picturePath===""? 
                  <Button
                  onClick={showWidget}
                  sx={{
                  m: "2rem 0",
                  p: "1rem",
                  backgroundColor: palette.primary.main,
                  color: palette.background.alt,
                  "&:hover": { color: palette.primary.main },
                  }}
                  >
                    
                    Add Picture
                    
                  </Button>: null
                }

                  {
                    picturePath !== "" && (
                      <FlexBetween >
                      <img  width="100%"
                      height="auto"
                      style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }} src={picturePath}/>
                      
                    </FlexBetween>

                    )
                  }        
                </Box>
              </>
            </Box>

            <Box>
            <Button
              fullWidth
              type="submit"
              onClick={handleRegister}
              sx={{
                m: "2rem 0",
                p: "1rem",
                backgroundColor: palette.primary.main,
                color: palette.background.alt,
                "&:hover": { color: palette.primary.main },
              }}
            >
              
              {isLogin ? "LOGIN" : "REGISTER"}
            </Button>
            <Typography
              onClick={() => {
                setPageType(isLogin ? "register" : "login");
              }}
              sx={{
                textDecoration: "underline",
                color: palette.primary.main,
                "&:hover": {
                  cursor: "pointer",
                  color: palette.primary.light,
                },
              }}
            >
              {isLogin
                ? "Don't have an account? Sign Up here."
                : "Already have an account? Login here."}
            </Typography>
          </Box>
      </div>

     )}
{isLogin && (              
<Formik
      onSubmit={handleFormSubmit}
      initialValues={isLogin && initialValuesLogin }
      validationSchema={isLogin && loginSchema }
      >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        resetForm,
      }) => (
      
      <form onSubmit={handleSubmit}>
          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
            }}
          >

            <TextField
              label="Email"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.email}
              name="email"
              error={Boolean(touched.email) && Boolean(errors.email)}
              helperText={touched.email && errors.email}
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              label="Password"
              type="password"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.password}
              name="password"
              error={Boolean(touched.password) && Boolean(errors.password)}
              helperText={touched.password && errors.password}
              sx={{ gridColumn: "span 4" }}
            />
          </Box>

          {/* BUTTONS */}
          <Box>
            <Button
              fullWidth
              type="submit"
              sx={{
                m: "2rem 0",
                p: "1rem",
                backgroundColor: palette.primary.main,
                color: palette.background.alt,
                "&:hover": { color: palette.primary.main },
              }}
            >
              {isLogin ? "LOGIN" : "REGISTER"}
            </Button>
            <Typography
              onClick={() => {
                setPageType(isLogin ? "register" : "login");
                resetForm();
              }}
              sx={{
                textDecoration: "underline",
                color: palette.primary.main,
                "&:hover": {
                  cursor: "pointer",
                  color: palette.primary.light,
                },
              }}
            >
              {isLogin
                ? "Don't have an account? Sign Up here."
                : "Already have an account? Login here."}
            </Typography>
          </Box>
        </form>
      )}
    </Formik>
)}
 </>);

};

export default Form;