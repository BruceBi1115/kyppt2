import React from 'react';
import NavBar from "../components/NavBar";
import {Box, IconButton, Image, Tooltip, VStack} from "@chakra-ui/react";
import usyd from "../assets/usyd.png";
import {TriangleDownIcon, TriangleUpIcon} from "@chakra-ui/icons";

import {ChakraProvider} from '@chakra-ui/react'
import {keyframes} from "@emotion/react";

function ScrollButtons(){

    const usydAnimation = keyframes`
      0% { opacity:0.5}
      50% { opacity:0.9}
      100% { opacity:0.5}
    `;
    const backtopAnimation = keyframes`
        0% {transform: translateX(10vw)}
        10% {transform: translateX(10vw) rotate(720deg)}
        100% {transform: translateX(0) rotate(0deg) }
    `;

    const usyd_animation = `${usydAnimation} 14s ease-in-out infinite`;
    const backtop_animation = `${backtopAnimation} 1s ease-in-out`;

    return(

        <>
            <ChakraProvider>


                <VStack  zIndex = "2000" top = "50%" right="1vw" position = "fixed">
                    <Tooltip label='Go top' placement='top'>
                        <IconButton animation = {backtop_animation} style={{'animationDelay': "-100ms"}}
                                    onClick={()=>{window.scrollTo({ top: 0, behavior: 'smooth' })}}
                                    bg = "#E64626" icon = {<TriangleUpIcon  color = {"black"}/>}

                        />
                    </Tooltip>
                    <Tooltip label='Go bottom' placement='bottom'>
                        <IconButton animation = {backtop_animation}
                                    onClick={()=>{window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth' })}}
                                    bg = "#E64626" icon = {<TriangleDownIcon  color = {"black"}/>}
                        />
                    </Tooltip>
                </VStack>
            </ChakraProvider>
        </>
    )
}

export default ScrollButtons;