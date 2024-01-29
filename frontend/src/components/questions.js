import React from "react";
import {Image, Text, VStack} from "@chakra-ui/react";
import { Link, Box } from '@chakra-ui/react';
import searchPage from "../assets/searchPage.png";
import posMatch from "../assets/posMatch.png";
import negMatch from "../assets/negMatch.png";
import invSearch from "../assets/InvalidSearch.png";
import questionnaire from "../assets/questionnaire.png";

const questions = [
    {title: "Do I need to use the KYPPT?",
        description:
            <VStack align={"start"}>
                <Text>Currently, the tool is being piloted by the Research portfolio:</Text>
                <Text style={{paddingLeft: '20px'}}>&#8226; Pre Award, Business Development Managers (BDM): Please use for due diligence of all prospective partners and projects in combination with the BDM Due Diligence Check.</Text>
                <Text style={{paddingLeft: '20px'}}>&#8226; Post Award: Please use to assess potential risks at contract negotiation in combination with the Contract Risk Tool.</Text>
            </VStack>
    },
    {title:"Why do I need to use the KYPPT?",
        description:
            <VStack align={"start"}>
                <Text>The tool supports us to ensure our research activities and partnerships are consistent with our University <Link href="https://www.sydney.edu.au/about-us/vision-and-values.html" color="blue" textDecoration="underline">values</Link>{' '}
                    and <Link href="https://intranet.sydney.edu.au/contacts-campuses/services/global-and-research-engagement/international-collaboration.html" color="blue" textDecoration="underline">principles on international collaboration</Link>{' '}
                    and are compliant with Australian laws and guidelines, including:</Text>
                <Text style={{paddingLeft: '20px'}}>&#8226; <Link href="https://www.dfat.gov.au/international-relations/security/sanctions" color="blue" textDecoration="underline">Australian autonomous sanctions</Link>,
                    which restrict activities involving sanctioned entities, countries and their citizens.</Text>
                <Text style={{paddingLeft: '20px'}}>&#8226; <Link href="https://www.legislation.gov.au/Details/C2018A00153" color="blue" textDecoration="underline">The Modern Slavery Act 2018</Link>
                    (Commonwealth), which requires the University to report annually on the steps we are taking to identify and address modern slavery risks across our operations, supply chain and business relationships.</Text>
                <Text style={{paddingLeft: '20px'}}>&#8226; <Link href="https://legislation.nsw.gov.au/view/whole/html/inforce/current/act-2018-030" color="blue" textDecoration="underline">The Modern Slavery Act 2018 (NSW)</Link>,
                    requires the University to demonstrate that we are taking reasonable steps to ensure the goods and services we engage are not the product of modern slavery.</Text>
                <Text style={{paddingLeft: '20px'}}>&#8226; The Australian Government's <Link href="https://www.education.gov.au/guidelines-counter-foreign-interference-australian-university-sector" color="blue" textDecoration="underline">Guidelines to counter foreign interference in the Australian university sector</Link>,
                    which recommend assessment of foreign collaborations.</Text>
                <Text style={{paddingLeft: '20px'}}>&#8226; The potential impacts of partnerships on national infrastructure, as defined under the <Link href="https://www.legislation.gov.au/Details/C2018C00506" color="blue" textDecoration="underline">National Security Legislation Amendment (Espionage and Foreign Interference) Act 2018</Link>{' '}
                    and <Link href="https://www.legislation.gov.au/Details/C2023C00376" color="blue" textDecoration="underline">Security of Critical Infrastructure Act 2018</Link></Text>
            </VStack>
    },
    {title:"How do I use the tool?",
        description:
        <VStack align="start">
            <Text>The pilot version of the KYPPT is a web-based tool, currently available only to University of Sydney staff.</Text>
            <Box mt={2}><Text fontWeight="bold" fontSize={20}>Entity and Individual</Text></Box>
            <Text style={{paddingLeft: '20px'}}> 1. From the login page, sign in using your university credentials.</Text>
            <Text style={{paddingLeft: '20px'}}> 2. You will then be navigated to the search page. Click the search cell and enter the name of the entity or individual.</Text>
            <Text style={{paddingLeft: '20px'}}> 3. Click the drop-down menu to the right and select the respective search type.</Text>
            <Text style={{paddingLeft: '20px'}}> 4. Click the search arrow to return results.</Text>
            <Text style={{paddingLeft: '20px'}}> 5. The tool will identify if you have a match or close match with an entity or individual in the KYPPT database. The tool will also show matches aliases or entity subsidiaries. Review the findings to see if the entity/individual matches with your search. A temporary pop-up on the bottom right of your screen displays this information.</Text>
            <Box textAlign="center">
                <Image src={posMatch} alt='posMatch'/>
                <Text sx={{ fontStyle: 'italic' }}>The page will look like this if a match is found</Text>
            </Box>
            <Box textAlign="center">
                <Image src={negMatch} alt='negMatch'/>
                <Text sx={{ fontStyle: 'italic' }}>The page will look like this if no match is found</Text>
            </Box>
            <Box textAlign="center">
                <Image src={invSearch} alt='invSearch'/>
                <Text sx={{ fontStyle: 'italic' }}>The page will look like this if the search box is empty or input is invalid</Text>
            </Box>
            <Text style={{paddingLeft: '20px'}}> 6. If you have a match on the KYPPT, navigate to the <b>Fill Questionnaire</b> tab and input the information. This will trigger an automatic email alert to Research, Risk and Security or the Modern Slavery Unit, who will be in touch within one week.</Text>
            <Box textAlign="center">
                <Image src={questionnaire} alt='questionnaire'/>
                <Text sx={{ fontStyle: 'italic' }}> [SCREENSHOT TO BE UPDATED]Upon positive match, fill in the following questionnaire for the Modern Slavery team to further review</Text>
            </Box>
            <Box mt={2}><Text fontWeight="bold" fontSize={20}>Location search – for research being conducted overseas (wholly or partially)</Text></Box>
            <Text style={{paddingLeft: '20px'}}> 1. From the login page, sign in using your university credentials.</Text>
            <Text style={{paddingLeft: '20px'}}> 2. You will then be navigated to the search page. Click the search cell and enter the country name.</Text>
            <Text style={{paddingLeft: '20px'}}> 3. Click the drop-down menu to the right and select the <b>location</b> search type.</Text>
            <Text style={{paddingLeft: '20px'}}> 4. Click the search arrow to return results.</Text>
            <Text style={{paddingLeft: '20px'}}> 5. The tool will identify if your research location matches with a sanctioned regime OR another location that poses potential risks. A temporary pop-up on the bottom right of your screen displays this information.</Text>
            <Text style={{paddingLeft: '20px'}}> 6. If you have a match on the KYPPT, navigate to the <b>Fill Questionnaire</b> tab and input the information.  This will trigger an automatic email alert to Research, Risk and Security or the Modern Slavery Unit, who will be in touch within one week.</Text>
        </VStack>
    },
    {title:"Which sources are included in the KYPPT?",
        description:
            <Text>The KYPPT includes risk information on over 20,000 entities, individuals and locations from publicly available, reputable sources. These are primarily government sources, such as the Australian Sanctions Consolidated List. The Tool also includes a select number of credible academic or non-government sources that provide risk information reported within the last 5 years.</Text>
    },
    {title:"How often is the KYPPT updated?",
        description:
            <Text>The pilot version of the KYPPT is updated fortnightly by the Modern Slavery Unit.</Text>
    },
    {title:"Which entities need to be checked on the KYPPT?",
        description:
            <Text>For the research pilot, all entities involved in the research (international or based in Australia) need to be searched. This includes companies, universities, research institutes and non-government organisations. You do not need to search for other universities based in Australia.</Text>
    },
    {title:"Which individuals need to be checked on the KYPPT?",
        description:
            <Text>For the research pilot, please check the name(s) of the Lead Investigator and/or main contact for the research partner, collaborator and/or funder.</Text>
    },
    {title:"Which locations need to be checked on the KYPPT?",
        description:
            <Text>For the research pilot, please check any countries where the research is being conducted outside Australia.</Text>
    },
    {title:"Do I need to search for the full entity or individual name?",
        description:
            <Text>No, if you have only the first part of an entity or individual name, the KYPPT will show you close matches to your search, along with the location of the entity or individual to help you identify them.</Text>
    },
    {title:"Do I need to report if I have a match with an alias or entity subsidiary?",
        description:
            <Text>Yes, if the Lead Investigator or prospective partner is listed as an alias or a subsidiary of an individual or entity on the KYPPT database, please disclose the individual/entity and the link to your search in the BDM Due Diligence Check or Contract Risk Tool. This project may require further assessment by Research, Risk and Security or the Modern Slavery Unit to determine the relationship between the activity and the listed individual or entity.</Text>
    },
    {title:"My search is listed twice or as an alias or subsidiary of more than one entity or individual.",
        description:
            <Text>As the tool draws on multiple sources of risk information, an entity or individual may appear more than once. Please review if the listings for the entity or individual and/or their aliases or subsidiaries appear to match your search and include all possible matches in the BDM Due Diligence Check or Contract Risk Tool. The Research, Risk and Security or the Modern Slavery Unit will review these matches.</Text>
    },
    {title:"I think there is an entity or individual missing from the KYPPT.",
        description:
            <VStack align={'Start'}>
                <Text>Please email <Link href="mailto:anti.slavery@sydney.edu.au" color="blue" textDecoration="underline">anti.slavery@sydney.edu.au</Link> if:</Text>
                <Text style={{paddingLeft: '20px'}}>&#8226; Your search returns no matches for an entity or individual you think should be included in the KYPPT database – for example an entity sanctioned in Australia; or</Text>
                <Text style={{paddingLeft: '20px'}}>&#8226; You have a suggestion for an additional source that should be included in the KYPPT.</Text>
            </VStack>
    },
    {title:"I’m having technical issues.",
        description:
            <VStack align={'Start'}>
                <Text>If you are having trouble using the KYPPT, please try:</Text>
                <Text style={{paddingLeft: '20px'}}>&#8226; Restart the KYPPPT web-tool.</Text>
                <Text style={{paddingLeft: '20px'}}>&#8226; Make sure you have connected to the internet.</Text>
                <Text style={{paddingLeft: '20px'}}>&#8226; Closing other web pages while using the Tool.</Text>
                <Text style={{paddingLeft: '20px'}}>&#8226; Double checking you have the correct spelling of the entity or individual name.</Text>
                <Text style={{paddingLeft: '20px'}}>&#8226; Leaving off company designations (e.g. pty ltd; corporation/corp; incorporated/inc; plc) AND quotation marks from your search.</Text>
                <Text style={{paddingLeft: '20px'}}>&#8226; Ensuring you have entered a search term and selected a search type before you click "start" button.</Text>\
                <Box mt={2}><Text>If you are still having technical issues, please email <Link href="mailto:anti.slavery@sydney.edu.au" color="blue" textDecoration="underline">anti.slavery@sydney.edu.au</Link>.</Text></Box>
            </VStack>
    },
]

export default questions;