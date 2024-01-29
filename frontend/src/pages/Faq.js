import React, {useEffect, useState} from 'react';
import { VStack} from "@chakra-ui/react";
import {keyframes} from "@emotion/react";
import ScrollButtons from "../components/ScrollButtons";
import Footer from "../components/Footer";
import FAQcard from "../components/FAQcard";
import questions from "../components/questions";
import { useSpring, animated } from 'react-spring';
import {ChakraProvider} from '@chakra-ui/react'
import NavBar from "../components/NavBar";


//Construction file for the website's  "FAQ" page.


function Faq(){

    const AnimatedElement = ({ delay, children }) => {
        const [isVisible, setIsVisible] = useState(false);
        const props = useSpring({
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateX(0)' : 'translateX(-10vw)',
            config: { duration: 500 },
            delay
        });

        useEffect(() => {
            setIsVisible(true);
        }, []);

        return <animated.div style={props}>{children}</animated.div>;
    };


    const faqs = [];
    questions.forEach(
        (item, index )=>{
            faqs.push(
                <AnimatedElement delay = {index * 100}>
                    <FAQcard title={item.title} description={item.description} />
                </AnimatedElement>
            )
        }
    )

    return(

        <>
            <ChakraProvider>
                <NavBar />
                <ScrollButtons />

                <VStack  pt={"8vh"} minH = "50vh" spacing = "10px" mb={"15vh"}>
                    {
                        faqs
                    }

                </VStack>

                <Footer />
            </ChakraProvider>
        </>
    )
}

export default Faq;