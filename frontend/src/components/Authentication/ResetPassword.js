import React, { useState } from 'react'
import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import axios from 'axios'
import { useToast } from "@chakra-ui/react";


const ResetPassword = ({ onCompletion }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false);
    const toast = useToast();

    const [loading, setLoading] = useState(false);
    const [confirmPassword, setConfirmPass] = useState('');

    const handleClick = () => setShow(!show);
    const handleClickShow = () => setShow2(!show);


    const submitHandler = async () => {
        setLoading(true);
        if (!email || !password) {
            // toast({
            //   title: 'Please fill all the fields',
            //   status: 'warning',
            //   duration: 3000,
            //   position: 'top-right',
            //   isClosable: true,
            // });
            setLoading(false);
            return;
        }

        try {
            const config = {
                headers: {
                    'Content-type': 'application/json'
                },
            };
            const { data } = await axios.put('http://localhost:5000/user/reset-password', { email, password }, config);

            toast({
              title: 'Login Successful.',
              status: 'success',
              duration: 3000,
              position: 'top-right',
              isClosable: true,
            });
            localStorage.setItem('userInfo', JSON.stringify(data));
            setLoading(false);
            onCompletion(); // For example, pass a new event or any required data
        } catch (err) {
            toast({
              title: 'Error Occurred!',
              description: err?.response?.data.message,
              status: 'error',
              duration: 3000,
              position: 'top-right',
              isClosable: true,
            });
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <FormControl id="email" isRequired>
                <FormLabel>Email Address</FormLabel>
                <Input
                    value={email}
                    type="email"
                    placeholder="Enter Your Email Address"
                    onChange={(e) => setEmail(e.target.value)}
                />
            </FormControl>

            <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup size="md">
                    <Input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type={show ? "text" : "password"}
                        placeholder="Enter password"
                    />
                    <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleClick}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id="password" isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup size="md">
                    <Input
                        value={confirmPassword}
                        onChange={(e) => setConfirmPass(e.target.value)}
                        type={show ? "text" : "password"}
                        placeholder="Enter password"
                    />
                    <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleClickShow}>
                            {show2 ? 'Hide' : 'Show'}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>

            {/* <div className="form-control">
                <label className='label'>Confirm Password</label>
                <div className="input-group">
                    <input className="input-box" type={show2 ? 'text' : 'password'} placeholder="Confirm password" onChange={(event) => setConfirmPass(event.target.value)} />
                    <button className='button-show' onClick={() => setShow2(!show2)}>{show2 ? 'Hide' : 'Show'}</button>
                </div>
            </div> */}

            {/* <button
                className="button-submit"
                onClick={submitHandler}
                disabled={loading}
            >
                {loading ? 'Loading...' : 'Submit'}
            </button> */}

            <Button
                backgroundColor="black"
                borderColor="rgb(6, 36, 101)"
                color="white"
                borderWidth="2px"
                width="100%"
                style={{ marginTop: 15 }}
                onClick={submitHandler}
                isLoading={loading}
                _hover={{
                    bg: "rgb(6, 36, 101)", // Background color on hover
                }}
                _active={{
                    bg: "rgb(6, 36, 101)", // Background color on hover
                }}
            >
                {loading ? 'Loading...' : 'Submit'}
            </Button>
        </div>
    );
}

export default ResetPassword
