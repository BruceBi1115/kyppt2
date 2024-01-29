import React, {useEffect, useState} from "react"
import NavBar from "../components/NavBar";
import ScrollButtons from "../components/ScrollButtons";
import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    ChakraProvider, CircularProgress,
    FormControl,
    FormLabel,
    Heading,
    HStack, Input,
    Link,
    Menu,
    MenuButton,
    MenuItem,
    MenuList, NumberDecrementStepper, NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Radio,
    RadioGroup,
    SimpleGrid,
    Text
} from "@chakra-ui/react";
import Footer from "../components/Footer";
import {ChevronDownIcon} from "@chakra-ui/icons";
import fake_users from "../components/fakeusers";

function ManageUsers(){


    const [filtering, set_filtering] = useState(false);
    const [records,set_records] = useState("");
    const [filter_role, set_filter_role] = useState("");

    useEffect(()=>{
        set_records(fake_users)
        },[]
    )

    const num_entries_perpage = 20;
    const page_number_choices = 5;//show 5 page numbers at a time
    const [num_current, setnum_current] = useState(1);
    let pagebuttons = [];

    for (let i=1;i<=Math.ceil(records.length/num_entries_perpage);i++){
        pagebuttons.push(
            <Button bg={i===num_current ?"#E64626":"#EDF2F7"} color="black" size = "xs" fontSize ="12px" colorScheme='orange'
                    onClick={()=>setnum_current(i)}>{i}</Button>
        )
        //console.log("current:"+num_current+" this i:"+i+" "+ (i===num_current));
    }

    function myForm(label,id,isDate:boolean){
        return(
            <FormControl>
                <FormLabel>{label}</FormLabel>
                <Input borderColor="black" variant="flushed" id={id}
                       w={"15vw"} type={isDate?"datetime-local":"text"}
                />
            </FormControl>
        )
    }

    function clearall (){
        document.getElementById("username").value=null;
        document.getElementById("userid").value=null;
        document.getElementById("location").value=null;
        set_filter_role("");
        document.getElementById("from_date").value=null;
        document.getElementById("to_date").value=null;
    }

    function apply(){
        const from_date = document.getElementById("from_date").value;
        const to_date = document.getElementById("to_date").value;

        const paras = ["username", "userid", "location"]
        const new_records = [];

        for (let i = 0;i<fake_users.length;i++) {
            let pass = true;
            // check if fits those four input fields
            for (let j = 0; j < paras.length; j++) {
                let input = document.getElementById(paras[j]).value;
                let goal = fake_users[i][paras[j]];

                if (input.trim().length > 0) {
                    if (!goal.toString().toLowerCase().includes(input.toString().toLowerCase())) {
                        pass = false;
                    }
                }

            }
            // check if fits the drop-list fields

            if (filter_role !== "") {
                if (filter_role !== fake_users[i].role) {
                    pass = false;
                }
            }

            const left = new Date(from_date);
            const right = new Date(to_date);
            const current = new Date(fake_users[i].last_login);

            // check date domains
            if (from_date !== "" && to_date === "") {
                if (current < left)
                    pass = false
            } else if (from_date === "" && to_date !== "") {
                if (current > right)
                    pass = false
            } else if (from_date !== "" && to_date !== "") {
                if (current > right || current < left)
                    pass = false
            }

            if (pass)
                new_records.push(fake_users[i])

            set_records(new_records)
            set_filtering(true);
            setTimeout(() => {
                set_filtering(false)
            }, 500)//let user wait for half a second
        }

    }

    function reload(){
        clearall()
        set_filtering(true);
        setTimeout(()=>{
            set_records(fake_users);
            set_filtering(false)
        },500)//let user wait for half a second
    }

    return (

        <>
            <ChakraProvider>
                <NavBar />
                <ScrollButtons/>
                <Box minH={"100vh"} mt="7vh" mb={"15vh"} mr={"6vh"} ml={"6vh"}>
                    <Accordion allowMultiple={true}  mb={"4vh"} mt ="7vh" >
                        <AccordionItem borderColor={"black"} >
                            <AccordionButton _hover = {{bg:'rgba(230, 70, 38, 0.80)'}}
                                             _expanded={{ bg: 'rgba(230, 70, 38, 0.92)', color: 'white' }}>
                                <Box as="span" flex='1' textAlign='left'>
                                    Expand filters
                                </Box>
                                <AccordionIcon />
                            </AccordionButton>
                            <AccordionPanel>
                                <Text as={"b"}>You can filter the users by specific details</Text>
                                <HStack mt="10px" mb={"20px"}>
                                    {myForm("User Name","username",)}
                                    {myForm("User ID","userid",)}
                                    <FormControl>
                                        <FormLabel>Role</FormLabel>
                                        <Menu>
                                            <MenuButton bg="white" border="1px" fontSize="sm" w="12vw" as={Button} rightIcon={<ChevronDownIcon />}>
                                                {filter_role}
                                            </MenuButton>
                                            <MenuList>
                                                <MenuItem onClick={()=>set_filter_role("Normal")}>Normal</MenuItem>
                                                <MenuItem onClick={()=>set_filter_role("Admin")}>Admin</MenuItem>
                                                <MenuItem onClick={()=>set_filter_role("")}>(None)</MenuItem>
                                            </MenuList>
                                        </Menu>
                                    </FormControl>

                                    {myForm("Login Location","location",)}

                                </HStack>

                                <Text as={"b"}>Domain filtering (If left blank, the date/response time will be considered as infinity.)</Text>

                                <HStack mt="10px" >
                                    <HStack gap = "3vw" mr={"3vw"}>
                                        {myForm("Last login from date ...","from_date",true)}
                                        {myForm("to date ...","to_date",true)}
                                    </HStack>
                                </HStack>

                                <HStack mt="5vh" justifyContent={"start"} w={"full"}>
                                    <Link onClick={()=>clearall()} bg={"white"} mr={"25px"}>Clear Inputs</Link>
                                    <Link bg={"white"} onClick = {()=>apply()}>Apply</Link>
                                </HStack>
                            </AccordionPanel>
                        </AccordionItem>
                    </Accordion>
                    <Button border={"1px"} bg={"white"} mb={"4vh"} onClick = {()=>reload()}>Clear filters and reload</Button>
                    <SimpleGrid columns = {4} gap = {10}>
                        {
                            records &&
                            !filtering ?
                            records.slice((num_current-1)*num_entries_perpage,num_current*num_entries_perpage).map((item,index)=>
                                <Card shadow = "md" border={"1px"} w={"20vw"} h = "22vw">
                                    <CardHeader borderTopRadius={"5px"} bg={item.role ==="Admin"?"#E64626":"grey"}>

                                    </CardHeader>
                                    <CardBody>
                                        <Text as = "b">{item.username}</Text>
                                        <Text>ID: {item.userid}</Text>
                                        <Text>Role: {item.role} user</Text>
                                        <Text>Last login: {item.last_login}</Text>
                                        <Text>Login location: {item.location}</Text>

                                    </CardBody>
                                    <CardFooter justifyContent = "space-between" mr = "10px">
                                        <Text size={"xs"}>{index + 1 + (num_current - 1) * num_entries_perpage}</Text>
                                        <Link> Actions</Link>
                                    </CardFooter>
                                </Card>

                            ):
                            <Box align = "center" minH={ "60vh"} w={"88vw"} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                                <CircularProgress isIndeterminate color='#E64626'></CircularProgress>
                            </Box>
                        }
                    </SimpleGrid>

                    <HStack margin={"20px"} justifyContent={"center"}>
                        <Button bg={"#EDF2F7"} color="black" size = "xs" fontSize ="12px"
                                onClick={()=>setnum_current(1)}>Front</Button>
                        <br></br>
                        {
                            num_current-Math.floor(page_number_choices/2)>1 ?
                                <>
                                    {pagebuttons.slice(num_current-Math.floor(page_number_choices/2)-1,
                                        num_current-Math.floor(page_number_choices/2)-1+page_number_choices)}
                                </>
                                :
                                <>
                                    {pagebuttons.slice(0,page_number_choices)}
                                </>
                        }
                        <br></br>
                        <Button bg={"#EDF2F7"} color="black" size = "xs" fontSize ="12px"
                                onClick={()=>setnum_current(pagebuttons.length)}>End</Button>
                        <br></br>
                    </HStack>

                    <HStack margin={"10px"} justifyContent={"center"}>
                        <Text fontSize = "xs" as={"b"}>{Math.ceil(records.length/num_entries_perpage)} pages in total</Text>
                        <NumberInput id={"step"} itemType={"number"} precision = {0} size='xs' w = "4vw"
                                     max={Math.ceil(records.length/num_entries_perpage)}
                                     defaultValue={1} step={1} min= {1}>
                            <NumberInputField />
                            <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                        </NumberInput>
                        <Button bg={"#EDF2F7"} color="black" size = "xs" fontSize ="12px" colorScheme='orange'
                                onClick={()=>{
                                    setnum_current(+document.getElementById("step").value)}}>Go</Button>
                        <br></br>
                    </HStack>

                </Box>
                <Footer />



            </ChakraProvider>

        </>
    )
}

export default ManageUsers;