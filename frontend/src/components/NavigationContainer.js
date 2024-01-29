import React from 'react';
import {
    Box, Button, HStack,
    PopoverArrow, PopoverBody,
    PopoverCloseButton,
    PopoverContent, PopoverFooter,
    PopoverHeader,
    PopoverTrigger, Text,
    useDisclosure
} from "@chakra-ui/react";
import {ButtonGroup, Popover} from "@mui/material";

interface Content{
    index:number;
    title:string;
    description:string;
    action: ()=>void;
}


function NavigationContainer( {index,title,description, action}:Content){
    return (
        <>

            <PopoverHeader pt={4} fontWeight='bold' border='0'>
                {title}
            </PopoverHeader>
            <PopoverArrow bg='#E64626' />
            <PopoverBody>
                {description}
            </PopoverBody>
            <PopoverFooter
                border='0'
                display='flex'
                alignItems='center'
                justifyContent='space-between'
                pb={4}
            >
                <Text fontSize='sm'>Step {index} of 3</Text>
                {/*previous and next button*/}
                <HStack>
                    {
                        index!==1?<Button border = "1px" h="4vh" color="black" bg="white" variant="outline" onClick={()=>action(-1)}>
                            Previous</Button>:""
                    }

                    <Button h="4vh" border = "1px" color="black" bg="white" variant="outline" onClick={()=>action(1)}>
                        {index!==3? "Next" : "Finish"}
                    </Button>
                </HStack>
            </PopoverFooter>
        </>
    )
}

export default NavigationContainer;