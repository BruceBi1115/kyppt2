import React from "react";
import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Heading, HStack,
    Image,

} from "@chakra-ui/react";
import tag from "../assets/tag.png"
interface Content{
    title: string;
    description: string;
}


function FAQcard({title,description}:Content){

    return (
        <>
            <Accordion opacity = "0.98" fontFamily={"Calibri"} w = "70vw" zIndex={"600"}
                       allowMultiple bg={ "white"} borderRadius = "5px"
                       borderColor={"black"}
                       border = "1px"
                       shadow = "md"
            >
                <AccordionItem border = "none" >
                    <AccordionButton
                        _hover = {{bg:'rgba(230, 70, 38, 0.80)'}}
                        borderTopRadius="4px"
                        padding = "20px" justifyContent={"space-between"}
                        _expanded={{ bg: 'rgba(230, 70, 38, 0.92)', color: 'white' }}>
                        <HStack>
                            <Image src = {tag} boxSize = "50px" mr={"20px"}/>
                            <Heading as ="b" fontSize ="20px">{title}</Heading>
                        </HStack>
                        <AccordionIcon/>
                    </AccordionButton>

                    <AccordionPanel padding={"40px"}>
                        {description}
                    </AccordionPanel>
                </AccordionItem>
            </Accordion>
        </>
    )
}

export default FAQcard;