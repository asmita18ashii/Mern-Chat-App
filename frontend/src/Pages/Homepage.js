import {
  Box,
  Container,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";
import './Homepage.css';
import ResetPass from "../components/Authentication/ResetPassword";
import { Player } from "@lottiefiles/react-lottie-player";
import loadingImg from  "../animations/loading.json"
function Homepage() {
  const history = useHistory();
  const [forgotTab, setForgotTab] = useState(false);

  const handleTabClick = (event, panelId) => {
    const tabs = document.querySelectorAll('.tab');
    const panels = document.querySelectorAll('.tab-panel');

    tabs.forEach(tab => tab.classList.remove('active'));
    panels.forEach(panel => panel.style.display = 'none');

    if (event) {
      event.currentTarget.classList.add('active');
    }
    document.getElementById(panelId).style.display = 'block';
  };

  const handleForgotPass = (e) => {
    setForgotTab(true)
    handleTabClick(e, 'reset-pass-panel')
  }

  const handleLoginTab = (e) => {
    setForgotTab(false)
    handleTabClick(e, 'login-panel')
  }
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) history.push("/chats");
  }, [history]);

  return (
    <Container maxW="xl" centerContent>
      <Box
        display="flex"
        justifyContent="center"
        p={3}
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderColor="rgb(6, 36, 101)"
        borderWidth="2px"
      >
        <Text fontSize="5xl" fontFamily="fantasy" fontWeight="500" color="rgb(6, 36, 101)" fontStyle="Bold">
          <Player
            autoplay
            loop
            mode="normal"
            src={{loadingImg}} style={{ width: "300px", height: "300px" }}
          ></Player>
        </Text>
      </Box>
      <Box display="flex"
        justifyContent="center"
        p={3}
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderColor="rgb(6, 36, 101)"
        borderWidth="2px">

        <div className="tabs">
          <ul className="tab-list">
            {
              !forgotTab &&
              <>
                <li
                  className="tab active"
                  onClick={(e) => handleLoginTab(e)}
                >
                  Login
                </li>
                <li
                  className="tab"
                  onClick={(e) => handleTabClick(e, 'signup-panel')}
                >
                  SignUp
                </li>
              </>
            }

            {
              forgotTab &&
              <>
                <li
                  className="tab active"
                >
                  Reset Password
                </li>
                <li
                  className="tab"
                  onClick={(e) => handleLoginTab(e)}
                >
                  Login
                </li>
              </>
            }
          </ul>
          <div id="login-panel" className="tab-panel">
            <Login />
            <small
              className='forget-txt'
              onClick={(e) => handleForgotPass(e)}>
              Forgot Password?
            </small>
          </div>
          <div id="signup-panel" className="tab-panel" style={{ display: 'none' }}>
            <Signup />
          </div>
          <div id="reset-pass-panel" className="tab-panel" style={{ display: 'none' }}>
            <ResetPass onCompletion={handleLoginTab} />
          </div>
        </div>
      </Box>

    </Container>
  );
}

export default Homepage;
