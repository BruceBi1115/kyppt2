import React from 'react';
import { useNavigate } from 'react-router-dom';
import {HStack, Image, Text, Box, Button , useDisclosure } from "@chakra-ui/react";
import logo from "../assets/logo.png"
import {keyframes} from "@emotion/react";
import UpdateOverlay from './UpdateOverlay';

const UserNavBar = () => {
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();
    function logout(){
        navigate("/")
    }

    const username = "xxx@xxx.com";

    const NavAnimation = keyframes `
        from {transform: translateY(-12vh);}
        to {transform: translateY(0);}
    `;
    const nav_animation = `${NavAnimation} 0.75s ease-in-out `


    return (
        <>
            <Box animation = {nav_animation}>

                <Box fontFamily={"Calibri"} bg = "#141414" h = "4vh"
                     display = "flex" alignItems={"center"} justifyContent={"end"}>
                    <Text marginRight={"1vw"} color={"whitesmoke"} fontSize={"12px"}>You've currently logged in as [{username}]</Text>
                </Box>

                <HStack bg = "#E64626" fontFamily={"Calibri"} justifyContent='space-between' w="100%" h = "12vh"
                        borderBottom = "0px" borderColor={"black"} paddingRight = "0vw" paddingLeft = "0vw"  shadow = "lg">
                    <HStack  spacing="3">
                        <Image marginLeft = "1vw" src={logo} boxSize='50px' alt='Logo' />
                        <Text as = "b" fontFamily={"Calibri"} fontSize={{ base: "12px", md: "16px", lg: "22px" }} >
                            Know Your Partner & Project Tool</Text>
                    </HStack>
                    <HStack>
                        <Button  bg= "none"
                                 fontSize={{ base: "10px", md: "14px", lg: "18px" }}
                                 w = "auto" h = "12vh" borderRadius = "0px"
                                 onClick = {()=>{ navigate("/search")}}
                                 _hover={{
                                     background: "white",
                                     transition: "500ms"
                                 }}>Search</Button>
                        <Button  bg= "none"
                                 fontSize={{ base: "10px", md: "14px", lg: "18px" }}
                                 w = "auto" h = "12vh" borderRadius = "0px"
                                 onClick = {()=>{ navigate("/faq")}}
                                 _hover={{
                                     background: "white",
                                     transition: "500ms"
                                 }}>FAQ</Button>
                        <Button  bg= "white"
                                 marginLeft={"1vw"}
                                 fontSize={{ base: "10px", md: "14px", lg: "18px" }}
                                 w = "auto" h = "12vh" borderRadius = "0px"
                                 onClick = {()=>{logout()}} _hover={{
                            background: "#141414",
                            color: "white",
                            transition: "500ms"
                        }}>Logout</Button>

                        {/*<Button bg= "blue.100" fontFamily={"Times New Roman"} w = "6vw" borderRadius = "15px" >Register</Button>*/}
                    </HStack>

                </HStack>

            </Box>
            <UpdateOverlay isOpen={isOpen} onClose={onClose} />
        </>
    );
}

export default UserNavBar;