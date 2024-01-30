import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Button,
    VStack,
    Text,
    Spinner,
    useToast,
    HStack
} from '@chakra-ui/react';
import { useDropzone } from 'react-dropzone';
import axios from "axios";
import { CloseIcon } from "@chakra-ui/icons";

const DropZone = ({ title, onFileAccepted, file, onRemove }) => {
    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            'application/vnd.ms-excel.sheet.macroEnabled.12': ['.xlsm']
        },
        multiple: false,
        onDropAccepted: files => onFileAccepted(files[0]),
    });

    return (
        <HStack {...getRootProps()} alignItems="center" style={{ border: '2px dashed gray', borderRadius: '8px', padding: '20px', textAlign: 'center', cursor: 'pointer', width: '100%' }}>
            <input {...getInputProps()} />
            <Text flex="1">{title}</Text>
            {file && (
                <HStack spacing={2}>
                    <Text>{file.name}</Text>
                    <CloseIcon cursor="pointer" onClick={() => onRemove()} />
                </HStack>
            )}
        </HStack>
    );
};

const UpdateOverlay = ({ isOpen, onClose }) => {
    const [selectedFiles, setSelectedFiles] = useState({});
    const [stage, setStage] = useState('');
    const [message, setMessage] = useState('');
    let max_length = 0;
    const toast = useToast();

    const handleFileAccepted = (fileType) => (file) => {
        setSelectedFiles(prev => ({...prev, [fileType]: file}));
    };

    const handleRemoveFile = (fileType) => {
        setSelectedFiles(prev => ({ ...prev, [fileType]: null }));
    };

    const handleClose = () => {
        // Reset states when closing the overlay
        setSelectedFiles({});
        setMessage('');
        setStage('');
        onClose(); // Call the original onClose prop or logic to close the overlay
    };

    const checkStatus = async (session_id) => {
        try {
            const response = await axios.get(`http://172.31.33.44/database/api/upload_progress/?session_id=${session_id}`);
            const { processed, total } = response.data;
            if (total > max_length){
                max_length = total
            }
            if (total && processed < total) {
                setMessage(`Processing data... ${processed}/${total} rows`);
                setTimeout(() => checkStatus(session_id), 2000);
            } else if (total && processed === max_length) {
                setMessage('Processing complete!');
                toast({
                    title: 'Success',
                    description: 'Files processed successfully',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
                setStage('');
                setSelectedFiles({});
                onClose();
            } else {
                setTimeout(() => checkStatus(session_id), 2000);
            }
        } catch (error) {
            console.error('Failed to get processing status:', error);
            setMessage('Error getting processing status.');
        }finally {
            max_length = 0;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStage('uploading');
        setMessage('Uploading files...');

        // Reset progress and status when starting a new upload
        const session_id = uuidv4();
        setSelectedFiles({});
        setMessage('');

        const formData = new FormData();
        formData.append('session_id', session_id);

        Object.keys(selectedFiles).forEach(key => {
            if (selectedFiles[key]) {
                formData.append(key, selectedFiles[key]);
            }
        });

        try {
            const uploadResponse = await axios.post(
                'http://172.31.33.44/database/api/upload_and_process',
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );

            if (uploadResponse.data.status === 'success') {
                setStage('processing');
                setMessage('Processing files...');
                checkStatus(session_id);
            } else {
                toastError('File upload failed');
            }
        } catch (error) {
            console.error('Error during file upload:', error);
            toastError('Error during file upload: ' + error.message);
        }
    };

    const toastError = (message) => {
        toast({
            title: 'Error',
            description: message,
            status: 'error',
            duration: 3000,
            isClosable: true,
        });
    };
    return (
        <Modal zIndex={"2000"} isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader>Update Database</ModalHeader>
                <ModalCloseButton/>
                <form onSubmit={handleSubmit}>
                    <ModalBody>
                        {stage ? (
                            <VStack spacing={4}>
                                <Text>{message}</Text>
                                <Spinner/>
                            </VStack>
                        ) : (
                            <VStack spacing={4}>
                                <DropZone
                                    title="Upload Entity File"
                                    onFileAccepted={handleFileAccepted('entity_file')}
                                    file={selectedFiles['entity_file']}
                                    onRemove={() => handleRemoveFile('entity_file')}
                                />
                                <DropZone
                                    title="Upload Individual File"
                                    onFileAccepted={handleFileAccepted('individual_file')}
                                    file={selectedFiles['individual_file']}
                                    onRemove={() => handleRemoveFile('individual_file')}
                                />
                                <DropZone
                                    title="Upload Location File"
                                    onFileAccepted={handleFileAccepted('location_file')}
                                    file={selectedFiles['location_file']}
                                    onRemove={() => handleRemoveFile('location_file')}
                                />
                            </VStack>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button bg={"#E64626"} mr={3} type="submit" isLoading={!!stage} loadingText={message}>
                            Upload Files
                        </Button>
                        <Button bg = "silver" onClick={onClose} disabled={!!stage}>Cancel</Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    );
};

export default UpdateOverlay;
