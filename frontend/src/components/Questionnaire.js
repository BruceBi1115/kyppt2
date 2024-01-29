import {
    Button,
    FormLabel,
    HStack,
    Image,
    Input,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Text, Textarea, useToast,
    VStack
} from "@chakra-ui/react";
import dropdownicon from "../assets/dropdown.png";
import React, {useState} from "react";
import {FormControl} from "@mui/material";


const Questionnaire = ()=>{

    const toast = useToast();

    const [tooltype,settooltype] = useState(null);
    const [onWhat, setonWhat] = useState(null);

    const on_1 = "Possible partner or project with an entity that the University does not have existing relationship with them "
    const on_2 = "Possible partner or project with an entity that the University has an existing relationship with (the relationship does not need to be current) "
    const on_3 = "Partner or project that the University is already in discussions about (formal or informal) "
    const [other,setother] = useState(false);

    const [name_error,setname_error]=useState(false);
    const [email_error,setemail_error]=useState(false);
    const [inputs_error,setinputs_error]=useState(false);
    const [tooltype_error,settooltype_error] = useState(false);
    const [on_error,seton_error] = useState(false);
    const [reason_error, setreason_error] = useState(false);
    const [other_error, setother_error] = useState(false);
    const [body, set_body] = useState("");


    // The question label, with * to indicate that this field must be filled
    function label(text){
        return(
            <HStack gap={"0px"}>
                <FormLabel w={"fit-content"} >{text}</FormLabel>
                <FormLabel color = "red" >*</FormLabel>
            </HStack>
        )
    }

    // the input box for name, email....
    //for the last question, if the id is "other"(when the uesr choose "other" for the last question) enable the input box
    function inputbox(id,placeholder,errorMessage, width,func,error){
        return (
            <>
                <Input variant = "flushed" id={id}
                       isDisabled={id==="other"? !other :false}
                       mb = "10px" w={width?width:""}
                       type = "text"
                       placeholder={error?errorMessage:placeholder}
                       _placeholder={error?{color:"red"}:""}
                       onChange = {()=>func(false)}
                       borderColor={error?"red":"black"}
                />
            </>
        )
    }

    function submit(){
        //get each field's value
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const inputs = document.getElementById("inputs").value;
        const reason = document.getElementById("reason").value;
        const otherinfo  = document.getElementById("other").value;

        //digital?
        const regex = /\d/;
        //email format?
        const regex2 = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        //check if each filed is filled or not
        let pass = true;
        if (name.trim() === "" || regex.test(name)){//if name is empty, containing spaces only, or has numbers
            document.getElementById("name").value = ""
            setname_error(true)
            pass = false;
        }
        if (email.trim() === "" || !regex2.test(email)){
            document.getElementById("email").value = ""
            setemail_error(true)
            pass = false;
        }
        if (inputs.trim() === ""){
            setinputs_error(true)
            pass = false;
        }
        if (tooltype === null){
            settooltype_error(true)
            pass = false;
        }
        if (onWhat === null){
            seton_error(true)
            pass = false;
        }
        if (reason.trim() === ""){
            setreason_error(true)
            pass = false;
        }
        if (other && otherinfo.trim() === "" ){
            setother_error(true)
            pass = false;
        }

        //every field is filled
        if (pass) {
            //TODO:sendEmail....
            set_body(
                `
                    1. Name\n\n
                    ${document.getElementById("name").value}
                    2. Email\n\n
                    ${document.getElementById("email").value}
                    3. What was the name of the entity or individual or the country that you were searching?\n\n
                    ${document.getElementById("inputs").value}
                    4. Did you return a result in following search of the ...\n\n
                    ${tooltype}
                    5. Why were you searching this entity, individual or country?\n\n
                    ${document.getElementById("reason").value}
                    6. Is this a search on a ...\n\n
                    ${other ? document.getElementById("other").value : onWhat}
                `
            )
            //send email to MSU
            sendEmail();
        }


    }

    function toggle(obj){
        seton_error(false)
        setonWhat(obj)
        setother(false)
        setother_error(false)
    }



    function sendEmail(){

        window.Email.send({
            SecureToken : "cd6f5020-8f6c-4dbb-8b7c-6a46665eeccc",
            To : 'zhbi4108@uni.sydney.edu.au', // TODO: change to the email address of MSU
            From : 'knowyourpartnertool@gmail.com', // TODO: change to no-reply@sydney.edu.au
            Subject : "You have a new questionnaire!",
            Body : `
                User: <br /><br />
                
                1. Name<br />
                ${document.getElementById("name").value}<br /><br />
                2. Email\n<br />
                ${document.getElementById("email").value}<br /><br />
                3. What was the name of the entity or individual or the country that you were searching?<br />
                ${document.getElementById("inputs").value}<br /><br />
                4. Did you return a result in following search of the ...<br />
                ${tooltype}<br /><br />
                5. Why were you searching this entity, individual or country?<br />
                ${document.getElementById("reason").value}<br /><br />
                6. Is this a search on a ...<br />
                ${other?document.getElementById("other").value:onWhat}<br /><br />
                   `,
        }).then(message=>{
            if (message === "OK"){
                toast({
                    title: "Questionnaire has been sent!",
                    status: "success",
                    position: "top",
                    duration: 3*1000,
                    isClosable: true,
                })
            }else{
                toast({
                    title: "Failed to submit the questionnaire.",
                    status: "error",
                    position: "top",
                    duration: 3*1000,
                    isClosable: true,
                })
            }}
        );
    }



    return (
        <>

            <VStack textAlign = "start" marginInline={"20px"} >
                <Text>Your search using the Know Your Partner and Project Tool has identified a positive result.
                    If you would like the Modern Slavery Unit and the Research, Risk & Security Team to review your
                    search result and provide further information, please fill in the questionnaire below.
                    If you are completing the BDM Due Diligence Check or Contract Check List, these questions will
                    already be answered through those questionnaires. You do not need to complete this questionnaire.
                </Text>
                <VStack mt = "5vh" align = "start">
                    <FormControl>
                        {label("1. Name")}
                        {inputbox("name","Please type your name",
                            "Name with only letters is required!","30vw",setname_error,name_error)}


                        {label("2. Email")}
                        {inputbox("email","Please type your email",
                            "Email with correct format is required!","30vw",setemail_error,email_error)}

                        {label("3. What was the name of the entity or individual or the country that you were searching?")}
                        {inputbox("inputs","Please type what you have searched","Please provide your search term!",
                            null,setinputs_error,inputs_error)}
                    </FormControl>

                    {label("4. Did you return a result in following search of the ...")}
                    <Menu >
                        <MenuButton  h = "7vh"
                                     mb = "10px"
                                     bg = "white"
                                     border = "1px"
                                     value={"test"}
                                     borderColor = {tooltype_error?"red":"black"}
                                     w = {{xl:"11vw",md:"20vw"}} shadow={"md"}
                                     fontSize={{ base: "12px", md: "16px", lg: "16px" }}
                                     rightIcon= {<Image boxSize = "5vh" src = {dropdownicon} />} as={Button} >
                            {tooltype}
                        </MenuButton>
                        <MenuList >
                            <MenuItem onClick={()=>{settooltype_error(false);settooltype("Entity tool")}}>Entity tool</MenuItem>
                            <MenuItem onClick={()=>{settooltype_error(false);settooltype("Individual tool")}}>Individual tool</MenuItem>
                            <MenuItem onClick={()=>{settooltype_error(false);settooltype("Location tool")}}>Location tool</MenuItem>
                        </MenuList>
                    </Menu>

                    {label("5. Why were you searching this entity, individual or country?")}
                    <FormLabel>E.G., I am looking to procure goods and services from them,
                        they are a potential research funder or partner, etc. Please provide as much information as possible.</FormLabel>
                    <Textarea border= "1px" onChange = {()=>setreason_error(false)}
                              borderColor={reason_error?"red":"black"} id={"reason"} mb = "10px"
                              placeholder={reason_error?"Please provide your reason of using this tool!":'Please type the reason...'}
                    _placeholder={reason_error?{color:"red"}:""}></Textarea>

                    {label("6. Is this a search on a ...")}
                    <Menu >
                        <MenuButton  h = "7vh"
                                     mb = "10px"
                                     bg = "white"
                                     w = "full"
                                     textAlign={"start"}
                                     border = "1px"
                                     borderColor = {on_error?"red":"black"}
                                     shadow={"md"}
                                     fontSize={{ base: "12px", md: "16px", lg: "16px" }}
                                     rightIcon= {<Image boxSize = "5vh" src = {dropdownicon} />} as={Button} >
                            {onWhat}
                        </MenuButton>
                        <MenuList >
                            <MenuItem onClick={()=>{toggle(on_1)}}>{on_1}</MenuItem>
                            <MenuItem onClick={()=>{toggle(on_2)}}>{on_2}</MenuItem>
                            <MenuItem onClick={()=>{toggle(on_3)}}>{on_3}</MenuItem>
                            <MenuItem onClick={()=>{seton_error(false);setonWhat("Other (Please type below)");setother(true)}}>
                                Other (Please type below)</MenuItem>
                        </MenuList>
                    </Menu>
                    <FormControl required={true}>
                        {inputbox("other","","Need information here","50vw",
                            setother_error,other_error)}
                    </FormControl>


                    <Button mt= "10px" border = "1px" bg = "white" onClick={()=>submit()}>Submit</Button>
                </VStack>
            </VStack>


        </>
    )

}

export default Questionnaire;