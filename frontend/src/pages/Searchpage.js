import React, {useRef, useState} from 'react';
import axios from 'axios';
import "./Searchpage.css"
import {
    Popover,
    Circle,
    CircularProgress,
    Link,
    PopoverArrow,
    PopoverBody,
    PopoverCloseButton, PopoverContent,
    PopoverFooter,
    PopoverHeader,
    PopoverTrigger,
    Spinner,
    Tab,
    TabIndicator,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Tooltip,
    VStack,
    useDisclosure, ModalOverlay, Modal, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter,
} from '@chakra-ui/react'
import {
    Box, Button,
    Card,
    CardBody,
    CardHeader, Divider,
    HStack,
    IconButton,
    Image, Input, InputGroup, InputLeftElement, InputRightElement,
     Menu, MenuButton, MenuItem, MenuList,
    Text,
    Container,
    Portal,

} from "@chakra-ui/react";
import {ChakraProvider, useToast,} from '@chakra-ui/react'
import searchicon from "../assets/searchicon.png"
import sendicon from "../assets/send.png"
import dropdownicon from "../assets/dropdown.png"
import Footer from "../components/Footer";
import {motion} from "framer-motion";
import {keyframes} from "@emotion/react";
import OutputedResults from "../components/OutputedResults";
import ScrollButtons from "../components/ScrollButtons";
import NavigationContainer from "../components/NavigationContainer";
import {ArrowForwardIcon} from "@chakra-ui/icons";
import NavBar from "../components/NavBar";
import Questionnaire from "../components/Questionnaire";

//Construction file for the website's  "Search" page.

