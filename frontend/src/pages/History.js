import React, {useEffect, useState} from 'react';
import {
    Box,
    ChakraProvider,
    Table,
    TableContainer,
    Td,
    Th,
    Thead,
    Tr,
    Tbody,
    useToast,
    Skeleton,
    Button,
    Text,
    Input,
    HStack,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionIcon,
    AccordionPanel,
    FormControl,
    FormLabel,
    Link,
    Radio,
    RadioGroup,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper, Menu, MenuButton, MenuList, MenuItem, Heading, CircularProgress
} from '@chakra-ui/react'
import NavBar from "../components/NavBar";
import ScrollButtons from "../components/ScrollButtons";
import Footer from "../components/Footer";
import {ChevronDownIcon} from "@chakra-ui/icons";
import fake_data from "../components/fakedata"

function History(){
    const num_entries_perpage = 20;
    const page_number_choices = 5;//show 5 page numbers at a time
    const [num_current, setnum_current] = useState(1);

    const [basic_filter,set_basic_filter] = useState("");
    const [basic_order,set_basic_order] = useState("1");
    const [advance_order,set_advance_order] = useState("1");

    const [filter_result, setfilter_result]= useState("");
    const [filter_type,setfilter_type] = useState("");
    const [filter_from_time,set_filter_from_time] = useState("");
    const [filter_to_time,set_filter_to_time] = useState("");
    const [filter_question, set_filter_question] = useState("");

    const [filtering, set_filtering] = useState(false);

    const [records, set_records] = useState(fake_data);// USE FAKEDATA FOR NOW

    let pagebuttons = [];
    for (let i=1;i<=Math.ceil(records.length/num_entries_perpage);i++){
        pagebuttons.push(
            <Button bg={i===num_current ?"#E64626":"#EDF2F7"} color="black" size = "xs" fontSize ="12px" colorScheme='orange'
                    onClick={()=>setnum_current(i)}>{i}</Button>
        )
        //console.log("current:"+num_current+" this i:"+i+" "+ (i===num_current));
    }

    function myTh(text){
        return(
            <Th textAlign={"center"} color={"black"}>
                <Text>{text}</Text>
            </Th>
        )
    }
    function myTd(text,index){
        return(
            <Td fontSize={"14px"}>
                <Box h = "6vh" maxW ="10vw" overflowX={"auto"}>
                <Text align = "center">{text}</Text>
                <Text fontSize="10px" align = "start">{index}</Text>
                </Box>
            </Td>)
    }
    function myForm(label,id,isDate:boolean){
        return(
            <FormControl>
                <FormLabel>{label}</FormLabel>
                <Input borderColor="black" variant="flushed" id={id}
                       w={"10vw"} type={isDate?"datetime-local":"text"}
                />



            </FormControl>
        )
    }

    function clearall(){
        set_basic_filter("")
        set_basic_order("1")
        setfilter_result("")
        setfilter_type("")
        document.getElementById("username").value=null;
        document.getElementById("userid").value=null;
        document.getElementById("location").value=null;
        document.getElementById("term").value=null;
        document.getElementById("from_date").value=null;
        document.getElementById("to_date").value=null;
        document.getElementById("from_time").value=null;
        document.getElementById("to_time").value=null;

        set_filter_from_time("")
        set_filter_to_time("")
        set_filter_question("")
    }

    function applyBasic(array){
        let ids ={
            "User Name":"username",
            "User ID": "userid",
            "Login Location": "location",
            "Searched Term": "term",
            "Searched Type": "type",
            "Date And Time": "date",
            "Response Time": "time",
            "Questionnaire State": "questionnaire",
            "Result": "result"
        }

        let key = ids[basic_filter]
        if (basic_filter !== ""){
            if (basic_order === "1"){
                if (basic_filter === "User ID") {
                    array.sort((a, b) => a[key] - b[key])

                }else{
                    array.sort((a, b) => a[key].localeCompare(b[key]))
                }
            }else{
                if (basic_filter === "User ID"){
                    array.sort((a, b) => b[key]-a[key])
                }else{
                    array.sort((a, b) => b[key].localeCompare(a[key]))
                }
            }
        }
        return array;

    }

    function applyAdvanced(){
        const username = document.getElementById("username").value;
        const userid = document.getElementById("userid").value;
        const location = document.getElementById("location").value;
        const term = document.getElementById("term").value;
        const type = filter_type;
        const from_date = document.getElementById("from_date").value;
        const to_date = document.getElementById("to_date").value;
        const from_time = document.getElementById("from_time").value;
        const to_time = document.getElementById("to_time").value;
        const question = filter_question;
        const result = filter_result;
        const order = advance_order;// 1 is asc, 2 is desc

        // console.log(username);
        // console.log(userid);
        // console.log(location);
        // console.log(term);
        // console.log(type);
        console.log(from_date);
        console.log(to_date);
        // console.log(from_time);
        // console.log(to_time);
        // console.log(result);
        // console.log(order)
        // console.log(question)

        if (from_date > to_date && to_date!==""){
            console.log("error date")
        }else if (parseFloat(from_time) > parseFloat(to_time)){
            console.log("error time")
        }

        //TODO:SEND_SQL_TO_BACKEND?

        const paras = ["username", "userid", "location", "term"]
        const new_records = [];
        const paras_2 = {"type": filter_type, "questionnaire":filter_question, "result":filter_result}
        for (let i = 0;i<fake_data.length;i++){
            let pass = true;
            // check if fits those four input fields
            for (let j = 0;j<paras.length;j++){
                let input = document.getElementById(paras[j]).value;
                let goal = fake_data[i][paras[j]];
                if (input.trim().length >0){
                    if (!goal.toString().toLowerCase().includes(input.toString().toLowerCase())){
                        pass = false;
                    }
                }
            }
            // check if fits the drop-list fields
            for (const key in paras_2){
                if (paras_2[key].trim().length >0){
                    if (paras_2[key] !== fake_data[i][key]){
                        pass = false;
                    }
                }
            }
            const left = new Date(from_date);
            const right = new Date(to_date);
            const current = new Date(fake_data[i].date);

            // check date domains
            if (from_date !== "" && to_date === ""){
                if (current < left)
                    pass = false
            }else if (from_date === "" && to_date !== ""){
                if (current  > right)
                    pass = false
            }else if (from_date !== "" && to_date !== ""){
                if (current  > right || current < left)
                    pass = false
            }

            // check response time domains
            const res = parseFloat(fake_data[i].time);
            const up = parseFloat(to_time);
            const down = parseFloat(from_time)

            if (from_time !== "" && to_time === ""){
                if (res < down)
                    pass = false
            }else if (from_time === "" && to_time !== ""){
                if (res  > up)
                    pass = false
            }else if (from_time !== "" && to_time !== ""){
                if (res  > up || res < down)
                    pass = false
            }

            if (pass)
                new_records.push(fake_data[i])
        }

        set_records(applyBasic(new_records))
        set_filtering(true);
        setTimeout(()=>{
            set_filtering(false)
        },500)//let user wait for half a second

    }

    function reload(){
        clearall()
        set_filtering(true);
        setTimeout(()=>{
            set_records(fake_data);
            set_filtering(false)
        },500)//let user wait for half a second
    }



    return (

        <>
            <ChakraProvider>
                <NavBar />
                <ScrollButtons/>


                <Box minH={"100vh"} mt="7vh" mb={"15vh"} mr={"6vh"} ml={"6vh"}>
                    <Accordion allowMultiple={true}  mb={"4vh"}>
                        <AccordionItem borderColor={"black"} >
                            <AccordionButton _hover = {{bg:'rgba(230, 70, 38, 0.80)'}}
                                             _expanded={{ bg: 'rgba(230, 70, 38, 0.92)', color: 'white' }}>
                                <Box as="span" flex='1' textAlign='left'>
                                    Expand filters
                                </Box>
                                <AccordionIcon />
                            </AccordionButton>
                            <AccordionPanel>
                                <HStack gap = {10} mt="20px">
                                    <Text as={"b"}>Sort the table by </Text>
                                    <Menu>
                                        <MenuButton bg="white" border="1px" fontSize="sm" w="12vw" as={Button} rightIcon={<ChevronDownIcon />}>
                                            {basic_filter}
                                        </MenuButton>
                                        <MenuList>
                                            <MenuItem onClick={()=>set_basic_filter("User Name")}>User Name</MenuItem>
                                            <MenuItem onClick={()=>set_basic_filter("User ID")}>User ID</MenuItem>
                                            <MenuItem onClick={()=>set_basic_filter("Login Location")}>Login Location</MenuItem>
                                            <MenuItem onClick={()=>set_basic_filter("Searched Term")}>Searched Term</MenuItem>
                                            <MenuItem onClick={()=>set_basic_filter("Searched Type")}>Searched Type</MenuItem>
                                            <MenuItem onClick={()=>set_basic_filter("Date And Time")}>Date And Time</MenuItem>
                                            <MenuItem onClick={()=>set_basic_filter("Response Time")}>Response Time</MenuItem>
                                            <MenuItem onClick={()=>set_basic_filter("Questionnaire State")}>Questionnaire State</MenuItem>
                                            <MenuItem onClick={()=>set_basic_filter("Result")}>Result</MenuItem>
                                        </MenuList>
                                    </Menu>
                                </HStack>
                                <RadioGroup onChange={set_basic_order} isDisabled={basic_filter===""} value = {basic_filter===""?null:basic_order}>
                                    <HStack mt="5vh" mb={"5vh"}>
                                        <Radio mr={"10px"} transition="0.4s" _checked={{background:"#E64626"}} value='1'>
                                            Ascending alphabetical/numeric order</Radio>
                                        <Radio transition="0.4s"  _checked={{background:"#E64626"}} value='2'>
                                            Decending alphabetical/numeric order</Radio>
                                    </HStack>
                                </RadioGroup>

                                <Text as={"b"}>You can filter the table by more specific details</Text>
                                <HStack mt="10px" mb={"20px"}>
                                    {myForm("User Name","username",)}
                                    {myForm("User ID","userid",)}
                                    {myForm("Login Location","location",)}
                                    {myForm("Searched Term","term")}
                                    <FormControl>
                                        <FormLabel>Searched Type</FormLabel>
                                        <Menu>
                                            <MenuButton bg="white" border="1px" fontSize="sm" w="8vw" as={Button} rightIcon={<ChevronDownIcon />}>
                                                {filter_type}
                                            </MenuButton>
                                            <MenuList>
                                                <MenuItem onClick={()=>setfilter_type("Entity")}>Entity</MenuItem>
                                                <MenuItem onClick={()=>setfilter_type("Individual")}>Individual</MenuItem>
                                                <MenuItem onClick={()=>setfilter_type("Location")}>Location</MenuItem>
                                                <MenuItem onClick={()=>setfilter_type("")}>(None)</MenuItem>
                                            </MenuList>
                                        </Menu>
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>Questionnaire State</FormLabel>
                                        <Menu>
                                            <MenuButton bg="white" border="1px" fontSize="sm" w="10vw" as={Button} rightIcon={<ChevronDownIcon />}>
                                                {filter_question}
                                            </MenuButton>
                                            <MenuList>
                                                <MenuItem onClick={()=>set_filter_question("Submitted")}>Submitted</MenuItem>
                                                <MenuItem onClick={()=>set_filter_question("Not submitted")}>Not Submitted</MenuItem>
                                                <MenuItem onClick={()=>set_filter_question("")}>(None)</MenuItem>
                                            </MenuList>
                                        </Menu>
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>Result</FormLabel>
                                        <Menu>
                                            <MenuButton bg="white" border="1px" fontSize="sm" w="10vw" as={Button} rightIcon={<ChevronDownIcon />}>
                                                {filter_result}
                                            </MenuButton>
                                            <MenuList>
                                                <MenuItem onClick={()=>setfilter_result("Matches found")}>Matches found</MenuItem>
                                                <MenuItem onClick={()=>setfilter_result("No match found")}>No match found</MenuItem>
                                                <MenuItem onClick={()=>setfilter_result("")}>(None)</MenuItem>
                                            </MenuList>
                                        </Menu>
                                    </FormControl>

                                </HStack>

                                <Text as={"b"}>Domain filtering (If left blank, the date/response time will be considered as infinity.)</Text>

                                <HStack mt="10px" >
                                    <HStack gap = "3vw" mr={"3vw"}>
                                        {myForm("From date ...","from_date",true)}
                                        {myForm("To date ...","to_date",true)}
                                    </HStack>

                                    <HStack gap = "3vw">
                                        <FormControl>
                                            <FormLabel>Responsed from ...</FormLabel>
                                            <NumberInput defaultValue={null} precision={2} step={0.1}
                                                         onChange={(val) => set_filter_from_time(val)}
                                                         value={filter_from_time}
                                                         w = "10vw"
                                            >
                                                <NumberInputField id={"from_time"}  border="1px" />
                                                <NumberInputStepper>
                                                    <NumberIncrementStepper />
                                                    <NumberDecrementStepper />
                                                </NumberInputStepper>
                                            </NumberInput>
                                        </FormControl>

                                        <FormControl>
                                            <FormLabel>to ... seconds</FormLabel>
                                            <NumberInput defaultValue={null} precision={2} step={0.1}
                                                         onChange={(val) => set_filter_to_time(val)}
                                                         value={filter_to_time}
                                                         w = "10vw"
                                            >
                                                <NumberInputField id={"to_time"}  border="1px" />
                                                <NumberInputStepper>
                                                    <NumberIncrementStepper />
                                                    <NumberDecrementStepper />
                                                </NumberInputStepper>
                                            </NumberInput>
                                        </FormControl>
                                    </HStack>
                                </HStack>

                                <HStack mt="5vh" justifyContent={"start"} w={"full"}>
                                    <Link onClick={()=>clearall()} bg={"white"} mr={"25px"}>Clear Inputs</Link>
                                    <Link bg={"white"} onClick = {()=>applyAdvanced()}>Apply</Link>
                                </HStack>
                            </AccordionPanel>
                        </AccordionItem>
                    </Accordion>
                    <Button border={"1px"} bg={"white"} mb={"4vh"} onClick = {()=>reload()}>Clear filters and reload</Button>
                    { filtering?
                        <Box align = "center" minH={ "50vh"}>
                            <CircularProgress isIndeterminate color='#E64626'></CircularProgress>
                        </Box>
                        :
                        <>
                        <TableContainer>
                            <Table variant='striped' colorScheme={"gray"} >
                                <Thead bg={"#E64626"} >
                                    <Tr>
                                        {myTh("User Name")}
                                        {myTh("User ID")}
                                        {myTh("Login location")}
                                        {myTh("Searched term")}
                                        {myTh("Searched type")}
                                        {myTh("Date and time")}
                                        {myTh("Response time/s")}
                                        {myTh("Questionnaire State")}
                                        {myTh("Result")}
                                    </Tr>
                                </Thead>
                                <Tbody >
                                    {
                                        records.slice((num_current-1)*num_entries_perpage,num_current*num_entries_perpage)
                                            .map((item, index) =>
                                            <Tr>
                                                {myTd(item.username, index + 1 + (num_current - 1) * num_entries_perpage)}
                                                {myTd(item.userid, null)}
                                                {myTd(item.location, null)}
                                                {myTd(item.term, null)}
                                                {myTd(item.type, null)}
                                                {myTd(item.date, null)}
                                                {myTd(item.time, null)}
                                                {myTd(item.questionnaire, null)}
                                                {myTd(item.result, null)}
                                            </Tr>
                                        )
                                    }
                                </Tbody>
                            </Table>
                        </TableContainer>

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
                        </>
                    }

                </Box>
                <Footer />

            </ChakraProvider>

        </>
    )

}
export default History;