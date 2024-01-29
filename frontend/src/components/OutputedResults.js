import React, { useState } from 'react';
import {
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Table,
    TableContainer,
    Tbody,
    Th,
    Thead,
    Tr,
    Button,
    HStack,
    Text,
} from '@chakra-ui/react';
import CustomTd from "./CustomTd";

interface Inputs {
    results: any;
    num_instances_perpage: number;
    category: string;
}

function OutputedResults({ results, num_instances_perpage, category }: Inputs) {
    //current page number, default is one
    const [num_current, setnum_current] = useState(1);
    //how many entries are displayed per page
    const page_number_choices = 20;
    //an array contains the page buttons
    let pagebuttons = [];
    //load buttons into the array
    //results.length / num_instances_perpage -> get how many buttons in total
    for (let i = 1; i <= Math.ceil(results.length / num_instances_perpage); i++) {
        pagebuttons.push(
            <Button key={i} bg={i === num_current ? "#E64626" : "#FEECCA"} color="black" size="xs" fontSize="12px" colorScheme='orange'
                    onClick={() => setnum_current(i)}>{i}</Button>
        );
    }
    //for displaying the search results for type LOCATION
    const renderLocationRows = () => {
        return results.slice((num_current - 1) * num_instances_perpage, num_current * num_instances_perpage)
            .map((location, index) => {
                let decisionContent = location.kypp_decision;
                if (location.kypp_decision === 'Insufficient data') {
                    // modify the content a bit
                    decisionContent = "No match due to insufficient data";
                }
                return (
                    <Tr key={index} >
                        {/*country*/}
                        <CustomTd rownum={index + (num_current - 1) * num_instances_perpage + 1} content={location.country} />
                        {/*decision*/}
                        <CustomTd content={decisionContent} />
                    </Tr>
                );
            });
    };


    return (
        <>
            <TableContainer>
                {category === "Location" ? (
                    // results for Location
                    <Table variant='striped' colorScheme={"orange"}>
                        <Thead bg={"#E64626"}>
                            <Tr>
                                <Th fontSize="md" textAlign="center" color="black">Country</Th>

                                <Th fontSize="md" textAlign="center" color="black">Matched</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {renderLocationRows()}
                        </Tbody>
                    </Table>
                ) : (
                    // results for Entity and Individual
                    <Table className={"table"} variant='striped' colorScheme={"orange"}>
                        <Thead bg={"#E64626"}>
                            <Tr>
                                <Th textAlign="center" w="20%" color="black">Name</Th>
                                <Th textAlign="center" w="20%" color="black">Aliases/Subsidiaries</Th>
                                <Th textAlign="center" color="black">Location</Th>
                                <Th textAlign="center" color="black">Additional Location</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {/*results are displayed page by page, so it is sliced*/}
                            {results.slice((num_current - 1) * num_instances_perpage, num_current * num_instances_perpage).map((item, index) => (
                                <Tr key={index}>
                                    <CustomTd rownum={index + (num_current - 1) * num_instances_perpage + 1}
                                              content={item.entity_name || item.individual_name} />
                                    <CustomTd content={item.aliases} />
                                    <CustomTd content={item.location_1} />
                                    <CustomTd content={item.location_2} />
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                )}
            </TableContainer>

            <HStack margin={"20px"} justifyContent={"center"}>
                <Button bg={"#FEECCA"} color="black" size="xs" fontSize="12px" colorScheme='orange'
                        onClick={() => setnum_current(1)}>Front</Button>
                {/* Pagination buttons */}
                {num_current - Math.floor(page_number_choices / 2) > 1 ?
                    <>{pagebuttons.slice(num_current - Math.floor(page_number_choices / 2) - 1, num_current - Math.floor(page_number_choices / 2) - 1 + page_number_choices)}</>
                    :
                    <>{pagebuttons.slice(0, page_number_choices)}</>
                }
                <Button bg={"#FEECCA"} color="black" size="xs" fontSize="12px" colorScheme='orange'
                        onClick={() => setnum_current(pagebuttons.length)}>End</Button>
            </HStack>
            <HStack margin={"10px"} justifyContent={"center"}>
                <Text fontSize="xs" as={"b"}>{pagebuttons.length} pages in total</Text>
                <NumberInput id={"step"} itemType={"number"} precision={0} size='xs' w="4vw" defaultValue={1} step={1} min={1} max={pagebuttons.length}>
                    <NumberInputField />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
                <Button bg={"#FEECCA"} color="black" size="xs" fontSize="12px" colorScheme='orange'
                        onClick={() => { setnum_current(+document.getElementById("step").value); }}>Go</Button>
            </HStack>
        </>
    );
}

export default OutputedResults;
