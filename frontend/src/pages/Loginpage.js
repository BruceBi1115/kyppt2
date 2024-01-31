import React, { useState } from 'react';

import {
    Box, Button,
    Card,
    CardBody,
    CardHeader, FormLabel, Grid, GridItem,
    Heading,
    HStack,
    IconButton,
    Image, Input, InputGroup, InputRightElement,
    Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay,
    Text, useDisclosure, useToast,
    VStack
} from "@chakra-ui/react";
import { ChakraProvider } from '@chakra-ui/react';

import { useNavigate } from "react-router-dom";

import SimpleNavBar from "../components/SimpleNavBar";
import bg1 from "../assets/bg1.jpg"
import {keyframes} from "@emotion/react";

import Footer from "../components/Footer";
import {FormControl} from "@mui/material";
import {ViewIcon, ViewOffIcon} from "@chakra-ui/icons";

function Loginpage() {
    const [isLoggingin, setisLoggingin]  = useState(false);//indicating the button if is in loading state
    const [registering, setRegistering] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();// prepare for navigating to other pages
    const toast = useToast();// prepare for website msg
    const { isOpen, onOpen, onClose } = useDisclosure() // controls the admin login pop-up
    const [show, setShow] = React.useState(false)// show the password or not, for admin login

    // The image's animation
    const coverAnimation = keyframes `
        from { opacity :0.8 ;}
        to { opacity: 1;}
    `
    const cover_animation = `${coverAnimation} 0.7s ease-in-out `

    const postData = async (url = '', data = {}) => {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const responseData = await response.json();
        return { status: response.status, data: responseData };
    };

    const handleLogin = async () => {
        setisLoggingin(true)//button is in loading state, can not be clicked

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;


        try {
            const { status, data } = await postData('http://127.0.0.1:8000/auth/login/', { email, password });
            console.log(data);

            if (status === 200) {
                console.log("Login successful", data);
                toast({
                    title: "Login Successful",
                    description: "Redirecting...",
                    status: "success",
                    duration: 500,
                    isClosable: true,
                });
                setTimeout(() => {
                    navigate("/search");

                }, 500);
            } else if (status === 401) {
                setErrorMessage("Invalid credentials");
            } else {

                setErrorMessage("An error occurred during login");
            }
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage("An error occurred: " + error.message);
        }
        setTimeout(() => {
            setisLoggingin(false);//let the button stop loading

        }, 500);

    };

    const handleRegister = async () => {
        const email = document.getElementById('register_email').value;
        const password = document.getElementById('register_password').value;
        const confirmPassword = document.getElementById('register_confirm_password').value;
        const role = 'user';
        const username = document.getElementById('username').value;
        const firstName = document.getElementById('first_name').value;
        const lastName = document.getElementById('last_name').value;


        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            const { status, data } = await postData('http://127.0.0.1:8000/auth/users/', { username, email, password, role, firstName, lastName });


            if (status == 201 ) {
                console.log("Registration successful",data);
                toast({
                    title: "Registration Successful",
                    description: "You have successfully registered.",
                    status: "success",
                    duration: 500,
                    isClosable: true,
                });
                setRegistering(false);
                setTimeout(() => {
                    navigate("/search");
                }, 500);
            } else {

                setErrorMessage("Registration failed: " + (data.message || "Unknown error"));
            }
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage("An error occurred: " + error.message); }

    };

    // Open the admin login window
    function adminLoginWindow(){
        onOpen();
    }

    return (
        <ChakraProvider>
            {/*A simplified navigaiton bar for login page only*/}
            <SimpleNavBar/>
            {/*Images, texts and buttons ...*/}
            <Box position = "relative" minH ="100vh"
                 fontFamily = "Calibri" backgroundImage = {bg1} animation = {cover_animation}>
                <VStack
                        h = "fit-content"
                        zIndex = "2001"
                        pt={"10vh"}
                        mb={"90vh"}
                        ml={"5vw"}
                        justifyContent = "end"
                        alignItems = "start">
                        <Heading
                            fontSize = "30px">Know Your Partner & Project Tool.</Heading>
                        <Text fontSize = "20px" >
                            A streamlined due diligence check of prospective
                            partners <br />and activities for potential risks.</Text>

                        <Text fontSize = "16px" >
                            Please login through Login using your UniKey.
                        </Text>

                        <Text fontSize = "16px" >
                            Encounter a problem? Contact us by
                            <Link color={"blue"} href="mailto:anti.slavery@sydney.edu.au"> anti.slavery@sydney.edu.au
                            </Link>
                        </Text>
                        <HStack>
                            <Button marginRight = "10vw" marginTop = "2vw" borderRadius = "10px" w = "8vw" _hover={{
                                color: "white",
                                transition: "500ms" }} bg = "#E64626"
                                    onClick = {()=>navigate("/search")}>
                                Login</Button>
                            <Button onClick = {()=>adminLoginWindow()} marginRight = "10vw" marginTop = "2vw"
                                    borderRadius = "10px" w = "8vw" _hover={{
                                color: "white",
                                transition: "500ms" }} bg = "#E64626">
                                Admin Login</Button>
                        </HStack>


                </VStack>
                <Footer />
            </Box>

            {/*Admin login window*/}
            <Modal
                motionPreset='slideInBottom'
                isCentered={true}
                isOpen={isOpen}
                onClose={onClose}
            >
                <ModalOverlay />
                <ModalContent w = "25vw">
                    <ModalHeader borderTopRadius={"5px"} bg={"#E64626"}>Login as a staff</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pt={9} pb={8} align = "center">
                        <FormControl>
                            <FormLabel>Username</FormLabel>
                            <Input w="20vw" placeholder='Username' />
                        </FormControl>
                        <FormControl >
                            <FormLabel mt={"10px"} >Password</FormLabel>
                            <InputGroup>
                                <Input border={"1px"} w="20vw"  type={show ? 'text' : 'password'} placeholder='Password' />
                                <InputRightElement>
                                    <IconButton bg="none" _hover={{background: "none"}}
                                                onClick={()=>setShow(!show)} icon={show?<ViewOffIcon/>:<ViewIcon/>}>
                                    </IconButton>
                                </InputRightElement>
                            </InputGroup>
                        </FormControl>
                    </ModalBody>
                    <ModalFooter >
                        <HStack>
                            <Button  bg={"orange"} _hover={{background:"white"}}>Register</Button>
                            <Button  bg={"#E64626"} _hover={{background:"white"}} onClick = {()=>navigate("/search")}
                            >Login</Button>
                        </HStack>
                    </ModalFooter>
                </ModalContent>
            </Modal>


        </ChakraProvider>
    );
}

export default Loginpage;
