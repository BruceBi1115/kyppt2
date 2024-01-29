import React from 'react';
import {
    Box,
    Card, Divider, HStack, Image, Link, Text, VStack
} from "@chakra-ui/react";
import usyd from "../assets/usyd.png";
import logo from "../assets/logo.png";

function Footer() {
    return (
        <>
            <VStack h ="15vh" bg = "#E64626" marginTop={"0vh"}>
                <HStack  spacing="3" paddingTop = "3vh">
                    <Image marginLeft = "1vw" src={usyd} w='5vw' alt='Logo' />
                    <Image marginLeft = "1vw" src={logo} boxSize='25px' alt='Logo' />
                    <Text as = "b" fontSize={{ base: "12px", md: "8px", lg: "11px" }} >Know Your Partner & Project Tool</Text>
                </HStack>
                <Divider margin = "5px" width = "50%" borderColor={'black'} />
                <HStack justifyContent={"space-between"} w = "30%"
                         paddingLeft = "5vw" paddingRight = "5vw">
                    {/*<Link fontSize={{ base: "12px", md: "8px", lg: "11px" }}>Disclaimer</Link>*/}
                    {/*<Link fontSize={{ base: "12px", md: "8px", lg: "11px" }}>Copyright</Link>*/}
                    {/*<Link fontSize={{ base: "12px", md: "8px", lg: "11px" }}>Feedback</Link>*/}
                </HStack>
            </VStack>
        </>
    )
}

export default Footer;