function Searchpage(){
    const buttonText = "Search Types";// the default text on the drop list button
    const toast = useToast();// for the website messages' pop-ups
    const [searchType, setSearchType] = useState(buttonText);//selected type from the drop list, but not processed to search yet
    const [searchedType, setsearchedType] = useState("");//the type that being processed in search function

    const [success,setsuccess] = useState(false);//found a match or not?
    const [isLoading, setisLoading] = useState(false);//loading?
    const [input, setInput]  = useState("");//the search term that user typed in the input box.

    //Is there a new questionnaire avaliable? If so, display a red indicator.
    const [newQuestion, setnewQuestion] = useState(false);
    const [results, setResults] = useState([]);//the search results got from the backend
    const num_instances_perpage = 20;//how many search results are displayed per page in the search box.
    const num_too_much = 10; // warns the user if the search reuslt exceeds this number
    const [tab_index, set_tab_index] = useState(0);

    const [missing_term,set_missing_term] = useState(false);//If the user forgot to input the search term.
    const [missing_type,set_missing_type] = useState(false);//If the user forgot to select a search type.

    const [scale,setscale]=useState(0)//The scale of the tutorial mode's popovers,initially 0

    // Controls the tutorial mode's popovers
    const {  isOpen: isOpen,onClose: onClose, onOpen:onOpen} = useDisclosure();
    // Controls the tutorial mode's dark background
    const { isOpen: isOpen2, onOpen: onOpen2, onClose: onClose2 } = useDisclosure();
    // Controls the pop-up after there is a match found after searching
    const {  isOpen: isOpen3,onClose: onClose3, onOpen:onOpen3} = useDisclosure();

    const [step, setstep] = useState(0);// which step the tutorial mode is currently at

    // switch the steps in the tutoral mode, currently the tuturial mode contains 3 steps in total
    // value can be positive/negative, represents move forward/backward
    function change_step(value){
        // if the step exceeds 3, reset to 0. 0 means the tutorial mode is not launched yet.
        if (step + value >3){
            setstep(0)
            onClose2()
        }else{ // move steps
            setstep(step + value)
        }
    }

    // some texts that shown in the website's messages
    // found a match
    const system_sucess = "Your search has returned a match or close match to one or several entities" +
            " in the Know Your Partner & Project database. " +
            "Please review the option(s) below to identify if the entity you are" +
            " engaging with is listed.";
    // nothing found
    const system_fail = "Your search has not returned a match with an entity in the " +
        "Know Your Partner & Project database. Please make sure you have used the correct " +
        "spelling for the entity name and left off any company designations " +
        "(e.g. limited/ltd; corporation/corp; incorporated/inc; plc)";
    // the location searched has insufficient data
    const location_insufficient = "The location you searched is not included on the Know Your Partner & Project database," +
        " as there is insufficient data to assess the country."

    // Update the search type state with the selected item's text
    const handleMenuItemClick = (text) => {
        setSearchType(text);
    };

    // define the animation of the indicator of a new questionnaire
    const reddotAnimation = keyframes`
      0% { transform: scale(1)}
      50% { transform: scale(1.5)}
      100% { transform: scale(1)}
    `;
    const red_animation = `${reddotAnimation} 1.5s ease-in-out infinite`;

    // the searching function area's animation when the user enters the Search page.
    const searchAnimation = keyframes`
        0% {transform: scale(0)}
        50% {transform: scale(0)}
        100% {transform: scale(1)}
    `;
    const search_animation = `${searchAnimation} 0.50s ease-in-out`;

    // when clicking the tab, change the tab's index, otherwise it will stuck
    const handleTabsChange = (index) => {
        set_tab_index(index)
    }
    // redirect the user to the questionnaire's tab
    function go_to_questionnarie(){
        set_tab_index(1);
        setnewQuestion(false);
        onClose3();
    }

    // The search funciton, contains searching logics
    function search() {
        const search_string = document.getElementById("search_string").value;//get the search term
        // reset the error checker and the searched type.
        set_missing_term(false)
        set_missing_type(false)
        setsearchedType(false)
        // close all website messages
        toast.closeAll();
        // switch to the search result's tab
        set_tab_index(0);

        // Check if the user typed an empty string or nothing
        if (search_string.trim().length === 0){
            set_missing_term(true)
            toast({//show the website message when input is empty
                title: "Invalid search",
                description: "Please input a search term.",
                status: "warning",
                position: "bottom-right",
                duration: null,// never close until clicking the close button
                isClosable: true,
            })
        }else if (searchType === buttonText){// Check if the user didn't select a type
            set_missing_type(true)
            toast({//web msg pop-up
                title: "Invalid search type",
                description: "Please select a search type.",
                status: "warning",
                position: "bottom-right",
                duration: null,
                isClosable: true,
            })
        }else {// no input errors, ready to search
            setisLoading(true)// now the website is searching (loading)
            setsuccess(false)// no result found yet
            setsearchedType(searchType)// confirm the type that will be processed in the search function
            setInput(search_string)// confirm the inputed search term
            ///start to search
            setTimeout(()=>{
                axios.get(`http://172.31.39.251:8000/api/search`, {
                    params: {query: search_string, type: searchType}
                }).then(response => {
                    setResults(response.data.results)// get the search results
                    // console.log(response.data.results)
                    setisLoading(false);// loading is finished

                    // see if there is anything found
                    if (response.data.results.length > 0) {
                        // if the user searched a location, and there is only one result with insufficient data
                        if (searchType === "Location" && response.data.results.length ===1 &&
                            response.data.results[0].kypp_decision === 'Insufficient data'){

                            // count this as a success because something is returned from the search
                            setsuccess(true);
                            // The questionnarie should not be avaliable in this scenario
                            setnewQuestion(false);
                            toast({//web msg pop-up
                                title: "Insufficient data",
                                description: location_insufficient,
                                colorScheme:"gray",
                                position: "bottom-right",
                                duration: null,
                                isClosable: true,
                            })
                        }else{
                            // match found ...
                            setsuccess(true);
                            // A new questionnaire is avaliable
                            setnewQuestion(true);
                            // open the dialog
                            onOpen3();

                            toast({//web msg pop-up
                                title: "Match(es) Found",
                                description: system_sucess,
                                status: "success",
                                position: "bottom-right",
                                duration: null,
                                isClosable: true,
                            });

                        }

                    } else {// there is nothing returned!
                        // Nothing found
                        setsuccess(false);
                        // The questionnarie should not be avaliable in this scenario
                        setnewQuestion(false);
                        toast({
                            title: "Nothing found",
                            description: system_fail,
                            status: "warning",
                            position: "bottom-right",
                            duration: null,
                            isClosable: true,
                        })
                    }
                }).catch(error => { // Error occured when searching in the backend

                    // Finished loading, no questionnaire, nothing returned
                    setisLoading(false);
                    setnewQuestion(false);
                    setsuccess(false);

                    toast({//web msg pop-up
                        title: "Error",
                        description: "Failed to fetch data.",
                        position: "bottom-right",
                        status: "error",
                        duration: null,
                        isClosable: true,
                    });
                    console.error('Error:', error);
                });
            },250);// after 0.25s, process the search logics

        }
    }


    return(

        <>
            <ChakraProvider>
                {/* The dark background in the tutorial mode */}
                <Modal closeOnOverlayClick={false} onClose={onClose2} isOpen={isOpen2}>
                    <ModalOverlay />
                    <ModalContent></ModalContent>
                </Modal>
                {/* The pop-up after there is a match found */}
                <Modal isCentered blockScrollOnMount={false} closeOnOverlayClick={false} isOpen={isOpen3} onClose={onClose3}>
                    <ModalContent>
                        <ModalHeader >Match(es) found!</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <Text fontWeight='bold' mb='1rem'>
                                {results.length} result(s) found in the database.
                            </Text>
                            {
                                success && results.length > num_too_much &&
                                <>
                                <Text>So many results!😵 Maybe try to
                                    narrow the search term to be more specific?</Text>
                                <br/>
                                </>
                            }

                            <Text>Do you wish to fill in a questionnaire to seek further support from the MSU team?</Text>
                        </ModalBody>

                        <ModalFooter>
                            <Button colorScheme='blue' mr={3} onClick={onClose3}>
                                Later
                            </Button>
                            <Button bg= "#E64626" onClick = {()=>go_to_questionnarie()}>Yes, take me to the questionnaire</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
                {/* Navigation bar on the top */}
                <NavBar />
                {/* Scroll up&down buttons on the right side */}
                <ScrollButtons />
                {/* Contains the searching functions' components... */}
                <VStack maxW={"100vw"} minH = "100vh" animation={search_animation}>
                    {/* Horizontally contains tutorial mode button, input box and drop-list */}
                    <HStack position = "relative" h = "fit-content" fontFamily={"Calibri"}
                            display = "flex" justifyContent = "center" marginTop = "15vh">
                        <Button  mr={"20px"} shadow={"md"} border = "1px" h={"7vh"} color={"black"} bg={"white"}
                                 onClick={()=>{setstep(1);onOpen2();onOpen();setscale(1)}}>Tutorial</Button>
                        <Popover
                            isOpen={step===1?isOpen:""}
                            onClose={onClose}
                            placement='top-start'
                            closeOnBlur={false}
                            flip = {false}
                            arrowSize={"10"}
                            overflow = "hidden"
                            fallbackPlacements="top"
                        >
                            <PopoverTrigger>
                                <InputGroup zIndex = {step===1?"1600":"1300"} w = "48vw" h={"7vh"}>
                                        <InputLeftElement  h = "7vh" >
                                            <Image  src = {searchicon} boxSize = {"4vh"} />
                                        </InputLeftElement>
                                        <Input id = "search_string"
                                               isDisabled={step === 1}
                                               _disabled={{background:"white"}}
                                               shadow = "md"
                                               border = {"1px"}
                                               borderColor = "black"
                                               bg ={missing_term?"red.100":"white"}
                                               h ="7vh" type='text'
                                               placeholder=' Input the search keyword'
                                        />
                                </InputGroup>
                            </PopoverTrigger>
                            <Box transform={`scale(${scale})`}  position = "relative" zIndex = {step===1?"1600":"1300"}>
                                <PopoverContent  color='black'  borderColor='black'>
                                    <PopoverCloseButton onClick = {()=>{setstep(0);onClose2();onClose()}}/>
                                    <NavigationContainer index={1}
                                                         title="1. Input a search term"
                                                         description={"Please enter FULL entity/individual/location name."}
                                                         action={change_step}
                                    />
                                </PopoverContent>
                            </Box>
                        </Popover>

                        <Popover
                            isOpen={step===3?isOpen:""}
                            onClose={onClose}
                            placement='left'
                            closeOnBlur={false}
                            flip = {false}
                            arrowSize={"10"}
                            overflow = "hidden"
                            fallbackPlacements="top"

                        >
                            <PopoverTrigger>
                                <Box zIndex={step===3?"1600":"1300"}>
                                    {!isLoading ?
                                        <Button  boxSize = {"5vh"}
                                                 isDisabled={step === 3}
                                                 _disabled={{background:"white"}}
                                                 bg={"white"}
                                                 h="7vh" w="7vh" border={"1px"} shadow = "md"
                                                 onClick={()=>{search()}} aria-label={"search"}>
                                            Start
                                        </Button>
                                        :<Button boxSize = {"5vh"} isLoading bg = "none" color='#E64626'/>
                                    }
                                </Box>
                            </PopoverTrigger>
                            <Box transform={`scale(${scale})`}  position = "relative" zIndex = {step===3?"1600":"1300"}>
                                <PopoverContent color='black'  borderColor='black'>
                                    <PopoverCloseButton onClick = {()=>{setstep(0);onClose2();onClose()}}/>
                                    <NavigationContainer index={3}
                                                         title="3. Start search"
                                                         description={"Then you can click this button to start a search."}
                                                         action={change_step}
                                    />
                                </PopoverContent>
                            </Box>
                        </Popover>
                        <Popover
                            isOpen={step===2?isOpen:""}
                            onClose={onClose}
                            placement='left'
                            closeOnBlur={false}
                            flip = {false}
                            fallbackPlacements="top"
                            arrowSize={"10"}
                            overflow = "hidden"
                        >
                            <PopoverTrigger >
                                <Box border = {"1px"}
                                     borderColor = "black"
                                     borderRadius = "6px"
                                     zIndex = {step===2?"1600":"1300"}
                                     ml={"20px"}
                                    >
                                    <Menu >
                                        <MenuButton bg ={missing_type?"red.100":"white"} h = "7vh"
                                                    isDisabled={step === 2}
                                                    _disabled={{background:"white"}}
                                                    w = {{xl:"11vw",md:"20vw"}} shadow={"md"}
                                                    fontSize={{ base: "12px", md: "16px", lg: "16px" }}
                                                    rightIcon= {<Image boxSize = "5vh" src = {dropdownicon} />} as={Button} >
                                            {searchType}
                                        </MenuButton>
                                        <MenuList >
                                            <MenuItem onClick={() => handleMenuItemClick('Entity')}>Entity</MenuItem>
                                            <MenuItem onClick={() => handleMenuItemClick('Individual')}>Individual</MenuItem>
                                            <MenuItem onClick={() => handleMenuItemClick('Location')}>Location</MenuItem>
                                        </MenuList>
                                    </Menu>
                                </Box>
                            </PopoverTrigger>
                            <Box transform={`scale(${scale})`}   position = "relative" zIndex = {step===2?"1600":"1300"}>
                                <PopoverContent color='black'  borderColor='black'>
                                    <PopoverCloseButton onClick = {()=>{setstep(0);onClose2();onClose()}}/>
                                    <NavigationContainer index={2}
                                                         title="2. Select a search type"
                                                         description={"Please indicate the category of the search term" +
                                                             " you just typed by choosing from this drop list."}
                                                         action={change_step}/>
                                </PopoverContent>
                            </Box>
                        </Popover>
                    </HStack>
                    {/* The search result & questionnaire's area */}
                    <Card border = {"1px"} borderColor = "grey" fontFamily={"Calibri"} w={"80vw"}
                          marginTop = "5vh" marginBottom = "15vh" shadow={"md"} h = "fit-content">
                        {/* Tabs containing search results and the questionnaire */}
                        <Tabs isFitted variant="unstyled" index = {tab_index}  onChange={handleTabsChange} align = "center" >
                            {/* The head of each tab */}
                            <TabList>
                                <Tab>Search results</Tab>
                                <Tab onClick={()=>
                                {setnewQuestion(false)}} >Fill in questionnaire for further support
                                {newQuestion && success &&
                                    <Tooltip defaultIsOpen placement = "top" label='You have a new
                                    questionnaire available!'>
                                    <Circle as={motion.div}
                                            animation={ red_animation} ml = "20px" boxSize={2}  bg='red.500' />
                                    </Tooltip>
                                }
                                </Tab>
                            </TabList>
                            {/* Tab head's underline style */}
                            <TabIndicator
                                height="2px"
                                bg="black"
                            />
                            {/* Contains each tab's contents */}
                            <TabPanels>
                                {/* Display search results */}
                                <TabPanel align="center">
                                    <CardHeader fontSize="20px" as="b">
                                        {
                                            missing_term  ?
                                                "This search is invalid. Please enter a search term and search again."
                                        :  missing_type ?
                                                "This search is invalid. Please select a search type and search again."
                                        :
                                            input ?
                                            "Search"+(isLoading?"ing ":" ")+"results for "+searchedType.toLowerCase()
                                            +": "+input+(!isLoading?" ("+results.length +" results)":"")
                                        :
                                            "You haven't started a search"
                                        }
                                        {
                                            success && results.length > num_too_much &&
                                                <Text>So many results!😵 Maybe try to
                                                    narrow the search term to be more specific?</Text >
                                        }
                                    </CardHeader>
                                    <Divider w={"80%"} mt="6px" marginLeft="10%"/>
                                    <CardBody textAlign={"center"} fontFamily={"Calibri"}>

                                        { missing_term ?
                                            "Please type the term you want to search in the input box"
                                        : missing_type ?
                                            "Please use the drop down menu located on the right side of the input box"
                                        : success && results.length > 0 ?
                                            (searchedType === "Location" ?
                                                (<OutputedResults results={results}
                                                             num_instances_perpage={num_instances_perpage}
                                                             category={"Location"}/>)
                                            :
                                            <OutputedResults results={results}
                                                     num_instances_perpage={num_instances_perpage}/>)
                                        : (
                                            !isLoading ?
                                            <Text align="center" fontFamily={"Calibri"} textColor={"grey"}>
                                                {input?"No results found for \""+input+"\" in the category of "+
                                                    searchedType.toLowerCase():
                                               "Input a search term and select a search type to start"}
                                            </Text>:
                                                <Spinner alignSelf = "center"
                                                                   color='#E64626' />
                                        )}
                                    </CardBody>
                                </TabPanel>
                                {/* Display questionnaire*/}
                                <TabPanel align = "center">
                                    <CardHeader fontSize = "20px" as="b"  >Questionnaire</CardHeader>
                                    <Divider w={"80%"} mt = "10px" marginLeft = "10%"/>
                                    <CardBody textAlign={"center"} fontFamily={"Calibri"}>
                                        {success ?
                                            searchedType === "Location" && results.length ===1 &&
                                            results[0].kypp_decision === 'Insufficient data' ?
                                                <>
                                                    <Text align = "center" textColor={"grey"} fontFamily={"Calibri"}>No
                                                        questionnaire avaliable. <br />For further support or information,
                                                        please contact the Modern Slavery Unit by emailing <Link
                                                            color={"blue"} href="mailto:anti.slavery@sydney.edu.au">
                                                            anti.slavery@sydney.edu.au
                                                        </Link>
                                                    </Text>

                                                </>

                                                :   <Questionnaire />

                                            :
                                            !isLoading ?
                                                <>
                                                    <Text align = "center" textColor={"grey"} fontFamily={"Calibri"}>No
                                                    questionnaire avaliable. <br />For further support or information,
                                                        please contact the Modern Slavery Unit by emailing <Link
                                                            color={"blue"} href="mailto:anti.slavery@sydney.edu.au">
                                                             anti.slavery@sydney.edu.au
                                                        </Link>
                                                        </Text>

                                                </>
                                                :
                                                <>
                                                    <CircularProgress alignSelf = "center"
                                                                      isIndeterminate color='#E64626' />
                                                </>
                                        }
                                    </CardBody>
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                    </Card>
                </VStack>
                <Footer></Footer>

            </ChakraProvider>
        </>
    )
}

export default Searchpage;