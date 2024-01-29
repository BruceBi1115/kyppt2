import React from 'react';
import {HStack, Image, Text} from "@chakra-ui/react";
import logo from "../assets/logo.png"
import usyd from "../assets/usyd.png"
const SimpleNavBar = () => {

    return (
        <>
            <HStack bg = "#E64626" fontFamily={"Calibri"} justifyContent='space-between' w="100%" h = "12vh"
                    shadow = "lg" zIndex={"2000"}
                    >
                <HStack  spacing="3">
                    <Image marginLeft = "1vw" src={usyd} w='10vw' alt='Logo' />
                    <Image marginLeft = "1vw" src={logo} boxSize='50px' alt='Logo' />
                    <Text as = "b" fontSize={{ base: "12px", md: "16px", lg: "22px" }} >Know Your Partner & Project Tool</Text>
                </HStack>
                <Text cursor = "pointer"
                    onClick = {()=>window.open( 'https://www.sydney.edu.au/about-us/vision-and-values/modern-slavery.html')}
                    _hover={{
                    color: "white",
                    transition: "500ms"
                }} as = "b" fontSize={{ base: "12px", md: "16px", lg: "22px" }} marginRight = "1vw">Modern Slavery Unit</Text>
            </HStack>
        </>
    );
}

export default SimpleNavBar;