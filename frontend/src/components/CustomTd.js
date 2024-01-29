import React from 'react';
import {
    Fade, HStack,
    Td,
    Tooltip,
    useClipboard, useDisclosure, useToast
} from '@chakra-ui/react'
import {
    Box,
    IconButton,
    Text,
} from "@chakra-ui/react";
import {CopyIcon, ExternalLinkIcon} from "@chakra-ui/icons";

interface Content{
    content: string;
    rownum: number;
}

//This is a custom table cell
function CustomTd({content, rownum}: Content){
    const { isOpen, onOpen,onClose } = useDisclosure();
    const { onCopy } = useClipboard(content);
    const toast = useToast();

    function copy(){//copy the content in one cell
        onCopy();
        toast({//alert when input is empty
            title: "Successfully copied!",
            description: "The content has been copied to the clipboard",
            status: "success",
            position: "bottom-right",
            duration: 1000,
            isClosable: true,
        })
    }
    return (
    <>
        <Td onMouseEnter={onOpen}
            onMouseLeave={onClose}>
            <Box  h={"30vh"} align="end" >
                <Box textAlign = "center" h={"25vh"} mb={"20px"} overflowY={"auto"}>
                    <Text>{content}</Text>
                </Box>
                <HStack justifyContent={"space-between"}>
                    <Text fontSize={"xs"}>{rownum}</Text>
                    <Fade in={isOpen}>
                        <Tooltip label='Copy'>
                            <IconButton onClick = {copy} size={"xs"} bg={"none"} _hover={{background: "grey"}} icon = {<CopyIcon  />} />
                        </Tooltip>
                        <Tooltip label='Search on Google'>
                            <IconButton onClick = {()=>window.open( 'http://www.google.com/search?q='+content)}
                                        size={"xs"} bg={"none"} _hover={{background: "grey"}} icon = {<ExternalLinkIcon />} />
                        </Tooltip>
                    </Fade>
                </HStack>
            </Box>
        </Td>
    </>)
}

export default CustomTd;